import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import {
  AttackDistribution,
  cappedRerollTransformer,
  DelayedHit,
  divisionTransformer,
  flatAddTransformer,
  HitDistribution,
  Hitsplat,
  linearMinTransformer,
  multiplyTransformer,
  WeaponDelayProvider,
  WeightedHit,
} from '@/lib/HitDist';
import { canUseSunfireRunes, getSpellMaxHit, isBindSpell } from '@/types/Spell';
import { PrayerData, PrayerMap } from '@/enums/Prayer';
import { isVampyre, MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  ALWAYS_MAX_HIT_MONSTERS,
  BA_ATTACKER_MONSTERS,
  CAST_STANCES,
  DEFAULT_ATTACK_SPEED,
  FLAT_ARMOUR,
  GLOWING_CRYSTAL_IDS,
  GUARDIAN_IDS,
  IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS,
  IMMUNE_TO_MELEE_DAMAGE_NPC_IDS,
  IMMUNE_TO_NON_SALAMANDER_MELEE_DAMAGE_NPC_IDS,
  IMMUNE_TO_RANGED_DAMAGE_NPC_IDS,
  NIGHTMARE_TOTEM_IDS,
  OLM_HEAD_IDS,
  OLM_MAGE_HAND_IDS,
  OLM_MELEE_HAND_IDS,
  ONE_HIT_MONSTERS,
  SECONDS_PER_TICK,
  TEKTON_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TTK_DIST_EPSILON,
  TTK_DIST_MAX_ITER_ROUNDS,
  USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS,
  VERZIK_P1_IDS,
} from '@/lib/constants';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { DetailKey } from '@/lib/CalcDetails';
import { Factor, MinMax } from '@/lib/Math';
import { AmmoApplicability, ammoApplicability, WEAPON_SPEC_COSTS } from '@/lib/Equipment';
import BaseCalc, { CalcOpts, InternalOpts } from '@/lib/BaseCalc';
import { scaleMonster, scaleMonsterHpOnly } from '@/lib/MonsterScaling';
import { CombatStyleType, getRangedDamageType } from '@/types/PlayerCombatStyle';
import { range, sum } from 'd3-array';
import { FeatureStatus } from '@/utils';
import UserIssueType from '@/enums/UserIssueType';

// https://oldschool.runescape.wiki/w/Category:Weapons_with_Special_attacks
// Some entries are intentionally omitted as they are not dps-related (e.g. dragon skilling tools, ivandis flail, dbaxe)
const UNIMPLEMENTED_SPECS: string[] = [
  'Abyssal bludgeon',
  'Abyssal dagger',
  'Abyssal tentacle',
  'Abyssal whip',
  'Ancient godsword',
  'Ancient mace',
  'Armadyl crossbow',
  'Armadyl godsword',
  'Barrelchest anchor',
  'Blue moon spear',
  'Bone dagger',
  'Brine sabre',
  'Dark bow',
  'Darklight',
  'Dawnbringer',
  "Dinh's bulwark",
  'Dorgeshuun crossbow',
  'Dragon 2h sword',
  'Dragon crossbow',
  'Dragon hasta',
  'Dragon knife',
  'Dragon longsword',
  'Dragon mace',
  'Dragon scimitar',
  'Dragon spear',
  'Dragon sword',
  'Dragon thrownaxe',
  'Dual macuahuitl',
  'Eclipse atlatl',
  'Eldritch nightmare staff',
  'Excalibur',
  'Granite hammer',
  'Granite maul',
  'Heavy ballista',
  'Light ballista',
  'Magic comp bow',
  'Magic longbow',
  'Magic shortbow',
  'Magic shortbow (i)',
  'Rune claws',
  'Saradomin sword',
  "Saradomin's blessed sword",
  'Seercull',
  'Soulreaper axe',
  'Staff of balance',
  'Staff of light',
  'Staff of the dead',
  'Toxic staff of the dead',
  'Ursine chainmace',
  'Volatile nightmare staff',
  'Webweaver bow',
  'Zamorak godsword',
  'Zamorakian hasta',
  'Zamorakian spear',
];

/**
 * Class for computing various player-vs-NPC metrics.
 */
export default class PlayerVsNPCCalc extends BaseCalc {
  private memoizedDist?: AttackDistribution;

  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    super(player, monster, opts);

    if (this.isSpecSupported() === FeatureStatus.UNIMPLEMENTED) {
      this.addIssue(UserIssueType.EQUIPMENT_SPEC_UNSUPPORTED, 'This loadout\'s weapon special attack is not yet supported in the calculator.');
    }
  }

  /**
   * Get the NPC defence roll for this loadout, which is based on the player's current combat style
   */
  public getNPCDefenceRoll(): number {
    if (this.opts.overrides?.defenceRoll !== undefined) {
      return this.track(DetailKey.NPC_DEFENCE_ROLL_FINAL, this.opts.overrides.defenceRoll);
    }

    let defenceStyle: CombatStyleType = this.player.style.type;
    if (this.opts.usingSpecialAttack) {
      if (this.wearing(['Dragon claws', 'Bandos godsword', 'Saradomin godsword', 'Dragon dagger', 'Dragon halberd', 'Crystal halberd'])) {
        defenceStyle = 'slash';
      } else if (this.wearing('Arclight')) {
        defenceStyle = 'stab';
      } else if (this.wearing('Voidwaker')) {
        // doesn't really matter since it's 100% accuracy but eh
        defenceStyle = 'magic';
      }
    }

    const level = this.track(
      DetailKey.NPC_DEFENCE_ROLL_LEVEL,
      defenceStyle === 'magic' && !USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS.includes(this.monster.id)
        ? this.monster.skills.magic
        : this.monster.skills.def,
    );
    const effectiveLevel = this.trackAdd(DetailKey.NPC_DEFENCE_ROLL_EFFECTIVE_LEVEL, level, 9);

    let bonus: number;
    if (defenceStyle === 'ranged') {
      const rangedType = getRangedDamageType(this.player.equipment.weapon!.category);
      bonus = rangedType === 'mixed'
        ? Math.trunc((this.monster.defensive.light + this.monster.defensive.standard + this.monster.defensive.heavy) / 3)
        : this.monster.defensive[rangedType];
    } else {
      bonus = this.monster.defensive[defenceStyle || 'crush'];
    }

    const statBonus = this.trackAdd(DetailKey.NPC_DEFENCE_STAT_BONUS, defenceStyle ? bonus : 0, 64);
    let defenceRoll = this.trackFactor(DetailKey.NPC_DEFENCE_ROLL_BASE, effectiveLevel, [statBonus, 1]);

    if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id) && this.monster.inputs.toaInvocationLevel) {
      defenceRoll = this.track(DetailKey.NPC_DEFENCE_ROLL_TOA, Math.trunc(defenceRoll * (250 + this.monster.inputs.toaInvocationLevel) / 250));
    }

    return this.track(DetailKey.NPC_DEFENCE_ROLL_FINAL, defenceRoll);
  }

  private getPlayerMaxMeleeAttackRoll(): number {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.PLAYER_ACCURACY_LEVEL, this.player.skills.atk + this.player.boosts.atk);
    for (const p of this.getCombatPrayers('factorAccuracy')) {
      effectiveLevel = this.trackFactor(DetailKey.PLAYER_ACCURACY_LEVEL_PRAYER, effectiveLevel, p.factorAccuracy!);
    }

    let stanceBonus = 8;
    if (style.stance === 'Accurate') {
      stanceBonus += 3;
    } else if (style.stance === 'Controlled') {
      stanceBonus += 1;
    }

    effectiveLevel = this.trackAdd(DetailKey.PLAYER_ACCURACY_EFFECTIVE_LEVEL, effectiveLevel, stanceBonus);

    const isWearingVoid = this.isWearingMeleeVoid();
    if (isWearingVoid) {
      effectiveLevel = this.trackFactor(DetailKey.PLAYER_ACCURACY_EFFECTIVE_LEVEL_VOID, effectiveLevel, [11, 10]);
    }

    const gearBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_GEAR_BONUS, style.type ? this.player.offensive[style.type] : 0, 64);
    const baseRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_ROLL_BASE, effectiveLevel, [gearBonus, 1]);
    let attackRoll = baseRoll;

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;

    // These bonuses do not stack with each other
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_FORINTHRY_SURGE, attackRoll, factor);
    } else if (this.wearing(['Salve amulet (e)', 'Salve amulet(ei)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SALVE, attackRoll, [6, 5]);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SALVE, attackRoll, [7, 6]);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_BLACK_MASK, attackRoll, [7, 6]);
    }

    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      const obsidianBonus = this.trackFactor(DetailKey.PLAYER_ACCURACY_OBSIDIAN, baseRoll, [1, 10]);
      attackRoll = this.trackAdd(DetailKey.PLAYER_ACCURACY_OBSIDIAN, attackRoll, obsidianBonus);
    }

    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_REV_WEAPON, attackRoll, [3, 2]);
    }
    if (this.wearing('Arclight') && mattrs.includes(MonsterAttribute.DEMON)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor([7, 10]));
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes(MonsterAttribute.DRAGON)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_DRAGONHUNTER, attackRoll, [6, 5]);
    }
    if (this.wearing('Keris partisan of breaching') && mattrs.includes(MonsterAttribute.KALPHITE)) {
      // https://twitter.com/JagexAsh/status/1704107285381787952
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_KERIS, attackRoll, [133, 100]);
    }
    if (this.wearing(['Blisterwood flail', 'Blisterwood sickle']) && isVampyre(mattrs)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_VAMPYREBANE, attackRoll, [21, 20]);
    }
    if (this.isWearingSilverWeapon() && isVampyre(mattrs)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_EFARITAY, attackRoll, [23, 20]); // todo ordering? does this stack multiplicatively with vampyrebane?
    }

    // Inquisitor's armour set gives bonuses when using the crush attack style
    if (style.type === 'crush') {
      let inqPieces = this.allEquippedItems.filter((v) => [
        "Inquisitor's great helm",
        "Inquisitor's hauberk",
        "Inquisitor's plateskirt",
      ].includes(v)).length;

      // When wearing the full set, the bonus is enhanced
      if (inqPieces === 3) inqPieces = 5;

      if (inqPieces > 0) {
        if (this.wearing("Inquisitor's mace")) {
          inqPieces *= 3;
        }
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_INQ, attackRoll, [200 + inqPieces, 200]);
      }
    }

    if (this.opts.usingSpecialAttack) {
      if (this.isWearingFang()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [3, 2]);
      } else if (this.wearing('Elder maul')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [5, 4]);
      } else if (this.wearing(['Bandos godsword', 'Saradomin godsword'])) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
      } else if (this.wearing('Dragon dagger')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [23, 20]);
      }
    }

    return attackRoll;
  }

  /**
   * Get the player's max melee hit
   */
  private getPlayerMaxMeleeHit(): MinMax {
    const { style } = this.player;
    const { buffs } = this.player;

    const baseLevel: number = this.trackAdd(DetailKey.DAMAGE_LEVEL, this.player.skills.str, this.player.boosts.str);
    let effectiveLevel: number = baseLevel;

    for (const p of this.getCombatPrayers()) {
      if (p.name === 'Burst of Strength' && effectiveLevel <= 20) {
        effectiveLevel = this.trackAdd(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, 1);
      } else {
        effectiveLevel = this.trackFactor(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, p.factorStrength!);
      }
    }

    if (this.wearing('Soulreaper axe')) {
      // does not stack multiplicatively with prayers
      const stacks = Math.max(0, Math.min(5, buffs.soulreaperStacks));
      const bonus = this.trackFactor(DetailKey.DAMAGE_LEVEL_SOULREAPER_BONUS, baseLevel, [stacks * 6, 100]);
      effectiveLevel = this.trackAdd(DetailKey.DAMAGE_LEVEL_SOULREAPER, effectiveLevel, bonus);
    }

    let stanceBonus = 8;
    if (style.stance === 'Aggressive') {
      stanceBonus += 3;
    } else if (style.stance === 'Controlled') {
      stanceBonus += 1;
    }

    effectiveLevel = this.trackAdd(DetailKey.DAMAGE_EFFECTIVE_LEVEL, effectiveLevel, stanceBonus);

    const isWearingVoid = this.isWearingMeleeVoid();
    if (isWearingVoid) {
      effectiveLevel = this.trackFactor(DetailKey.DAMAGE_EFFECTIVE_LEVEL_VOID, effectiveLevel, [11, 10]);
    }

    const gearBonus = this.trackAdd(DetailKey.DAMAGE_GEAR_BONUS, this.player.bonuses.str, 64);
    const baseMax = this.trackMaxHitFromEffective(DetailKey.MAX_HIT_BASE, effectiveLevel, gearBonus);
    let [minHit, maxHit]: MinMax = [0, baseMax];

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;

    // These bonuses do not stack with each other
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      maxHit = this.trackFactor(DetailKey.MAX_HIT_FORINTHRY_SURGE, maxHit, factor);
    } else if (this.wearing(['Salve amulet (e)', 'Salve amulet(ei)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_SALVE, maxHit, [6, 5]);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_SALVE, maxHit, [7, 6]);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_BLACK_MASK, maxHit, [7, 6]);
    }

    if (this.wearing('Arclight') && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor([7, 10]));
    }
    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      const obsidianBonus = this.trackFactor(DetailKey.MAX_HIT_OBSIDIAN, baseMax, [1, 10]);
      maxHit = this.trackAdd(DetailKey.MAX_HIT_OBSIDIAN, maxHit, obsidianBonus);
    }
    if (this.isWearingTzhaarWeapon() && this.isWearingBerserkerNecklace()) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_BERSERKER, maxHit, [6, 5]);
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes(MonsterAttribute.DRAGON)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, maxHit, [6, 5]);
    }
    if (this.isWearingKeris() && mattrs.includes(MonsterAttribute.KALPHITE)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_KERIS, maxHit, [133, 100]);
    }
    if (this.wearing('Barronite mace') && mattrs.includes(MonsterAttribute.GOLEM)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_GOLEMBANE, maxHit, [23, 20]);
    }
    if (this.isRevWeaponBuffApplicable()) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_REV_WEAPON, maxHit, [3, 2]);
    }
    if (this.wearing(['Silverlight', 'Darklight', 'Silverlight (dyed)']) && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor([3, 5]));
    }

    if (isVampyre(mattrs)) {
      if (this.wearing('Blisterwood flail')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [5, 4]);
      } else if (this.wearing('Blisterwood sickle')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [23, 20]);
      } else if (this.wearing('Ivandis flail')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [6, 5]);
      } else if (this.isWearingSilverWeapon() && mattrs.includes(MonsterAttribute.VAMPYRE_1)) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [11, 10]);
      } else if (this.wearing("Efaritay's aid") && mattrs.includes(MonsterAttribute.VAMPYRE_1)) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_EFARITAY, maxHit, [11, 10]);
      } else if (this.wearing("Efaritay's aid") && !this.isWearingSilverWeapon() && mattrs.includes(MonsterAttribute.VAMPYRE_2)) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_EFARITAY, maxHit, [1, 2]);
      }
    }

    if (this.wearing('Leaf-bladed battleaxe') && mattrs.includes(MonsterAttribute.LEAFY)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_LEAFY, maxHit, [47, 40]);
    }
    if (this.wearing('Colossal blade')) {
      maxHit = this.trackAdd(DetailKey.MAX_HIT_COLOSSALBLADE, maxHit, Math.min(this.monster.size * 2, 10));
    }

    if (this.isWearingRatBoneWeapon() && mattrs.includes(MonsterAttribute.RAT)) {
      // applies before inq, tested 2024-01-25, str level 99 str gear 112
      maxHit = this.trackAdd(DetailKey.MAX_HIT_RATBANE, maxHit, 10);
    }
    // Inquisitor's armour set gives bonuses when using the crush attack style
    if (style.type === 'crush') {
      let inqPieces = this.allEquippedItems.filter((v) => [
        "Inquisitor's great helm",
        "Inquisitor's hauberk",
        "Inquisitor's plateskirt",
      ].includes(v)).length;

      // When wearing the full set, the bonus is enhanced
      if (inqPieces === 3) inqPieces = 5;

      if (inqPieces > 0) {
        if (this.wearing("Inquisitor's mace")) {
          inqPieces *= 3;
        }
        maxHit = this.trackFactor(DetailKey.MAX_HIT_INQ, maxHit, [200 + inqPieces, 200]);
      }
    }

    if (this.isWearingFang()) {
      const shrink = Math.trunc(maxHit * 3 / 20);
      minHit = this.track(DetailKey.MIN_HIT_FANG, shrink);
      if (this.opts.usingSpecialAttack) {
        // not reduced during spec, but min hit is changed as usual
        this.track(DetailKey.MAX_HIT_SPEC, maxHit);
      } else {
        maxHit = this.trackAdd(DetailKey.MAX_HIT_FANG, maxHit, -shrink);
      }
    }

    if (this.opts.usingSpecialAttack) {
      if (this.wearing('Dragon warhammer')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [3, 2]);
      } else if (this.wearing('Bandos godsword')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [121, 100]);
      } else if (this.wearing('Saradomin godsword')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [11, 10]);
      } else if (this.wearing('Voidwaker')) {
        minHit = this.trackFactor(DetailKey.MIN_HIT_SPEC, maxHit, [1, 2]);
        maxHit = this.trackAdd(DetailKey.MAX_HIT_SPEC, maxHit, minHit);
      } else if (this.wearing(['Dragon halberd', 'Crystal halberd'])) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [11, 10]);
      } else if (this.wearing('Dragon dagger')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [23, 20]);
      }
    }

    return [minHit, maxHit];
  }

  private getPlayerMaxRangedAttackRoll() {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.PLAYER_ACCURACY_LEVEL, this.player.skills.ranged + this.player.boosts.ranged);
    for (const p of this.getCombatPrayers('factorAccuracy')) {
      effectiveLevel = this.trackFactor(DetailKey.PLAYER_ACCURACY_LEVEL_PRAYER, effectiveLevel, p.factorAccuracy!);
    }

    if (style.stance === 'Accurate') {
      effectiveLevel += 3;
    }

    effectiveLevel += 8;

    if (this.isWearingRangedVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 11 / 10);
    }

    let attackRoll = effectiveLevel * (this.player.offensive.ranged + 64);

    if (this.isWearingCrystalBow()) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      attackRoll = Math.trunc(attackRoll * (20 + crystalPieces) / 20);
    }

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;

    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_FORINTHRY_SURGE, attackRoll, factor);
    } else if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 6 / 5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 7 / 6);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23 / 20);
    }

    if (this.wearing('Twisted bow')) {
      const cap = mattrs.includes(MonsterAttribute.XERICIAN) ? 350 : 250;
      const tbowMagic = Math.min(cap, Math.max(this.monster.skills.magic, this.monster.offensive.magic));
      attackRoll = PlayerVsNPCCalc.tbowScaling(attackRoll, tbowMagic, true);
    }
    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = Math.trunc(attackRoll * 3 / 2);
    }
    if (this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      attackRoll = Math.trunc(attackRoll * 13 / 10);
    }

    if (this.opts.usingSpecialAttack) {
      if (this.wearing('Zaryte crossbow') || this.isWearingBlowpipe()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
      }
    }

    return attackRoll;
  }

  /**
   * Get the player's max ranged hit
   */
  private getPlayerMaxRangedHit(): MinMax {
    const { style } = this.player;

    let effectiveLevel: number = this.player.skills.ranged + this.player.boosts.ranged;
    if (this.wearing('Eclipse atlatl')) {
      // atlatl uses strength instead of ranged skill, melee strength bonus, and melee buff from slayer helmet/salve, but works with ranged void
      effectiveLevel = this.player.skills.str + this.player.boosts.str;
    }
    this.track(DetailKey.DAMAGE_LEVEL, effectiveLevel);

    for (const p of this.getCombatPrayers()) {
      if (p.name === 'Sharp Eye' && effectiveLevel <= 20) {
        effectiveLevel = this.trackAdd(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, 1);
      } else {
        effectiveLevel = this.trackFactor(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, p.factorStrength!);
      }
    }

    if (style.stance === 'Accurate') {
      effectiveLevel += 3;
    }

    effectiveLevel += 8;

    if (this.isWearingEliteRangedVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 9 / 8);
    } else if (this.isWearingRangedVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 11 / 10);
    }

    const bonusStr = this.wearing('Eclipse atlatl') ? this.player.bonuses.str : this.player.bonuses.ranged_str;
    let maxHit = Math.trunc((effectiveLevel * (bonusStr + 64) + 320) / 640);

    // tested this in-game, slayer helmet (i) + crystal legs + crystal body + bowfa, on accurate, no rigour, 99 ranged
    // max hit is 36, but would be 37 if placed after slayer helm
    if (this.isWearingCrystalBow()) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
    }

    const mattrs = this.monster.attributes;
    let needRevWeaponBonus = this.isRevWeaponBuffApplicable();
    let needDragonbane = this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON);

    // Specific bonuses that are applied from equipment
    const { buffs } = this.player;
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      maxHit = this.trackFactor(DetailKey.MAX_HIT_FORINTHRY_SURGE, maxHit, factor);
    } else if ((this.wearing('Salve amulet(ei)') || (this.wearing('Eclipse atlatl') && this.wearing('Salve amulet (e)'))) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 6 / 5);
    } else if ((this.wearing('Salve amulet(i)') || (this.wearing('Eclipse atlatl') && this.wearing('Salve amulet'))) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 7 / 6);
    } else if (this.wearing('Eclipse atlatl') && this.isWearingBlackMask() && buffs.onSlayerTask) {
      maxHit = Math.trunc(maxHit * 7 / 6);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      let numerator = 23;
      // these are additive with slayer only
      if (needRevWeaponBonus) {
        needRevWeaponBonus = false;
        numerator += 10;
      }
      if (needDragonbane) {
        needDragonbane = false;
        numerator += 5;
      }
      maxHit = this.trackFactor(DetailKey.MAX_HIT_BLACK_MASK, maxHit, [numerator, 20]);
    }

    if (this.wearing('Twisted bow')) {
      const cap = mattrs.includes(MonsterAttribute.XERICIAN) ? 350 : 250;
      const tbowMagic = Math.min(cap, Math.max(this.monster.skills.magic, this.monster.offensive.magic));
      maxHit = PlayerVsNPCCalc.tbowScaling(maxHit, tbowMagic, false);
    }

    // multiplicative if not with slayer helm
    if (needRevWeaponBonus) {
      maxHit = Math.trunc(maxHit * 3 / 2);
    }
    if (needDragonbane) {
      maxHit = Math.trunc(maxHit * 5 / 4);
    }

    if (this.isWearingRatBoneWeapon() && mattrs.includes(MonsterAttribute.RAT)) {
      maxHit = this.trackAdd(DetailKey.MAX_HIT_RATBANE, maxHit, 10);
    }

    if (this.wearing('Tonalztics of ralos')) {
      // rolls 75% of max hit, but can hit twice
      // double hit is implemented in hit distribution
      maxHit = this.trackFactor(DetailKey.MAX_HIT_TONALZTICS, maxHit, [3, 4]);
    }

    if (this.opts.usingSpecialAttack) {
      if (this.isWearingBlowpipe()) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [3, 2]);
      }
    }

    return [0, maxHit]; // ranged has no min hit behaviours (aside from always-max, which is lower down)
  }

  private getPlayerMaxMagicAttackRoll() {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.PLAYER_ACCURACY_LEVEL, this.player.skills.magic + this.player.boosts.magic);
    for (const p of this.getCombatPrayers('factorAccuracy')) {
      effectiveLevel = this.trackFactor(DetailKey.PLAYER_ACCURACY_LEVEL_PRAYER, effectiveLevel, p.factorAccuracy!);
    }

    if (style.stance === 'Accurate') {
      effectiveLevel += 2;
    }

    effectiveLevel += 9;

    if (this.isWearingMagicVoid()) {
      effectiveLevel = Math.trunc(effectiveLevel * 29 / 20);
    }

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;
    const magicBonus = this.player.offensive.magic;

    const baseRoll = effectiveLevel * (magicBonus + 64);
    let attackRoll = baseRoll;

    let additiveBonus = 0;
    let blackMaskBonus = false;
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_FORINTHRY_SURGE, additiveBonus, buffs.forinthrySurge ? 35 : 20);
    } else if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_SALVE, additiveBonus, 20);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_SALVE, additiveBonus, 15);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    if (this.wearing("Efaritay's aid") && isVampyre(mattrs)) {
      // https://x.com/JagexAsh/status/1792829802996498524
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_EFARITAY, additiveBonus, 15);
    }

    if (this.isWearingSmokeStaff() && this.player.spell?.spellbook === 'standard') {
      // https://twitter.com/JagexAsh/status/1791070064369647838
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_SMOKE_BATTLESTAFF, additiveBonus, 10);
    }

    if (additiveBonus !== 0) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_ROLL_MAGIC_PERCENT, attackRoll, [100 + additiveBonus, 100]);
    }

    if (blackMaskBonus) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_BLACK_MASK, attackRoll, [23, 20]);
    }

    if (this.player.spell?.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      const baseFactor: Factor = buffs.markOfDarknessSpell ? [8, 20] : [4, 20];
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor(baseFactor));
    }
    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_REV_WEAPON, attackRoll, [3, 2]);
    }
    if (this.wearing('Tome of water') && this.player.spell?.element === 'water' || isBindSpell(this.player.spell)) { // todo does this go here?
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_TOME, attackRoll, [6, 5]);
    }

    if (this.opts.usingSpecialAttack) {
      if (this.isWearingAccursedSceptre()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [3, 2]);
      }
    }

    const spellement = this.player.spell?.element;
    if (this.monster.weakness && spellement) {
      if (spellement === this.monster.weakness.element) {
        const severity = this.monster.weakness.severity;
        const bonus = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPELLEMENT_BONUS, baseRoll, [severity, 100]);
        attackRoll = this.trackAdd(DetailKey.PLAYER_ACCURACY_SPELLEMENT, attackRoll, bonus);
      }
    }

    return attackRoll;
  }

  /**
   * Get the player's max magic hit
   */
  private getPlayerMaxMagicHit(): MinMax {
    let [minHit, maxHit]: MinMax = [0, 0];
    const magicLevel = this.player.skills.magic + this.player.boosts.magic;
    const { spell } = this.player;

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;

    if (spell) {
      maxHit = getSpellMaxHit(spell, magicLevel);
      if (spell?.name === 'Magic Dart') {
        if (this.wearing("Slayer's staff (e)") && buffs.onSlayerTask) {
          maxHit = Math.trunc(13 + magicLevel / 6);
        } else {
          maxHit = Math.trunc(10 + magicLevel / 10);
        }
      }
    } else if (this.wearing('Starter staff')) {
      maxHit = 8;
    } else if (this.wearing(['Trident of the seas', 'Trident of the seas (e)'])) {
      maxHit = Math.trunc(magicLevel / 3 - 5);
    } else if (this.wearing("Thammaron's sceptre")) {
      maxHit = Math.trunc(magicLevel / 3 - 8);
    } else if (this.wearing('Accursed sceptre')) {
      maxHit = Math.trunc(magicLevel / 3 - 6);
    } else if (this.wearing(['Trident of the swamp', 'Trident of the swamp (e)'])) {
      maxHit = Math.trunc(magicLevel / 3 - 2);
    } else if (this.wearing(['Sanguinesti staff', 'Holy sanguinesti staff'])) {
      maxHit = Math.trunc(magicLevel / 3 - 1);
    } else if (this.wearing('Dawnbringer')) {
      maxHit = Math.trunc(magicLevel / 6 - 1);
    } else if (this.wearing("Tumeken's shadow")) {
      maxHit = Math.trunc(magicLevel / 3 + 1);
    } else if (this.wearing('Warped sceptre')) {
      maxHit = Math.trunc((8 * magicLevel + 96) / 37);
    } else if (this.wearing('Bone staff')) {
      // although the +10 is technically a ratbane bonus, the weapon can't be used against non-rats
      // and shows this max hit against the combat dummy as well
      maxHit = Math.max(1, Math.trunc(magicLevel / 3) - 5) + 10;
    } else if (this.wearing(['Crystal staff (basic)', 'Corrupted staff (basic)'])) {
      maxHit = 23;
    } else if (this.wearing(['Crystal staff (attuned)', 'Corrupted staff (attuned)'])) {
      maxHit = 31;
    } else if (this.wearing(['Crystal staff (perfected)', 'Corrupted staff (perfected)'])) {
      maxHit = 39;
    } else if (this.wearing('Swamp lizard')) {
      maxHit = Math.trunc((magicLevel * (56 + 64) + 320) / 640);
    } else if (this.wearing('Orange salamander')) {
      maxHit = Math.trunc((magicLevel * (59 + 64) + 320) / 640);
    } else if (this.wearing('Red salamander')) {
      maxHit = Math.trunc((magicLevel * (77 + 64) + 320) / 640);
    } else if (this.wearing('Black salamander')) {
      maxHit = Math.trunc((magicLevel * (92 + 64) + 320) / 640);
    } else if (this.wearing('Tecu salamander')) {
      maxHit = Math.trunc((magicLevel * (104 + 64) + 320) / 640);
    }

    if (maxHit === 0) {
      // at this point either they've selected a 0-dmg spell
      // or they picked a staff-casting option without choosing a spell
      return [0, 0];
    }

    if (this.wearing('Chaos gauntlets') && spell?.name.toLowerCase()
      .includes('bolt')) {
      maxHit += 3;
    }
    if (this.isChargeSpellApplicable()) {
      maxHit += 10;
    }

    // We need the basehit value for the elemental bonus later.
    const baseMax = maxHit;
    let magicDmgBonus = this.player.bonuses.magic_str;

    if (this.isWearingSmokeStaff() && spell?.spellbook === 'standard') {
      magicDmgBonus += 100;
    }

    let blackMaskBonus = false;
    if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      magicDmgBonus += 200;
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      magicDmgBonus += 150;
    } else if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      magicDmgBonus += buffs.forinthrySurge ? 350 : 200;
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    for (const p of this.getCombatPrayers('magicDamageBonus')) {
      magicDmgBonus += p.magicDamageBonus!;
    }

    maxHit = Math.trunc(maxHit * (1000 + magicDmgBonus) / 1000);

    if (blackMaskBonus) {
      maxHit = Math.trunc(maxHit * 23 / 20);
    }

    if (this.isRevWeaponBuffApplicable()) {
      maxHit = Math.trunc(maxHit * 3 / 2);
    }

    if (this.opts.usingSpecialAttack) {
      // todo ordering
      if (this.isWearingAccursedSceptre()) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [3, 2]);
      }
    }

    const spellement = this.player.spell?.element;
    if (this.monster.weakness && spellement) {
      if (spellement === this.monster.weakness.element) {
        maxHit += Math.trunc(baseMax * (this.monster.weakness.severity / 100));
      }
    }

    if (this.player.buffs.usingSunfireRunes && canUseSunfireRunes(this.player.spell)) {
      // sunfire runes are applied pre-tome
      minHit = this.trackFactor(DetailKey.MIN_HIT_SUNFIRE, maxHit, [1, 10]);
    }

    if ((this.wearing('Tome of fire') && this.player.spell?.element === 'fire')
      || (this.wearing('Tome of water') && this.player.spell?.element === 'water')) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_TOME, maxHit, [11, 10]);
    }

    return [minHit, maxHit];
  }

  /**
   * Get the "combat" prayers for the current combat style. These are prayers that aren't overheads.
   */
  private getCombatPrayers(filter: keyof PrayerData = 'factorStrength'): PrayerData[] {
    const style = this.player.style.type;

    let prayers = this.player.prayers.map((p) => PrayerMap[p]);
    if (this.isUsingMeleeStyle()) {
      prayers = prayers.filter((p) => p.combatStyle === 'melee');
    } else if (style === 'ranged') {
      prayers = prayers.filter((p) => p.combatStyle === 'ranged');
    } else {
      prayers = prayers.filter((p) => p.combatStyle === 'magic');
    }

    return prayers.filter((p) => p[filter]);
  }

  /**
   * Get the min and max hit for this loadout, which is based on the player's current combat style.
   * Don't use this for player-facing values! Use `getDistribution().getMax()`
   */
  getMinAndMax(): MinMax {
    if (this.player.style.stance !== 'Manual Cast') {
      const weaponId = this.player.equipment.weapon?.id;
      const ammoId = this.player.equipment.ammo?.id;
      if (ammoApplicability(weaponId, ammoId) === AmmoApplicability.INVALID) {
        return [0, 0];
      }
    }

    const style = this.player.style.type;

    let minMax: MinMax = [0, 0];
    if (this.isUsingMeleeStyle()) {
      minMax = this.getPlayerMaxMeleeHit();
    }
    if (style === 'ranged') {
      minMax = this.getPlayerMaxRangedHit();
    }
    if (style === 'magic') {
      minMax = this.getPlayerMaxMagicHit();
    }

    // some cursed (literally, cursed amulet of magic) stuff throws this off
    if (minMax[0] <= 0) {
      minMax[0] = 0;
    }
    if (minMax[1] <= 0) {
      minMax[1] = 0;
    }

    this.track(DetailKey.MIN_HIT_FINAL, minMax[0]);
    this.track(DetailKey.MAX_HIT_FINAL, minMax[1]);
    return minMax;
  }

  /**
   * Get the max attack roll for this loadout, which is based on the player's current combat style
   */
  public getMaxAttackRoll() {
    if (this.opts.overrides?.attackRoll !== undefined) {
      return this.track(DetailKey.PLAYER_ACCURACY_ROLL_FINAL, this.opts.overrides?.attackRoll);
    }

    if (this.player.style.stance !== 'Manual Cast') {
      const weaponId = this.player.equipment.weapon?.id;
      const ammoId = this.player.equipment.ammo?.id;
      if (ammoApplicability(weaponId, ammoId) === AmmoApplicability.INVALID) {
        return this.track(DetailKey.PLAYER_ACCURACY_ROLL_FINAL, 0.0);
      }
    }

    const style = this.player.style.type;
    let atkRoll = 0;
    if (this.isUsingMeleeStyle()) {
      atkRoll = this.getPlayerMaxMeleeAttackRoll();
    }
    if (style === 'ranged') {
      atkRoll = this.getPlayerMaxRangedAttackRoll();
    }
    if (style === 'magic') {
      atkRoll = this.getPlayerMaxMagicAttackRoll();
    }

    return this.track(DetailKey.PLAYER_ACCURACY_ROLL_FINAL, atkRoll);
  }

  public getHitChance() {
    if (this.opts.overrides?.accuracy) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, this.opts.overrides.accuracy);
    }

    if (VERZIK_P1_IDS.includes(this.monster.id) && this.wearing('Dawnbringer')) {
      this.track(DetailKey.PLAYER_ACCURACY_DAWNBRINGER, 1.0);
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    // Giant rat (Scurrius)
    if (this.monster.id === 7223 && this.player.style.stance !== 'Manual Cast') {
      this.track(DetailKey.PLAYER_ACCURACY_SCURRIUS_RAT, 1.0);
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (this.opts.usingSpecialAttack && this.wearing('Voidwaker')) {
      return 1.0;
    }

    const atk = this.getMaxAttackRoll();
    const def = this.getNPCDefenceRoll();

    let hitChance = this.track(
      DetailKey.PLAYER_ACCURACY_BASE,
      BaseCalc.getNormalAccuracyRoll(atk, def),
    );

    if (this.player.style.type === 'magic' && this.wearing('Brimstone ring')) {
      const effectDef = Math.trunc(def * 9 / 10);
      const effectHitChance = BaseCalc.getNormalAccuracyRoll(atk, effectDef);

      hitChance = this.track(DetailKey.PLAYER_ACCURACY_BRIMSTONE, (0.75 * hitChance) + (0.25 * effectHitChance));
    }

    if (this.isWearingFang() && this.player.style.type === 'stab') {
      if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id)) {
        hitChance = this.track(DetailKey.PLAYER_ACCURACY_FANG_TOA, 1 - (1 - hitChance) ** 2);
      } else {
        hitChance = this.track(
          DetailKey.PLAYER_ACCURACY_FANG,
          BaseCalc.getFangAccuracyRoll(atk, def),
        );
      }
    }

    return this.track(DetailKey.PLAYER_ACCURACY_FINAL, hitChance);
  }

  public getDistribution(): AttackDistribution {
    if (this.memoizedDist === undefined) {
      this.memoizedDist = this.getDistributionImpl();
      this.track(DetailKey.HIT_DIST_FINAL_MIN, this.memoizedDist.getMin());
      this.track(DetailKey.HIT_DIST_FINAL_MAX, this.memoizedDist.getMax());
      this.track(DetailKey.HIT_DIST_FINAL_EXPECTED, this.memoizedDist.getExpectedDamage());
    }

    return this.memoizedDist;
  }

  private getDistributionImpl(): AttackDistribution {
    const mattrs = this.monster.attributes;
    const acc = this.getHitChance();
    const [min, max] = this.getMinAndMax();
    const style = this.player.style.type;

    // standard linear
    const standardHitDist = HitDistribution.linear(acc, min, max);
    let dist = new AttackDistribution([standardHitDist]);

    // Monsters that always die in one hit no matter what
    if (ONE_HIT_MONSTERS.includes(this.monster.id)) {
      return new AttackDistribution([
        HitDistribution.single(1.0, [new Hitsplat(this.monster.skills.hp)]),
      ]);
    }

    // monsters that are always max hit no matter what
    if ((this.player.style.type === 'magic' && ALWAYS_MAX_HIT_MONSTERS.magic.includes(this.monster.id))
      || (this.isUsingMeleeStyle() && ALWAYS_MAX_HIT_MONSTERS.melee.includes(this.monster.id))
      || (this.player.style.type === 'ranged' && ALWAYS_MAX_HIT_MONSTERS.ranged.includes(this.monster.id))) {
      return new AttackDistribution([HitDistribution.single(1.0, [new Hitsplat(max)])]);
    }

    if (style === 'ranged' && this.wearing('Tonalztics of ralos') && this.player.equipment.weapon?.version === 'Charged') {
      // roll two independent hits
      if (!this.opts.usingSpecialAttack) {
        dist = new AttackDistribution([standardHitDist, standardHitDist]);
      } else {
        // the defence reduction from the first hit applies to the second hit,
        // so we need a full subcalc with the new defence value to determine the dist
        const loweredDefHitAccuracy = this.noInitSubCalc(this.player, scaleMonster({
          ...this.baseMonster,
          inputs: {
            ...this.baseMonster.inputs,
            defenceReductions: {
              ...this.baseMonster.inputs.defenceReductions,
              tonalztic: this.baseMonster.inputs.defenceReductions.tonalztic + 1,
            },
          },
        })).getHitChance();

        const loweredDefHitDist = HitDistribution.linear(loweredDefHitAccuracy, min, max);
        dist = dist.transform((firstHit) => {
          const firstHitDist = HitDistribution.single(1.0, [firstHit]);
          const secondHitDist = firstHit.accurate ? loweredDefHitDist : standardHitDist;
          return firstHitDist.zip(secondHitDist);
        });
      }
    }

    if (this.isUsingMeleeStyle() && this.wearing('Gadderhammer') && mattrs.includes(MonsterAttribute.SHADE)) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.95).scaleDamage(5, 4).hits,
          ...standardHitDist.scaleProbability(0.05).scaleDamage(2).hits,
        ]),
      ]);
    }

    let accurateZeroApplicable: boolean = true;
    if (this.opts.usingSpecialAttack && this.wearing('Dragon claws')) {
      accurateZeroApplicable = false;

      const clawSpecDist = new HitDistribution([]);
      for (let accRoll = 0; accRoll < 4; accRoll++) {
        const low = Math.trunc(max * (4 - accRoll) / 4);
        const high = max + low - 1;
        const chancePreviousRollsFail = (1 - acc) ** accRoll;
        const chanceThisRollPasses = chancePreviousRollsFail * acc;
        const chancePerDmg = chanceThisRollPasses / (high - low + 1);
        for (let dmg = low; dmg <= high; dmg++) {
          switch (accRoll) {
            case 0:
              clawSpecDist.addHit(new WeightedHit(chancePerDmg, [
                new Hitsplat(Math.trunc(dmg / 2)),
                new Hitsplat(Math.trunc(dmg / 4)),
                new Hitsplat(Math.trunc(dmg / 8)),
                new Hitsplat(Math.trunc(dmg / 8) + 1),
              ]));
              break;

            case 1:
              clawSpecDist.addHit(new WeightedHit(chancePerDmg, [
                new Hitsplat(Math.trunc(dmg / 2)),
                new Hitsplat(Math.trunc(dmg / 4)),
                new Hitsplat(Math.trunc(dmg / 4) + 1),
                Hitsplat.INACCURATE,
              ]));
              break;

            case 2:
              clawSpecDist.addHit(new WeightedHit(chancePerDmg, [
                new Hitsplat(Math.trunc(dmg / 2)),
                new Hitsplat(Math.trunc(dmg / 2) + 1),
                Hitsplat.INACCURATE,
                Hitsplat.INACCURATE,
              ]));
              break;

            default:
              clawSpecDist.addHit(new WeightedHit(chancePerDmg, [
                new Hitsplat(dmg + 1),
                Hitsplat.INACCURATE,
                Hitsplat.INACCURATE,
                Hitsplat.INACCURATE,
              ]));
              break;
          }
        }
      }
      const chanceAllFail = (1 - acc) ** 4;
      clawSpecDist.addHit(new WeightedHit(chanceAllFail * 2 / 3, [
        new Hitsplat(1, false),
        new Hitsplat(1, false),
        Hitsplat.INACCURATE,
        Hitsplat.INACCURATE,
      ]));
      clawSpecDist.addHit(new WeightedHit(chanceAllFail / 3, [
        Hitsplat.INACCURATE,
        Hitsplat.INACCURATE,
        Hitsplat.INACCURATE,
        Hitsplat.INACCURATE,
      ]));
      dist = new AttackDistribution([clawSpecDist]);
    }

    if (this.opts.usingSpecialAttack && this.wearing(['Dragon halberd', 'Crystal halberd']) && this.monster.size > 1) {
      const secondHitAttackRoll = Math.trunc(this.getMaxAttackRoll() * 3 / 4);
      const secondHitAcc = this.noInitSubCalc(
        this.player,
        this.monster,
        { overrides: { attackRoll: secondHitAttackRoll } },
      ).getHitChance();

      dist = new AttackDistribution([standardHitDist, HitDistribution.linear(secondHitAcc, min, max)]);
    }

    if (this.opts.usingSpecialAttack && this.wearing('Dragon dagger')) {
      // just a double hit, stat changes are earlier
      dist = new AttackDistribution([standardHitDist, standardHitDist]);
    }

    if (this.isUsingMeleeStyle() && this.isWearingDharok()) {
      const newMax = this.player.skills.hp;
      const curr = this.player.skills.hp + this.player.boosts.hp;
      dist = dist.scaleDamage(10000 + (newMax - curr) * newMax, 10000);
    }

    if (this.isUsingMeleeStyle() && this.isWearingVeracs()) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.75).hits,
          ...HitDistribution.linear(1.0, 1, max + 1).scaleProbability(0.25).hits,
        ]),
      ]);
    }

    if (style === 'ranged' && this.isWearingKarils()) {
      // 25% chance to deal a second hitsplat at half the damage of the first (flat, not rolled)
      dist = dist.transform(
        (h) => new HitDistribution([
          new WeightedHit(0.75, [h]),
          new WeightedHit(0.25, [h, new Hitsplat(Math.trunc(h.damage / 2))]),
        ]),
        { transformInaccurate: false },
      );
    }

    if (this.isUsingMeleeStyle() && this.isWearingScythe()) {
      const hits: HitDistribution[] = [];
      for (let i = 0; i < Math.min(Math.max(this.monster.size, 1), 3); i++) {
        const splatMax = Math.trunc(max / (2 ** i));
        hits.push(HitDistribution.linear(acc, Math.min(min, splatMax), splatMax));
      }
      dist = new AttackDistribution(hits);
    }

    if (this.isUsingMeleeStyle() && this.wearing('Dual macuahuitl')) {
      const secondHit = HitDistribution.linear(acc, 0, max - Math.trunc(max / 2));
      const firstHit = new AttackDistribution([HitDistribution.linear(acc, 0, Math.trunc(max / 2))]);
      dist = firstHit.transform(
        (h) => new HitDistribution([new WeightedHit(1.0, [h])]).zip(secondHit),
        { transformInaccurate: false },
      );
    }

    if (this.isUsingMeleeStyle() && (this.wearing('Torag\'s hammers') || this.wearing('Sulphur blades'))) {
      dist = new AttackDistribution([
        HitDistribution.linear(acc, 0, Math.trunc(max / 2)),
        HitDistribution.linear(acc, 0, max - Math.trunc(max / 2)),
      ]);
    }

    if (this.isUsingMeleeStyle() && this.isWearingKeris() && mattrs.includes(MonsterAttribute.KALPHITE)) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(50.0 / 51.0).hits,
          ...standardHitDist.scaleProbability(1.0 / 51.0).scaleDamage(3).hits,
        ]),
      ]);
    }

    if (this.isUsingMeleeStyle() && GUARDIAN_IDS.includes(this.monster.id) && this.player.equipment.weapon?.category === EquipmentCategory.PICKAXE) {
      // just the level required to wield
      const pickBonuses: { [k: string]: number } = {
        'Bronze pickaxe': 1,
        'Iron pickaxe': 1,
        'Steel pickaxe': 6,
        'Black pickaxe': 11,
        'Mithril pickaxe': 21,
        'Adamant pickaxe': 31,
        'Rune pickaxe': 41,
        'Gilded pickaxe': 41,
        // crystal is same as dpick https://twitter.com/JagexAsh/status/1155820855076802560
      };

      // https://twitter.com/JagexAsh/status/1007600220358742021
      const pickBonus = pickBonuses[this.player.equipment.weapon.name] || 61; // there's a lot of dpick variants
      const factor = 50 + this.player.skills.mining + pickBonus;
      const divisor = 150;

      this.track(DetailKey.GUARDIANS_DMG_BONUS, factor / divisor);
      dist = dist.transform(multiplyTransformer(factor, divisor));
    }

    if (this.player.buffs.markOfDarknessSpell && this.player.spell?.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      dist = dist.scaleDamage(5, 4);
    }

    if (this.player.style.type === 'magic' && this.isWearingAhrims()) {
      dist = dist.transform(
        (h) => new HitDistribution([
          new WeightedHit(0.75, [h]),
          new WeightedHit(0.25, [new Hitsplat(Math.trunc(h.damage * 13 / 10), h.accurate)]),
        ]),
      );
    }

    // bolt effects
    const zaryte = this.wearing('Zaryte crossbow');
    const zaryteSpec = zaryte && this.opts.usingSpecialAttack;
    if (this.player.style.type === 'ranged' && this.player.equipment.weapon?.name.includes('rossbow')) {
      const rangedLvl = this.player.skills.ranged + this.player.boosts.ranged;
      const kandarinDiaryFactor = this.player.buffs.kandarinDiary ? 1.1 : 1.0;

      if (this.wearing(['Opal bolts (e)', 'Opal dragon bolts (e)'])) {
        const chance = zaryteSpec ? 1.0 : 0.05 * kandarinDiaryFactor;
        const bonusDmg = Math.trunc(rangedLvl / (zaryte ? 9 : 10));
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(1.0, bonusDmg, max + bonusDmg).scaleProbability(chance).hits,
          ]),
        ]);
      }

      if (this.wearing(['Pearl bolts (e)', 'Pearl dragon bolts (e)'])) {
        const chance = zaryteSpec ? 1.0 : 0.06 * kandarinDiaryFactor;
        const divisor = mattrs.includes(MonsterAttribute.FIERY) ? 15 : 20;
        const bonusDmg = Math.trunc(rangedLvl / (zaryte ? divisor - 2 : divisor));
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(1.0, bonusDmg, max + bonusDmg).scaleProbability(chance).hits,
          ]),
        ]);
      }

      if (this.wearing(['Diamond bolts (e)', 'Diamond dragon bolts (e)'])) {
        const chance = zaryteSpec ? 1.0 : 0.1 * kandarinDiaryFactor;
        const effectMax = max + Math.trunc(max * (zaryte ? 26 : 15) / 100);
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(1.0, 0, effectMax).scaleProbability(chance).hits,
          ]),
        ]);
      }

      if (this.wearing(['Dragonstone bolts (e)', 'Dragonstone dragon bolts (e)']) && (!mattrs.includes(MonsterAttribute.FIERY) || !mattrs.includes(MonsterAttribute.DRAGON))) {
        const chance = zaryteSpec ? 1.0 : 0.06 * kandarinDiaryFactor;
        // https://github.com/weirdgloop/osrs-dps-calc/issues/152#issuecomment-1913508743
        const effectDmg = Math.trunc(rangedLvl * 2 / (zaryte ? 9 : 10));
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(acc, effectDmg, max + effectDmg).scaleProbability(chance).hits,
          ]),
        ]);
      }

      if (this.wearing(['Onyx bolts (e)', 'Onyx dragon bolts (e)']) && !mattrs.includes(MonsterAttribute.UNDEAD)) {
        const chance = zaryteSpec ? 1.0 : 0.11 * kandarinDiaryFactor;
        const effectMax = Math.trunc(max * (zaryte ? 132 : 120) / 100);
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(1.0, 0, effectMax)
              .scaleProbability(acc * chance).hits,
            new WeightedHit((1 - acc) * chance, [Hitsplat.INACCURATE]),
          ]),
        ]);
      }
    }

    // raise accurate 0s to 1
    if (accurateZeroApplicable) {
      dist = dist.transform(
        (h) => HitDistribution.single(1.0, [new Hitsplat(Math.max(h.damage, 1))]),
        { transformInaccurate: false },
      );
    }

    // we apply corp earlier than other limiters,
    // and rubies later than other bolts,
    // since corp takes full ruby bolt effect damage but reduced damage from bolts otherwise
    if (this.monster.name === 'Corporeal Beast' && !this.isWearingCorpbaneWeapon()) {
      dist = dist.transform(divisionTransformer(2));
    }

    if (this.player.style.type === 'ranged' && this.player.equipment.weapon?.name.includes('rossbow')) {
      if (this.wearing(['Ruby bolts (e)', 'Ruby dragon bolts (e)'])) {
        const chance = zaryteSpec ? 1.0 : 0.06 * (this.player.buffs.kandarinDiary ? 1.1 : 1.0);
        const effectDmg = this.wearing('Zaryte crossbow')
          ? Math.min(110, Math.trunc(this.monster.inputs.monsterCurrentHp * 22 / 100))
          : Math.min(100, Math.trunc(this.monster.inputs.monsterCurrentHp / 5));
        dist = new AttackDistribution([
          new HitDistribution([
            ...dist.dists[0].scaleProbability(1 - chance).hits,
            new WeightedHit(chance * acc, [new Hitsplat(effectDmg, true)]),
            new WeightedHit(chance * (1 - acc), [new Hitsplat(effectDmg, false)]),
          ]),
        ]);
      }
    }

    return this.applyNpcTransforms(dist);
  }

  applyNpcTransforms(dist: AttackDistribution): AttackDistribution {
    // we apply this here instead of at the top of getDistributionImpl just in case of multi-hits
    if (this.isImmune()) {
      return new AttackDistribution([new HitDistribution([new WeightedHit(1.0, [Hitsplat.INACCURATE])])]);
    }

    // todo this comes up in a few places now, it may be good to abstract it into a "getDamageStyle"
    let styleType = this.player.style.type;
    if (this.opts.usingSpecialAttack && this.wearing('Voidwaker')) {
      styleType = 'magic';
    }

    if (this.monster.name === 'Zulrah') {
      // https://twitter.com/JagexAsh/status/1745852774607183888
      dist = dist.transform(cappedRerollTransformer(50, 5, 45));
    }
    if (this.monster.name === 'Fragment of Seren') {
      // https://twitter.com/JagexAsh/status/1375037874559721474
      dist = dist.transform(linearMinTransformer(2, 22));
    }
    if (this.monster.name === 'Kraken' && styleType === 'ranged') {
      // https://twitter.com/JagexAsh/status/1699360516488011950
      dist = dist.transform(divisionTransformer(7, 1));
    }
    if (VERZIK_P1_IDS.includes(this.monster.id) && !this.wearing('Dawnbringer')) {
      const limit = this.isUsingMeleeStyle() ? 10 : 3;
      dist = dist.transform(linearMinTransformer(limit));
    }
    if (TEKTON_IDS.includes(this.monster.id) && styleType === 'magic') {
      dist = dist.transform(divisionTransformer(5, 1));
    }
    if (GLOWING_CRYSTAL_IDS.includes(this.monster.id) && styleType === 'magic') {
      dist = dist.transform(divisionTransformer(3));
    }
    if ((OLM_MELEE_HAND_IDS.includes(this.monster.id) || OLM_HEAD_IDS.includes(this.monster.id)) && styleType === 'magic') {
      dist = dist.transform(divisionTransformer(3));
    }
    if ((OLM_MAGE_HAND_IDS.includes(this.monster.id) || OLM_MELEE_HAND_IDS.includes(this.monster.id)) && styleType === 'ranged') {
      dist = dist.transform(divisionTransformer(3));
    }
    if (this.monster.name === 'Ice demon' && this.player.spell?.element !== 'fire') {
      // https://twitter.com/JagexAsh/status/1133350436554121216
      dist = dist.transform(divisionTransformer(3));
    }
    if (this.monster.name === 'Slagilith' && this.player.equipment.weapon?.category !== EquipmentCategory.PICKAXE) {
      // https://twitter.com/JagexAsh/status/1219652159148646401
      dist = dist.transform(divisionTransformer(3));
    }
    if (NIGHTMARE_TOTEM_IDS.includes(this.monster.id) && styleType === 'magic') {
      dist = dist.transform(multiplyTransformer(2));
    }
    if (['Slash Bash', 'Zogre', 'Skogre'].includes(this.monster.name)) {
      if (this.player.spell?.name === 'Crumble Undead') {
        dist = dist.transform(divisionTransformer(2));
      } else if (this.player.style.type !== 'ranged'
        || !this.player.equipment.ammo?.name.includes(' brutal')
        || this.player.equipment.weapon?.name !== 'Comp ogre bow') {
        dist = dist.transform(divisionTransformer(4));
      }
    }
    if (BA_ATTACKER_MONSTERS.includes(this.monster.id) && this.player.buffs.baAttackerLevel !== 0) {
      // todo is this pre- or post-roll?
      dist = dist.transform(
        flatAddTransformer(this.player.buffs.baAttackerLevel),
        { transformInaccurate: true },
      );
    }

    const flatArmour = FLAT_ARMOUR[this.monster.id];
    if (flatArmour) {
      dist = dist.transform(
        flatAddTransformer(-flatArmour, 1),
        { transformInaccurate: false },
      );
    }

    return dist;
  }

  isImmune(): boolean {
    const monsterId = this.monster.id;
    const mattrs = this.monster.attributes;
    let styleType = this.player.style.type;

    if (this.opts.usingSpecialAttack && this.wearing('Voidwaker')) {
      styleType = 'magic';
    }

    if (IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS.includes(monsterId) && styleType === 'magic') {
      return true;
    }
    if (IMMUNE_TO_RANGED_DAMAGE_NPC_IDS.includes(monsterId) && styleType === 'ranged') {
      return true;
    }
    if (IMMUNE_TO_MELEE_DAMAGE_NPC_IDS.includes(monsterId) && this.isUsingMeleeStyle()) {
      return true;
    }
    if (IMMUNE_TO_NON_SALAMANDER_MELEE_DAMAGE_NPC_IDS.includes(monsterId)
      && this.isUsingMeleeStyle()
      && this.player.equipment.weapon?.category !== EquipmentCategory.SALAMANDER) {
      return true;
    }
    if (mattrs.includes(MonsterAttribute.VAMPYRE_3) && !this.isWearingIvandisWeapon()) {
      return true;
    }
    if (mattrs.includes(MonsterAttribute.VAMPYRE_2) && !this.isWearingSilverWeapon() && !this.wearing("Efaritay's aid")) {
      return true;
    }
    if (GUARDIAN_IDS.includes(monsterId) && (!this.isUsingMeleeStyle() || this.player.equipment.weapon?.category !== EquipmentCategory.PICKAXE)) {
      return true;
    }
    if (mattrs.includes(MonsterAttribute.LEAFY) && !this.isWearingLeafBladedWeapon()) {
      return true;
    }
    if (!mattrs.includes(MonsterAttribute.RAT) && this.isWearingRatBoneWeapon()) {
      return true;
    }
    if (this.monster.name === 'Fire Warrior of Lesarkus'
      && (styleType !== 'ranged' || this.player.equipment.ammo?.name !== 'Ice arrows')) {
      return true;
    }
    if (this.monster.name === 'Fareed') {
      if (styleType === 'magic' && this.player.spell?.element !== 'water'
        || (styleType === 'ranged' && !this.player.equipment.ammo?.name?.includes('arrow'))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns the player's attack speed.
   */
  public getAttackSpeed(): number {
    let attackSpeed = this.player.equipment.weapon?.speed || DEFAULT_ATTACK_SPEED;

    if (this.player.style.type === 'ranged' && this.player.style.stance === 'Rapid') {
      attackSpeed -= 1;
    }
    if (CAST_STANCES.includes(this.player.style.stance)) {
      if (this.player.equipment.weapon?.name === 'Harmonised nightmare staff'
        && this.player.spell?.spellbook === 'standard'
        && this.player.style.stance !== 'Manual Cast') {
        return 4;
      }
      return 5;
    }

    // Giant rat (Scurrius)
    if (this.monster.id === 7223 && this.player.style.stance !== 'Manual Cast') {
      if (['Bone mace', 'Bone shortbow', 'Bone staff'].includes(this.player.equipment.weapon?.name || '')) {
        attackSpeed = 1;
      }
    }

    return attackSpeed;
  }

  public getExpectedAttackSpeed() {
    if (this.isWearingBloodMoonSet()) {
      const acc = this.getHitChance();
      const procChance = (acc / 3) + ((acc * acc) * 2 / 9);
      return this.getAttackSpeed() - procChance;
    }

    return this.getAttackSpeed();
  }

  /**
   * Returns the expected damage per tick, based on the player's attack speed.
   */
  public getDpt() {
    return this.getDistribution()
      .getExpectedDamage() / this.getExpectedAttackSpeed();
  }

  /**
   * Returns the damage-per-second calculation, which is the damage-per-tick divided by the number of seconds per tick.
   */
  public getDps() {
    return this.getDpt() / SECONDS_PER_TICK;
  }

  /**
   * Returns the amount of time (in ticks) that the user can maintain their prayers before running out of prayer points.
   * Does not account for flicking or toggling prayers.
   */
  public getPrayerTicks(): number {
    const drain = sum(this.player.prayers, (p) => PrayerMap[p].drainRate);
    if (drain === 0) {
      return Infinity;
    }

    const drainResistance = 2 * this.player.bonuses.prayer + 60;
    const totalPrayerUnits = this.player.skills.prayer * drainResistance;

    return Math.ceil(totalPrayerUnits / drain);
  }

  /**
   * Returns the amount of time (in seconds) that the user can maintain their prayers before running out of prayer points.
   * Does not account for flicking or toggling prayers.
   */
  public getPrayerDuration(): number {
    return this.getPrayerTicks() * SECONDS_PER_TICK;
  }

  /**
   * Returns the average hits-to-kill calculation.
   */
  public getHtk() {
    const dist = this.getDistribution();
    const hist = dist.asHistogram();
    const startHp = this.monster.inputs.monsterCurrentHp;
    const max = Math.min(startHp, dist.getMax());
    if (max === 0) {
      return 0;
    }

    const htk = new Float64Array(startHp + 1); // 0 hits left to do if hp = 0

    for (let hp = 1; hp <= startHp; hp++) {
      let val = 1.0; // takes at least one hit
      for (let hit = 1; hit <= Math.min(hp, max); hit++) {
        const p = hist[hit];
        val += p.value * htk[hp - hit];
      }

      htk[hp] = val / (1 - hist[0].value);
    }

    return htk[startHp];
  }

  /**
   * Returns the average time-to-kill (in seconds) calculation.
   */
  public getTtk() {
    return this.getHtk() * this.getExpectedAttackSpeed() * SECONDS_PER_TICK;
  }

  public getSpecDps(): number {
    const specCost = this.getSpecCost();
    if (!specCost) {
      console.warn(`Expected spec cost for weapon [${this.player.equipment.weapon?.name}] but was not provided`);
      return 0;
    }

    const ticksToRegen = this.wearing('Lightbearer') ? 25 : 50;
    const ticksPerSpec = specCost * (ticksToRegen / 10);
    return this.getDps() / ticksPerSpec;
  }

  public getWeaponDelayProvider(): WeaponDelayProvider {
    const baseSpeed = this.getAttackSpeed();

    if (this.isWearingBloodMoonSet()) {
      return (wh) => {
        let chanceNoEffect = 1.0;
        for (const splat of wh.hitsplats) {
          if (splat.accurate) {
            chanceNoEffect *= 67 / 100;
          } else {
            break;
          }
        }

        return [
          [1 - chanceNoEffect, baseSpeed - 1],
          [chanceNoEffect, baseSpeed],
        ];
      };
    }

    return () => [[1.0, baseSpeed]];
  }

  /**
   * Returns a distribution of times-to-kill (in ticks) to probabilities.
   * Because the result will not be densely populated (unless attack speed is 1),
   * it is an object where keys are tick counts and values are probabilities.
   */
  public getTtkDistribution(): Map<number, number> {
    if (this.getDistribution()
      .getExpectedDamage() === 0) { // todo thralls, allow thrall-only compute?
      return new Map<number, number>();
    }

    // todo thralls, iterMax = ... * max(speed, thrall_speed) // or don't maybe also
    const speed = this.getAttackSpeed();
    const iterMax = TTK_DIST_MAX_ITER_ROUNDS * speed;

    const playerDist = this.getDistribution()
      .zipped
      .withProbabilisticDelays(this.getWeaponDelayProvider());

    // dist attack-on-specific-tick probabilities
    // todo thralls, append here
    const dists = [playerDist];
    const attackOnTick = dists.map(() => new Float64Array(iterMax + 1));
    attackOnTick.forEach((arr) => {
      arr[1] = 1.0; // we'll always attack with every applicable dist on the first tick (1-indexed)
    });

    // const tickHps = range(0, iterMax + 1).map(() => new Float64Array(this.monster.skills.hp + 1));
    // distribution of health values at current iter step
    const h = iterMax + 20;
    const w = this.monster.skills.hp + 1;
    const tickHpsRoot = new Float64Array(h * w);
    const tickHps = range(0, h)
      .map((i) => tickHpsRoot.subarray(w * i, w * (i + 1)));
    tickHps[1][this.monster.skills.hp] = 1.0;

    // output map, will be converted at the end
    const ttks = new Map<number, number>();

    // sum of non-zero-health probabilities
    let epsilon = 1.0;

    // if the hit dist depends on hp, we'll have to recalculate it each time, so cache the results to not repeat work
    const recalcDistOnHp = PlayerVsNPCCalc.distIsCurrentHpDependent(this.player, this.monster);
    const hpHitDists = new Array<DelayedHit[]>(this.monster.skills.hp + 1);
    hpHitDists[this.monster.skills.hp] = playerDist;
    if (recalcDistOnHp) {
      for (let hp = 0; hp <= this.monster.skills.hp; hp++) {
        hpHitDists[hp] = this.distAtHp(playerDist, hp);
      }
    }

    // 1. until the amount of hp values remaining above zero is more than our desired epsilon accuracy,
    //    or we reach the maximum iteration rounds
    for (let tick = 1; tick <= iterMax && epsilon >= TTK_DIST_EPSILON; tick++) {
      for (let distIx = 0; distIx < dists.length; distIx++) {
        const distProb = attackOnTick[distIx][tick];
        if (distProb === 0) {
          continue;
        }

        const dist = dists[distIx];

        // 3. for each possible hp value,
        const hps = tickHps[tick];
        for (const [hp, hpProb] of hps.entries()) {
          // this is a bit of a hack, but idk if there's a better way
          const currDist: DelayedHit[] = recalcDistOnHp ? hpHitDists[hp] : dist;
          if (hpProb === 0) {
            continue;
          }

          // 4. for each damage amount possible,
          for (const [wh, delay] of currDist) {
            const dmgProb = wh.probability;
            const dmg = wh.getSum();

            const chanceOfAction = dmgProb * hpProb;
            if (chanceOfAction === 0) {
              continue;
            }

            const newHp = hp - dmg;
            if (newHp <= 0) {
              ttks.set(tick, (ttks.get(tick) || 0) + chanceOfAction);
              epsilon -= chanceOfAction;
            } else {
              tickHps[tick + delay][newHp] += chanceOfAction;
              attackOnTick[distIx][tick + delay] += chanceOfAction;
            }
          }
        }
      }
    }

    return ttks;
  }

  distAtHp(baseDist: DelayedHit[], hp: number): DelayedHit[] {
    if (this.opts.disableMonsterScaling) {
      return baseDist;
    }

    if (!PlayerVsNPCCalc.distIsCurrentHpDependent(this.player, this.monster) || hp === this.monster.inputs.monsterCurrentHp) {
      return baseDist;
    }

    // a special case for optimization, ruby bolts only change dps under 500 hp
    // so for high health targets, avoid recomputing dist until then
    if (this.player.style.type === 'ranged'
      && this.player.equipment.weapon?.name.includes('rossbow')
      && ['Ruby bolts (e)', 'Ruby dragon bolts (e)'].includes(this.player.equipment.ammo?.name || '')
      && this.monster.inputs.monsterCurrentHp >= 500
      && hp >= 500) {
      return baseDist;
    }

    const subCalc = this.noInitSubCalc(
      this.player,
      scaleMonsterHpOnly({
        ...this.baseMonster,
        inputs: {
          ...this.baseMonster.inputs,
          monsterCurrentHp: hp,
        },
      }),
    );

    return subCalc.getDistribution().zipped.withProbabilisticDelays(this.getWeaponDelayProvider());
  }

  // a computational shortcut for internal class use only
  private noInitSubCalc(p: Player, m: Monster, opts: Partial<InternalOpts> = {}): PlayerVsNPCCalc {
    const subCalc = new PlayerVsNPCCalc(p, m, <InternalOpts>{ ...this.opts, ...opts, noInit: true });
    subCalc.allEquippedItems = this.allEquippedItems;
    subCalc.baseMonster = this.baseMonster;

    return subCalc;
  }

  demonbaneFactor(baseFactor: Factor): Factor {
    let ret = baseFactor;
    if (this.monster.name === 'Duke Sucellus') {
      ret = [ret[0] * 7, ret[1] * 10];
    }

    ret[0] += ret[1];
    return ret;
  }

  public static distIsCurrentHpDependent(loadout: Player, monster: Monster): boolean {
    if (monster.name === 'Vardorvis') {
      return true;
    }
    if (loadout.equipment.weapon?.name.includes('rossbow') && ['Ruby bolts (e)', 'Ruby dragon bolts (e)'].includes(loadout.equipment.ammo?.name || '')) {
      return true;
    }

    return false;
  }

  private static tbowScaling = (current: number, magic: number, accuracyMode: boolean): number => {
    const factor = accuracyMode ? 10 : 14;
    const base = accuracyMode ? 140 : 250;

    const t2 = Math.trunc((3 * magic - factor) / 100);
    const t3 = Math.trunc((Math.trunc(3 * magic / 10) - (10 * factor)) ** 2 / 100);

    const bonus = base + t2 - t3;
    return Math.trunc(current * bonus / 100);
  };

  getSpecCost(): number | undefined {
    const weaponName = this.player.equipment.weapon?.name;
    if (!weaponName) {
      return undefined;
    }

    return WEAPON_SPEC_COSTS[weaponName];
  }

  isSpecSupported(): FeatureStatus {
    const weaponName = this.player.equipment.weapon?.name;
    if (!weaponName) {
      return FeatureStatus.NOT_APPLICABLE;
    }

    if (this.getSpecCost() !== undefined) {
      return FeatureStatus.IMPLEMENTED;
    }

    if (UNIMPLEMENTED_SPECS.includes(weaponName)) {
      return FeatureStatus.UNIMPLEMENTED;
    }

    return FeatureStatus.NOT_APPLICABLE;
  }

  getSpecCalc(): PlayerVsNPCCalc | null {
    switch (this.isSpecSupported()) {
      case FeatureStatus.IMPLEMENTED:
      case FeatureStatus.PARTIALLY_IMPLEMENTED:
        return new PlayerVsNPCCalc(this.player, this.baseMonster, {
          ...this.opts,
          usingSpecialAttack: true,
        });

      default:
        return null;
    }
  }
}
