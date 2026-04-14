import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import {
  AttackDistribution,
  cappedRerollTransformer,
  DEFAULT_TRANSFORM_OPTS,
  DelayedHit,
  divisionTransformer,
  flatAddTransformer,
  flatLimitTransformer,
  HitDistribution,
  Hitsplat,
  HitTransformer,
  linearMinTransformer,
  multiplyTransformer,
  TransformOpts,
  WeaponDelayProvider,
  WeightedHit,
} from '@/lib/HitDist';
import {
  canUseSunfireRunes,
  getSpellMaxHit,
  isBindSpell,
  spellByName,
  Spellement,
} from '@/types/Spell';
import { PrayerData, PrayerMap } from '@/enums/Prayer';
import { isVampyre, MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  ABYSSAL_SIRE_TRANSITION_IDS,
  ALWAYS_MAX_HIT_MONSTERS,
  BA_ATTACKER_MONSTERS,
  DOOM_OF_MOKHAIOTL_IDS,
  ECLIPSE_MOON_IDS,
  COMBAT_SPELL_FIRE_RUNE_COST,
  GLOWING_CRYSTAL_IDS,
  GUARANTEED_ACCURACY_MONSTERS,
  GUARDIAN_IDS,
  HUEYCOATL_PHASE_IDS,
  HUEYCOATL_TAIL_IDS,
  ICE_DEMON_IDS,
  IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS,
  IMMUNE_TO_MELEE_DAMAGE_NPC_IDS,
  IMMUNE_TO_NON_SALAMANDER_MELEE_DAMAGE_NPC_IDS,
  IMMUNE_TO_RANGED_DAMAGE_NPC_IDS,
  KEPHRI_OVERLORD_IDS,
  NIGHTMARE_TOTEM_IDS,
  OLM_HEAD_IDS,
  OLM_MAGE_HAND_IDS,
  OLM_MELEE_HAND_IDS,
  ONE_HIT_MONSTERS,
  P2_WARDEN_IDS,
  SECONDS_PER_TICK,
  TEKTON_IDS,
  TITAN_BOSS_IDS,
  TITAN_ELEMENTAL_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TTK_DIST_EPSILON,
  TTK_DIST_MAX_ITER_ROUNDS,
  UNDERWATER_MONSTERS,
  USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS,
  VERZIK_P1_IDS,
  VESPULA_IDS,
  YAMA_VOID_FLARE_IDS,
  ZULRAH_IDS,
} from '@/lib/constants';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { DetailKey } from '@/lib/CalcDetails';
import { Factor, iLerp, MinMax } from '@/lib/Math';
import {
  calculateAttackSpeed,
  calculateEquipmentBonusesFromGear,
  getCanonicalItem,
  WEAPON_SPEC_COSTS,
} from '@/lib/Equipment';
import BaseCalc, { CalcOpts, InternalOpts } from '@/lib/BaseCalc';
import { scaleMonster, scaleMonsterHpOnly } from '@/lib/MonsterScaling';
import { CombatStyleType, getRangedDamageType } from '@/types/PlayerCombatStyle';
import { range, some, sum } from 'd3-array';
import { FeatureStatus, getCombatStylesForCategory, isDefined } from '@/utils';
import UserIssueType from '@/enums/UserIssueType';
import {
  BoltContext,
  diamondBolts,
  dragonstoneBolts,
  onyxBolts,
  opalBolts,
  pearlBolts,
  rubyBolts,
} from '@/lib/dists/bolts';
import { burningClawDoT, burningClawSpec, dClawDist } from '@/lib/dists/claws';

const PARTIALLY_IMPLEMENTED_SPECS: string[] = [
  'Ancient godsword',
];

// https://oldschool.runescape.wiki/w/Category:Weapons_with_Special_attacks
// Some entries are intentionally omitted as they are not dps-related (e.g. dragon skilling tools, ivandis flail, dbaxe)
const UNIMPLEMENTED_SPECS: string[] = [
  'Abyssal tentacle',
  'Ancient mace',
  'Armadyl crossbow',
  'Blue moon spear',
  'Bone dagger',
  'Brine sabre',
  'Darklight',
  "Dinh's bulwark",
  'Dorgeshuun crossbow',
  'Dragon 2h sword',
  'Dragon crossbow',
  'Dragon hasta',
  'Dragon spear',
  'Dragon thrownaxe',
  'Eclipse atlatl',
  'Excalibur',
  'Granite maul',
  'Rune claws',
  'Staff of balance',
  'Staff of light',
  'Staff of the dead',
  'Toxic staff of the dead',
  'Ursine chainmace',
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

    if (!this.opts.noInit && this.isSpecSupported() === FeatureStatus.UNIMPLEMENTED) {
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
      if (this.wearing([
        'Dragon claws',
        'Dragon dagger',
        'Dragon halberd',
        'Dragon longsword',
        'Dragon scimitar',
        'Crystal halberd',
        'Abyssal dagger',
        'Saradomin sword',
        'Arkan blade',
      ]) || this.isWearingGodsword()) {
        defenceStyle = 'slash';
      } else if (this.wearing(['Arclight', 'Emberlight', 'Dragon sword'])) {
        defenceStyle = 'stab';
      } else if (this.wearing(['Voidwaker', "Saradomin's blessed sword"])) {
        // doesn't really matter for voidwaker since it's 100% accuracy but eh
        defenceStyle = 'magic';
      } else if (this.wearing('Dragon mace')) {
        defenceStyle = 'crush';
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

    const isCustomMonster = this.monster.id === -1;

    if (((TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id) && !KEPHRI_OVERLORD_IDS.includes(this.monster.id)) || isCustomMonster) && this.monster.inputs.toaInvocationLevel) {
      defenceRoll = this.trackFactor(DetailKey.NPC_DEFENCE_ROLL_TOA, defenceRoll, [250 + this.monster.inputs.toaInvocationLevel, 250]);
    }

    return this.track(DetailKey.NPC_DEFENCE_ROLL_FINAL, defenceRoll);
  }

  private getPlayerMaxMeleeAttackRoll(): number {
    const { style } = this.player;

    let effectiveLevel: number = this.trackAdd(DetailKey.DAMAGE_LEVEL, this.player.skills.atk, this.player.boosts.atk);

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

    if (this.wearing('Crystal blessing')) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      attackRoll = Math.trunc(attackRoll * (20 + crystalPieces) / 20);
    }

    // These bonuses do not stack with each other
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_FORINTHRY_SURGE, attackRoll, factor);
    } else if (this.wearing(['Salve amulet (e)', 'Salve amulet(ei)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SALVE, attackRoll, [6, 5]);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SALVE, attackRoll, [7, 6]);
    } else if (this.isWearingBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_BLACK_MASK, attackRoll, [7, 6]);
    }

    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      const obsidianBonus = this.trackFactor(DetailKey.PLAYER_ACCURACY_OBSIDIAN, baseRoll, [1, 10]);
      attackRoll = this.trackAdd(DetailKey.PLAYER_ACCURACY_OBSIDIAN, attackRoll, obsidianBonus);
    }

    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_REV_WEAPON, attackRoll, [3, 2]);
    }
    if (this.wearing(['Arclight', 'Emberlight']) && mattrs.includes(MonsterAttribute.DEMON)) {
      attackRoll = this.trackAddFactor(DetailKey.PLAYER_ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor(70));
    }
    if (this.wearing(['Bone claws', 'Burning claws']) && mattrs.includes(MonsterAttribute.DEMON)) {
      attackRoll = this.trackAddFactor(DetailKey.PLAYER_ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor(5));
    }
    if (mattrs.includes(MonsterAttribute.DRAGON)) {
      if (this.wearing('Dragon hunter lance')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_DRAGONHUNTER, attackRoll, [6, 5]);
      } else if (this.wearing('Dragon hunter wand')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_DRAGONHUNTER, attackRoll, [7, 4]);
      }
    }
    if (this.wearing('Keris partisan of breaching') && mattrs.includes(MonsterAttribute.KALPHITE)) {
      // https://twitter.com/JagexAsh/status/1704107285381787952
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_KERIS, attackRoll, [133, 100]);
    }
    if (this.wearing('Keris partisan of the sun')
      && TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id)
      && this.monster.inputs.monsterCurrentHp < Math.trunc(this.monster.skills.hp / 4)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_KERIS, attackRoll, [5, 4]);
    }
    if (this.wearing(['Blisterwood flail', 'Blisterwood sickle']) && isVampyre(mattrs)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_VAMPYREBANE, attackRoll, [21, 20]);
    }
    if (this.isWearingSilverWeapon() && this.wearing("Efaritay's aid") && isVampyre(mattrs)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_EFARITAY, attackRoll, [23, 20]); // todo ordering? does this stack multiplicatively with vampyrebane?
    }

    if (this.wearing('Granite hammer') && mattrs.includes(MonsterAttribute.GOLEM)) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_GOLEMBANE, attackRoll, [13, 10]);
    }

    // Inquisitor's armour set gives bonuses when using the crush attack style
    if (style.type === 'crush') {
      let inqPieces = this.allEquippedItems.filter((v) => [
        "Inquisitor's great helm",
        "Inquisitor's hauberk",
        "Inquisitor's plateskirt",
      ].includes(v)).length;

      // When wearing the full set, the bonus is enhanced
      if (inqPieces > 0) {
        if (this.wearing("Inquisitor's mace")) {
          // 2.5% per piece, no full-set bonus
          inqPieces *= 5;
        } else if (inqPieces === 3) {
          // 1.0% extra for full set when not using inq mace
          inqPieces = 5;
        }
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_INQ, attackRoll, [200 + inqPieces, 200]);
      }
    }

    if (this.opts.usingSpecialAttack) {
      if (this.isWearingGodsword()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
      } else if (this.isWearingFang() || this.wearing('Arkan blade') || this.wearing('Granite hammer')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [3, 2]);
      } else if (this.wearing(['Elder maul', 'Dragon mace', 'Dragon sword', 'Dragon scimitar', 'Abyssal whip'])) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [5, 4]);
      } else if (this.wearing('Dragon dagger')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [23, 20]);
      } else if (this.wearing('Abyssal dagger')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [5, 4]);
      } else if (this.wearing('Soulreaper axe')) {
        const stacks = Math.max(0, Math.min(5, this.player.buffs.soulreaperStacks));
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [100 + 6 * stacks, 100]);
      } else if (this.wearing('Brine sabre')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
      } else if (this.wearing('Barrelchest anchor')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
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

    if (this.wearing('Soulreaper axe') && !this.opts.usingSpecialAttack) {
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

    if (this.wearing('Crystal blessing')) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
    }

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
    } else if (this.isWearingBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_BLACK_MASK, maxHit, [7, 6]);
    }

    if (this.wearing(['Arclight', 'Emberlight']) && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackAddFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor(70));
    }
    if (this.wearing(['Bone claws', 'Burning claws']) && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackAddFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor(5));
    }
    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      const obsidianBonus = this.trackFactor(DetailKey.MAX_HIT_OBSIDIAN, baseMax, [1, 10]);
      maxHit = this.trackAdd(DetailKey.MAX_HIT_OBSIDIAN, maxHit, obsidianBonus);
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes(MonsterAttribute.DRAGON)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, maxHit, [6, 5]);
    }
    if (this.wearing('Dragon hunter wand') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // still applies to dhw when wand bashing
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, maxHit, [7, 5]);
    }
    if (this.isWearingKeris() && mattrs.includes(MonsterAttribute.KALPHITE)) {
      if (this.wearing('Keris partisan of amascut')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_KERIS, maxHit, [115, 100]);
      } else {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_KERIS, maxHit, [133, 100]);
      }
    }
    if (this.wearing('Barronite mace') && mattrs.includes(MonsterAttribute.GOLEM)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_GOLEMBANE, maxHit, [23, 20]);
    }
    if (this.wearing('Granite hammer') && mattrs.includes(MonsterAttribute.GOLEM)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_GOLEMBANE, maxHit, [13, 10]);
    }
    if (this.isRevWeaponBuffApplicable()) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_REV_WEAPON, maxHit, [3, 2]);
    }
    if (this.wearing(['Silverlight', 'Darklight', 'Silverlight (dyed)']) && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackAddFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor(60));
    }
    if (this.wearing('Infernal tecpatl') && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackAddFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor(10));
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

      if (inqPieces > 0) {
        if (this.wearing("Inquisitor's mace")) {
          // 2.5% per piece, no full-set bonus
          inqPieces *= 5;
        } else if (inqPieces === 3) {
          // 1.0% extra for full set when not using inq mace
          inqPieces = 5;
        }
        maxHit = this.trackFactor(DetailKey.MAX_HIT_INQ, maxHit, [200 + inqPieces, 200]);
      }
    }

    if (this.player.leagues.six.effects.talent_distance_melee_minhit) {
      const minhitBonus = 3 * this.getDistanceToEnemy();
      minHit = this.trackAdd(DetailKey.LEAGUES_MIN_HIT_DISTANCE_MELEE, minHit, minhitBonus);
    }

    if (this.player.leagues.six.effects.talent_percentage_melee_maxhit_distance) {
      const maxhitFactor = 100 + 4 * (Math.floor(this.getDistanceToEnemy() / 3) + 1);
      maxHit = this.trackFactor(DetailKey.LEAGUES_MAX_HIT_DISTANCE_MELEE, maxHit, [maxhitFactor, 100]);
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
      if (this.isWearingGodsword()) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_GODSWORD_SPEC, maxHit, [11, 10]);
      }

      if (this.wearing(['Bandos godsword', 'Saradomin sword'])) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [11, 10]);
      } else if (this.wearing(['Armadyl godsword', 'Dragon sword', 'Dragon longsword', "Saradomin's blessed sword"])) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [5, 4]);
      } else if (this.wearing(['Dragon mace', 'Dragon warhammer', 'Arkan blade'])) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [3, 2]);
      } else if (this.wearing('Voidwaker')) {
        minHit = this.trackFactor(DetailKey.MIN_HIT_SPEC, maxHit, [1, 2]);
        maxHit = this.trackAdd(DetailKey.MAX_HIT_SPEC, maxHit, minHit);
      } else if (this.wearing(['Dragon halberd', 'Crystal halberd'])) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [11, 10]);
      } else if (this.wearing('Dragon dagger')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [23, 20]);
      } else if (this.wearing('Abyssal dagger')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [17, 20]);
      } else if (this.wearing('Abyssal bludgeon')) {
        const prayerMissing = Math.max(-this.player.boosts.prayer, 0);
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [100 + (prayerMissing / 2), 100]);
      } else if (this.wearing('Barrelchest anchor')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [110, 100]);
      } else if (this.isWearingBloodMoonSet()) {
        minHit = this.trackFactor(DetailKey.MIN_HIT_SPEC, maxHit, [1, 4]);
        maxHit = this.trackAdd(DetailKey.MAX_HIT_SPEC, maxHit, minHit);
      } else if (this.wearing('Soulreaper axe')) {
        const stacks = Math.max(0, Math.min(5, this.player.buffs.soulreaperStacks));
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [100 + 6 * stacks, 100]);
      }
    }

    if (this.monster.name === 'Respiratory system') {
      minHit = this.trackAdd(DetailKey.REPIRATORY_SYSTEM_MIN_HIT, minHit, Math.trunc(maxHit / 2));
    }

    const percentMeleeDamage = this.player.leagues.six.effects?.talent_percentage_melee_damage ?? 0;
    if (percentMeleeDamage > 0) {
      maxHit = this.trackFactor(DetailKey.LEAGUES_MELEE_DAMAGE_TALENT, maxHit, [100 + percentMeleeDamage, 100]);
    }

    const weaponWeight = this.player.equipment.weapon?.weight ?? Infinity;
    const isOneHanded = this.player.equipment.weapon?.isTwoHanded === false;
    if (this.player.leagues.six.effects.talent_multi_hit_str_increase && (weaponWeight < 1 || isOneHanded)) {
      const strengthBonus = Math.trunc(this.player.skills.str * 0.20);
      maxHit = this.trackFactor(DetailKey.LEAGUES_MULTI_HIT_STR_INCREASE, maxHit, [100 + strengthBonus, 100]);
    }

    if (this.player.leagues.six.effects.talent_unique_blindbag_damage && this.opts.isBlindBag) {
      const damageBonus = 2 * this.getBlindbagUniques();
      maxHit = this.trackFactor(DetailKey.LEAGUES_BLINDBAG_DAMAGE_BONUS, maxHit, [100 + damageBonus, 100]);
    }

    return [minHit, maxHit];
  }

  private getPlayerMaxRangedAttackRoll() {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.PLAYER_ACCURACY_LEVEL, this.player.skills.ranged + this.player.boosts.ranged);
    for (const p of this.getCombatPrayers('factorAccuracy')) {
      let factor = p.factorAccuracy!;
      if (this.player.leagues.six.effects.talent_buffed_ranged_prayers) {
        factor = [Math.trunc((factor[0] - factor[1]) * 13 / 10) + factor[1], factor[1]];
      }
      effectiveLevel = this.trackFactor(DetailKey.PLAYER_ACCURACY_LEVEL_PRAYER, effectiveLevel, factor);
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
    } else if (this.isWearingImbuedBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23 / 20);
    }

    if (this.wearing('Twisted bow')) {
      const cap = mattrs.includes(MonsterAttribute.XERICIAN) ? 350 : 250;
      const tbowMagic = Math.min(cap, Math.max(this.monster.skills.magic, this.monster.offensive.magic));
      attackRoll = PlayerVsNPCCalc.tbowScaling(attackRoll, tbowMagic, true);
      if (P2_WARDEN_IDS.includes(this.monster.id)) {
        // Game update on 2023-06-21 caused this bonus to be applied twice at P2 Wardens
        attackRoll = PlayerVsNPCCalc.tbowScaling(attackRoll, tbowMagic, true);
      }
    }
    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = Math.trunc(attackRoll * 3 / 2);
    }
    if (this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      attackRoll = Math.trunc(attackRoll * 13 / 10);
    }
    if (this.player.equipment.weapon?.category === EquipmentCategory.CHINCHOMPA) {
      const distance = Math.min(7, Math.max(1, this.player.buffs.chinchompaDistance));

      let numerator: number = 4;
      if (style.name === 'Short fuse') {
        if (distance >= 7) {
          numerator = 2;
        } else if (distance >= 4) {
          numerator = 3;
        }
      } else if (style.name === 'Medium fuse') {
        if (distance < 4 || distance >= 7) {
          numerator = 3;
        }
      } else if (style.name === 'Long fuse') {
        if (distance < 4) {
          numerator = 2;
        } else if (distance < 7) {
          numerator = 3;
        }
      }

      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_CHINCHOMPA, attackRoll, [numerator, 4]);
    }

    if (this.wearing('Scorching bow') && mattrs.includes(MonsterAttribute.DEMON)) {
      attackRoll = this.trackAddFactor(DetailKey.PLAYER_ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor(30));
    }

    if (this.opts.usingSpecialAttack) {
      if (this.wearing(['Zaryte crossbow', 'Webweaver bow']) || this.isWearingBlowpipe()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
      } else if (this.isWearingMsb()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [10, 7]);
      } else if (this.wearing(['Heavy ballista', 'Light ballista'])) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [5, 4]);
      } else if (this.wearing('Rosewood blowpipe')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [4, 5]);
      }
    }

    if (TITAN_BOSS_IDS.includes(this.monster.id) && this.monster.inputs.phase === 'Out of Melee Range') {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_TITANS_RANGED, attackRoll, [6, 1]);
    }

    return attackRoll;
  }

  /**
   * Get the player's max ranged hit
   */
  private getPlayerMaxRangedHit(): MinMax {
    const { style } = this.player;

    let effectiveLevel: number = this.player.skills.ranged + this.player.boosts.ranged;
    const scalesWithStr: boolean = this.wearing(['Eclipse atlatl', "Hunter's spear"]);
    if (scalesWithStr) {
      // atlatl uses strength instead of ranged skill, melee strength bonus, and melee buff from slayer helmet/salve, but works with ranged void
      effectiveLevel = this.player.skills.str + this.player.boosts.str;
    }
    this.track(DetailKey.DAMAGE_LEVEL, effectiveLevel);

    if (this.wearing('Holy water')) {
      if (!this.monster.attributes.includes(MonsterAttribute.DEMON)) {
        // can't be used against non-demons
        return [0, 0];
      }

      // similar to msb + mlb + seercull below
      effectiveLevel = this.trackAdd(DetailKey.DAMAGE_EFFECTIVE_LEVEL_HOLY_WATER, effectiveLevel, 10);

      const str = 64 + this.player.equipment.weapon!.bonuses.ranged_str;
      let maxHit = this.trackMaxHitFromEffective(DetailKey.MAX_HIT_BASE, effectiveLevel, str);

      if (this.monster.attributes.includes(MonsterAttribute.DEMON)) {
        maxHit = this.trackAddFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor(60));
      }
      if (this.monster.name === 'Nezikchened') {
        maxHit = this.trackAdd(DetailKey.MAX_HIT_NEZIKCHENED, maxHit, 5);
      }

      return [0, maxHit];
    }

    if ((this.opts.usingSpecialAttack && (this.isWearingMsb() || this.isWearingMlb() || this.wearing('Seercull'))) || this.isWearingOgreBow()) {
      // why +10 when that's not used anywhere else? who knows
      effectiveLevel += 10;

      // ignores other gear
      const bonusStr = this.player.equipment.ammo?.bonuses.ranged_str || 0;
      const maxHit = Math.trunc((effectiveLevel * (bonusStr + 64) + 320) / 640);

      // end early, it ignores all other gear and bonuses
      return [0, maxHit];
    }

    for (const p of this.getCombatPrayers()) {
      let factor = p.factorStrength!;
      if (this.player.leagues.six.effects.talent_buffed_ranged_prayers) {
        factor = [Math.trunc((factor[0] - factor[1]) * 13 / 10) + factor[1], factor[1]];
      }
      if (p.name === 'Sharp Eye' && Math.trunc(effectiveLevel * factor[0] / factor[1]) === effectiveLevel) {
        // force 1 level gain
        effectiveLevel = this.trackAdd(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, 1);
      } else {
        effectiveLevel = this.trackFactor(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, factor);
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

    const bonusStr = scalesWithStr ? this.player.bonuses.str : this.player.bonuses.ranged_str;
    const baseMax = this.trackMaxHitFromEffective(DetailKey.MAX_HIT_BASE, effectiveLevel, 64 + bonusStr);
    let [minHit, maxHit]: MinMax = [0, baseMax];

    // tested this in-game, slayer helmet (i) + crystal legs + crystal body + bowfa, on accurate, no rigour, 99 ranged
    // max hit is 36, but would be 37 if placed after slayer helm
    if (this.isWearingCrystalBow()) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
    }

    const mattrs = this.monster.attributes;
    let needRevWeaponBonus = this.isRevWeaponBuffApplicable();
    let needDragonbane = this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON);
    let needDemonbane = this.wearing('Scorching bow') && mattrs.includes(MonsterAttribute.DEMON);

    // Specific bonuses that are applied from equipment
    const { buffs } = this.player;
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      maxHit = this.trackFactor(DetailKey.MAX_HIT_FORINTHRY_SURGE, maxHit, factor);
    } else if ((this.wearing('Salve amulet(ei)') || (scalesWithStr && this.wearing('Salve amulet (e)'))) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 6 / 5);
    } else if ((this.wearing('Salve amulet(i)') || (scalesWithStr && this.wearing('Salve amulet'))) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 7 / 6);
    } else if (scalesWithStr && this.isWearingBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
      maxHit = Math.trunc(maxHit * 7 / 6);
    } else if (this.isWearingImbuedBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
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
      if (needDemonbane) {
        needDemonbane = false;
        numerator += 6;
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
    if (needDemonbane) {
      maxHit = this.trackAddFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor(30));
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
      } else if (this.wearing('Webweaver bow')) {
        const maxReduction = Math.trunc(maxHit * 6 / 10);
        maxHit = this.trackAdd(DetailKey.MAX_HIT_SPEC, maxHit, -maxReduction);
      } else if (this.wearing(['Heavy ballista', 'Light ballista'])) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [5, 4]);
      } else if (this.wearing('Rosewood blowpipe')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [11, 10]);
      }
    }

    if (this.opts.usingSpecialAttack) {
      if (this.wearing('Dark bow')) {
        const descentOfDragons = this.wearing('Dragon arrow');
        minHit = this.track(DetailKey.MIN_HIT_SPEC, descentOfDragons ? 8 : 5);
        const dmgFactor = descentOfDragons ? 15 : 13;
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [dmgFactor, 10]);
      }
    }

    if (P2_WARDEN_IDS.includes(this.monster.id)) {
      [minHit, maxHit] = this.applyP2WardensDamageModifier([minHit, maxHit]);
    }

    if (this.monster.name === 'Respiratory system') {
      minHit = this.trackAdd(DetailKey.REPIRATORY_SYSTEM_MIN_HIT, minHit, Math.trunc(maxHit / 2));
    }

    if (this.player.leagues.six.effects.talent_crossbow_slow_big_hits
      && this.player.equipment.weapon?.category === 'Crossbow') {
      maxHit = this.trackFactor(DetailKey.LEAGUES_CROSSBOW_SLOW_BIG_HITS, maxHit, [170, 100]);
    }

    const rangeDamage = this.player.leagues.six.effects?.talent_percentage_ranged_damage || 0;
    if (rangeDamage > 0) {
      maxHit = this.trackFactor(DetailKey.LEAGUES_RANGED_DAMAGE_TALENT, maxHit, [100 + rangeDamage, 100]);
    }

    return [minHit, maxHit];
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

    const usingPoweredStaff = this.player.equipment.weapon?.category === EquipmentCategory.POWERED_STAFF
      && this.player.style.stance !== 'Manual Cast';
    if (usingPoweredStaff && this.wearing('Crystal blessing')) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      attackRoll = Math.trunc(attackRoll * (20 + crystalPieces) / 20);
    }

    let additiveBonus = 0;
    let blackMaskBonus = false;
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_FORINTHRY_SURGE, additiveBonus, buffs.forinthrySurge ? 35 : 20);
    } else if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_SALVE, additiveBonus, 20);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      additiveBonus = this.trackAdd(DetailKey.PLAYER_ACCURACY_SALVE, additiveBonus, 15);
    } else if (this.isWearingImbuedBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    if (this.wearing("Efaritay's aid") && isVampyre(mattrs) && this.isWearingSilverWeapon()) {
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

    if (mattrs.includes(MonsterAttribute.DRAGON)) {
      // this still applies to dhl and dhcb when autocasting
      if (this.wearing('Dragon hunter crossbow')) {
        attackRoll = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, attackRoll, [13, 10]);
      } else if (this.wearing('Dragon hunter lance')) {
        attackRoll = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, attackRoll, [6, 5]);
      } else if (this.wearing('Dragon hunter wand')) {
        attackRoll = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, attackRoll, [7, 4]);
      }
    }

    if (blackMaskBonus) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_BLACK_MASK, attackRoll, [23, 20]);
    }

    if (this.player.spell?.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      let demonbanePercent = buffs.markOfDarknessSpell ? 40 : 20;
      if (this.wearing('Purging staff')) {
        demonbanePercent *= 2;
      }
      attackRoll = this.trackAddFactor(DetailKey.PLAYER_ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor(demonbanePercent));
    }
    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_REV_WEAPON, attackRoll, [3, 2]);
    }
    if (this.wearing('Tome of water') && (this.getSpellement() === 'water' || isBindSpell(this.player.spell))) { // todo does this go here?
      attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_TOME, attackRoll, [6, 5]);
    }

    if (this.opts.usingSpecialAttack) {
      if (this.isWearingAccursedSceptre()) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [3, 2]);
      } else if (this.wearing('Volatile nightmare staff')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [3, 2]);
      } else if (this.wearing('Eye of ayak')) {
        attackRoll = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPEC, attackRoll, [2, 1]);
      }
    }

    const spellement = this.getSpellement();
    const weakness = this.getMonsterWeakness();
    if (spellement && spellement === weakness?.element) {
      const bonus = this.trackFactor(DetailKey.PLAYER_ACCURACY_SPELLEMENT_BONUS, baseRoll, [weakness.severity, 100]);
      attackRoll = this.trackAdd(DetailKey.PLAYER_ACCURACY_SPELLEMENT, attackRoll, bonus);
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
        if (this.wearing("Slayer's staff (e)") && this.isSlayerMonster() && buffs.onSlayerTask) {
          maxHit = Math.trunc(13 + magicLevel / 6);
        } else {
          maxHit = Math.trunc(10 + magicLevel / 10);
        }
      }
    } else if (this.wearing('Starter staff')) {
      maxHit = 8;
    } else if (this.wearing(['Trident of the seas', 'Trident of the seas (e)'])) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3 - 5));
    } else if (this.wearing("Thammaron's sceptre")) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3 - 8));
    } else if (this.wearing('Accursed sceptre') || (this.wearing('Accursed sceptre (a)') && this.opts.usingSpecialAttack)) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3 - 6));
    } else if (this.wearing(['Trident of the swamp', 'Trident of the swamp (e)'])) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3 - 2));
    } else if (this.wearing(['Sanguinesti staff', 'Holy sanguinesti staff'])) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3 - 1));
    } else if (this.wearing('Dawnbringer')) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 6 - 1));
      if (this.opts.usingSpecialAttack) { // guaranteed hit between 75-150, ignores bonuses
        return [75, 150];
      }
    } else if (this.wearing("Tumeken's shadow")) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3) + 1);
    } else if (this.wearing('Eye of ayak')) {
      maxHit = Math.max(1, Math.trunc(magicLevel / 3) - 6);
    } else if (this.wearing('Lithic sceptre')) {
      maxHit = Math.max(10, Math.trunc(magicLevel / 3) - 10);
    } else if (this.wearing('Warped sceptre')) {
      maxHit = Math.max(1, Math.trunc((8 * magicLevel + 96) / 37));
    } else if (this.wearing('Bone staff')) {
      // although the +10 is technically a ratbane bonus, the weapon can't be used against non-rats
      // and shows this max hit against the combat dummy as well
      maxHit = Math.max(1, Math.trunc(magicLevel / 3) - 5) + 10;
    } else if (this.wearing('Eldritch nightmare staff') && this.opts.usingSpecialAttack) {
      maxHit = Math.max(1, Math.min(44, Math.trunc((99 + 44 * magicLevel) / 99)));
    } else if (this.wearing('Volatile nightmare staff') && this.opts.usingSpecialAttack) {
      maxHit = Math.max(1, Math.min(58, Math.trunc((99 + 58 * magicLevel) / 99)));
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
    this.track(DetailKey.MAX_HIT_BASE, maxHit);

    if (this.opts.usingSpecialAttack && this.wearing('Eye of ayak')) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [13, 10]);
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
    } else if (this.isWearingImbuedBlackMask() && this.isSlayerMonster() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    for (const p of this.getCombatPrayers('magicDamageBonus')) {
      magicDmgBonus += p.magicDamageBonus!;
    }

    maxHit = this.trackAddFactor(DetailKey.MAX_HIT_MAGIC_DMG, maxHit, [magicDmgBonus, 1000]);

    const usingPoweredStaff = this.player.equipment.weapon?.category === EquipmentCategory.POWERED_STAFF
      && this.player.style.stance !== 'Manual Cast';
    if (usingPoweredStaff && this.wearing('Crystal blessing')) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
    }

    if (blackMaskBonus) {
      maxHit = Math.trunc(maxHit * 23 / 20);
    }

    if (mattrs.includes(MonsterAttribute.DRAGON)) {
      // this still applies to dhl and dhcb when autocasting
      if (this.wearing('Dragon hunter lance')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, maxHit, [6, 5]);
      } else if (this.wearing('Dragon hunter wand')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, maxHit, [7, 5]);
      } else if (this.wearing('Dragon hunter crossbow')) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_DRAGONHUNTER, maxHit, [5, 4]);
      }
    }

    if (this.isRevWeaponBuffApplicable()) {
      maxHit = Math.trunc(maxHit * 3 / 2);
    }

    if (this.opts.usingSpecialAttack) {
      if (this.isWearingAccursedSceptre()) {
        maxHit = this.trackFactor(DetailKey.MAX_HIT_SPEC, maxHit, [3, 2]);
      }
    }

    const spellement = this.getSpellement();
    const weakness = this.getMonsterWeakness();
    if (spellement && spellement === weakness?.element) {
      const bonus = this.trackFactor(DetailKey.MAX_HIT_SPELLEMENT_BONUS, baseMax, [weakness.severity, 100]);
      maxHit = this.trackAdd(DetailKey.MAX_HIT_SPELLEMENT, maxHit, bonus);
    }

    if (this.player.buffs.usingSunfireRunes && canUseSunfireRunes(this.player.spell)) {
      // sunfire runes are applied pre-tome
      minHit = this.trackFactor(DetailKey.MIN_HIT_SUNFIRE, maxHit, [1, 10]);
    }

    if ((this.wearing('Tome of fire') && this.player.equipment.shield?.version === 'Charged' && this.getSpellement() === 'fire')
      || (this.wearing('Tome of water') && this.player.equipment.shield?.version === 'Charged' && this.getSpellement() === 'water')
       || (this.wearing('Tome of earth') && this.player.equipment.shield?.version === 'Charged' && this.getSpellement() === 'earth')) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_TOME, maxHit, [11, 10]);
    }

    if (P2_WARDEN_IDS.includes(this.monster.id)) {
      [minHit, maxHit] = this.applyP2WardensDamageModifier([minHit, maxHit]);
    }

    if (this.monster.name === 'Respiratory system') {
      minHit = this.trackAdd(DetailKey.REPIRATORY_SYSTEM_MIN_HIT, minHit, Math.trunc(maxHit / 2));
    }

    if (this.player.leagues.six.effects.talent_magic_attack_speed_powered
      && this.player.equipment.weapon?.category === EquipmentCategory.POWERED_STAFF
      && this.player.style.stance !== 'Manual Cast'
      && this.player.equipment.weapon?.isTwoHanded === false) {
      maxHit = this.trackAdd(DetailKey.LEAGUES_MAGIC_ATTACK_SPEED_POWERED, maxHit, -8);
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
   * Don't use this for player-facing values! Use `getMax()`
   */
  getMinAndMax(): MinMax {
    if (this.player.style.stance !== 'Manual Cast' && this.isAmmoInvalid()) {
      return [0, 0];
    }

    if (this.opts.overrides.maxHit) {
      return this.opts.overrides.maxHit;
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

    if (minMax[0] > minMax[1]) {
      minMax[1] = minMax[0];
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

    if (this.player.style.stance !== 'Manual Cast' && this.isAmmoInvalid()) {
      return this.track(DetailKey.PLAYER_ACCURACY_ROLL_FINAL, 0.0);
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

    if (this.player.leagues.six.effects.talent_all_style_accuracy) {
      const factor = this.player.leagues.six.effects.talent_all_style_accuracy;
      atkRoll = this.trackFactor(DetailKey.LEAGUES_ALL_STYLE_ACCURACY, atkRoll, [100 + factor, 100]);
    }

    return this.track(DetailKey.PLAYER_ACCURACY_ROLL_FINAL, atkRoll);
  }

  public getDisplayHitChance(): number {
    let hitChance = this.getHitChance();

    if (hitChance === 1.0 || hitChance === 0.0) {
      // probably a special effect
      return hitChance;
    }

    const atk = this.getMaxAttackRoll();
    const def = this.getNPCDefenceRoll();

    if (this.player.style.type === 'magic' && this.wearing('Brimstone ring')) {
      const effectHitChance = this.track(
        DetailKey.PLAYER_ACCURACY_BRIMSTONE,
        BaseCalc.getNormalAccuracyRoll(atk, Math.trunc(def * 9 / 10)),
      );

      hitChance = 0.75 * hitChance + 0.25 * effectHitChance;
    }

    return hitChance;
  }

  public getHitChance() {
    if (this.opts.overrides?.accuracy) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, this.opts.overrides.accuracy);
    }

    if (GUARANTEED_ACCURACY_MONSTERS.includes(this.monster.id)) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (DOOM_OF_MOKHAIOTL_IDS.includes(this.monster.id) && this.monster.inputs.phase !== 'Normal') {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (VERZIK_P1_IDS.includes(this.monster.id) && this.wearing('Dawnbringer')) {
      this.track(DetailKey.PLAYER_ACCURACY_DAWNBRINGER, 1.0);
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (P2_WARDEN_IDS.includes(this.monster.id)) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    // Giant rat (Scurrius)
    if (this.monster.id === 7223 && this.player.style.stance !== 'Manual Cast') {
      this.track(DetailKey.PLAYER_ACCURACY_SCURRIUS_RAT, 1.0);
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (this.monster.name === 'Tormented Demon' && this.monster.inputs.phase !== 'Shielded') {
      this.track(DetailKey.PLAYER_ACCURACY_TD, 1.0);
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    // Ice elemental (Royal Titans) Fire elemental (Royal Titans)
    if (TITAN_ELEMENTAL_IDS.includes(this.monster.id) && this.player.style.type === 'magic') {
      let accuracy = Math.min(1.0, Math.max(0, this.player.offensive.magic) / 100 + 0.3);
      if (this.isWearingEliteMagicVoid() || this.isWearingMagicVoid()) {
        accuracy = Math.min(1.0, accuracy * 1.45);
      }
      this.track(DetailKey.PLAYER_ACCURACY_ROYAL_TITAN_ELEMENTAL, accuracy);
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, accuracy);
    }

    // Eclipse Moon clone phase
    if (ECLIPSE_MOON_IDS.includes(this.monster.id) && this.monster.version === 'Clone' && this.isUsingMeleeStyle()) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (this.player.style.type === 'magic' && ALWAYS_MAX_HIT_MONSTERS.magic.includes(this.monster.id)) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }
    if (this.player.style.type === 'ranged' && ALWAYS_MAX_HIT_MONSTERS.ranged.includes(this.monster.id)) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }
    if (this.isUsingMeleeStyle() && ALWAYS_MAX_HIT_MONSTERS.melee.includes(this.monster.id)) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (this.opts.usingSpecialAttack && this.wearing(['Voidwaker', 'Dawnbringer'])) {
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    if (this.opts.usingSpecialAttack && (this.wearing('Seercull') || this.isWearingMlb())) {
      if (this.isAmmoInvalid()) {
        return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 0.0);
      }
      return this.track(DetailKey.PLAYER_ACCURACY_FINAL, 1.0);
    }

    const atk = this.getMaxAttackRoll();
    const def = this.getNPCDefenceRoll();

    let hitChance = this.track(
      DetailKey.PLAYER_ACCURACY_BASE,
      BaseCalc.getNormalAccuracyRoll(atk, def),
    );

    if (this.player.leagues.six.effects.talent_crossbow_double_accuracy_roll
      && this.player.equipment.weapon?.category === 'Crossbow'
      && !this.opts.isEcho) {
      hitChance = this.track(
        DetailKey.LEAGUES_CROSSBOW_DOUBLE_ACCURACY,
        BaseCalc.getFangAccuracyRoll(atk, def),
      );
    }

    const fangAccuracy = this.isWearingFang() && this.player.style.type === 'stab';
    const drygoreAccuracy = this.wearing('Drygore blowpipe') && this.player.style.stance !== 'Manual Cast';
    if (fangAccuracy || drygoreAccuracy) {
      if (fangAccuracy && TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id)) {
        hitChance = this.track(DetailKey.PLAYER_ACCURACY_FANG_TOA, 1 - (1 - hitChance) ** 2);
      } else {
        hitChance = this.track(
          DetailKey.PLAYER_ACCURACY_FANG,
          BaseCalc.getFangAccuracyRoll(atk, def),
        );
      }
    }

    if (this.wearing('Confliction gauntlets') && this.player.style.type === 'magic' && !this.player.equipment.weapon?.isTwoHanded) {
      hitChance = this.track(DetailKey.PLAYER_ACCURACY_CONFLICTION_GAUNTLETS, BaseCalc.getConflictionGauntletsAccuracyRoll(atk, def));
    }

    if (this.player.leagues.six.effects.talent_max_accuracy_roll_from_range) {
      // Proc chance capped to 20 tiles (guaranteed success) - technically there is a 10 tile range cap for all weapons which is not respected here.
      const procChance = Math.min(1, 0.05 * this.getDistanceToEnemy());
      const maxAccuracyHitChance = BaseCalc.getMaxAccuracyHitChance(atk, def);
      hitChance = hitChance * (1 - procChance) + maxAccuracyHitChance * procChance;
    }

    return this.track(DetailKey.PLAYER_ACCURACY_FINAL, hitChance);
  }

  public getDoTExpected(): number {
    let ret: number = 0;
    if (this.opts.usingSpecialAttack) {
      if (this.wearing(['Bone claws', 'Burning claws']) && !this.isImmuneToNormalBurns()) {
        ret = burningClawDoT(this.getHitChance());
      } else if (this.wearing('Scorching bow') && !this.isImmuneToNormalBurns()) {
        ret = this.monster.attributes.includes(MonsterAttribute.DEMON) ? 5 : 1;
      } else if (this.wearing('Arkan blade') && !this.isImmuneToNormalBurns()) {
        ret = 10 * this.getHitChance();
      }
    }

    if (ret !== 0) {
      this.track(DetailKey.DOT_EXPECTED, ret);
    }
    return ret;
  }

  public getDoTMax(): number {
    let ret: number = 0;
    if (this.opts.usingSpecialAttack) {
      if (this.wearing(['Bone claws', 'Burning claws']) && !this.isImmuneToNormalBurns()) {
        ret = 29;
      } else if (this.wearing('Scorching bow') && !this.isImmuneToNormalBurns()) {
        ret = this.monster.attributes.includes(MonsterAttribute.DEMON) ? 5 : 1;
      } else if (this.wearing('Arkan blade') && !this.isImmuneToNormalBurns()) {
        ret = 10;
      }
    }

    if (ret !== 0) {
      this.track(DetailKey.DOT_MAX, ret);
    }
    return ret;
  }

  public getMax(): number {
    return this.getDistribution().getMax() + this.getDoTMax();
  }

  public getExpectedDamage(): number {
    return this.getDistribution().getExpectedDamage() + this.getDoTExpected();
  }

  public getDistribution(): AttackDistribution {
    if (this.memoizedDist === undefined) {
      this.memoizedDist = this.getDistributionImpl();
      this.trackDist(DetailKey.DIST_FINAL, this.memoizedDist);
    }

    return this.memoizedDist;
  }

  private getDistributionImpl(): AttackDistribution {
    const attackerDist = this.getAttackerDist();

    let styleType = this.player.style.type;
    if (this.opts.isEcho) {
      styleType = 'ranged';
    } else if (this.opts.usingSpecialAttack && this.wearing('Voidwaker')) {
      styleType = 'magic';
    }

    let npcDist: AttackDistribution;
    if (this.wearing("King's barrage")) {
      npcDist = attackerDist.transform((h) => {
        const iceSplat = new Hitsplat(Math.trunc(h.damage / 2), h.accurate);
        const rangedSplat = new Hitsplat(h.damage - iceSplat.damage, h.accurate);

        const rangedDist = new HitDistribution([new WeightedHit(1.0, [rangedSplat])])
          .transform(this.applyNpcTransforms('ranged'));
        let iceDist = new HitDistribution([new WeightedHit(1.0, [iceSplat])])
          .transform(this.applyNpcTransforms('magic'));
        if (this.player.leagues.six.effects.talent_water_spell_damage_high_hp
            && this.player.leagues.six.effects.talent_ice_counts_as_water) {
          iceDist = iceDist.transform(this.leaguesWaterHpBonus());
        }
        return rangedDist.zip(iceDist);
      }, { transformInaccurate: true });
    } else {
      npcDist = attackerDist.transform(this.applyNpcTransforms(styleType));
    }

    if (!this.opts.isLeaguesSubCalc) {
      npcDist = this.applyLeaguesPostProcessing(npcDist);
    }

    if (process.env.NEXT_PUBLIC_HIT_DIST_SANITY_CHECK) {
      npcDist.dists.forEach((hitDist, ix) => {
        const sumAccuracy = sum(hitDist.hits, (wh) => wh.probability);
        const fractionalDamage = some(hitDist.hits, (wh) => some(wh.hitsplats, (h) => !Number.isInteger(h.damage)));
        if (Math.abs(sumAccuracy - 1.0) > 0.00001 || fractionalDamage) {
          console.warn(`Post-NPC hit dist [${this.opts.loadoutName}#${ix}] failed sanity check!`, { sumAccuracy, fractionalDamage, hitDist });
        }
      });
    }

    return npcDist;
  }

  private getAttackerDist(): AttackDistribution {
    const mattrs = this.monster.attributes;
    const acc = this.getHitChance();
    const [min, max] = this.getMinAndMax();
    const style = this.player.style.type;

    if (max === 0) {
      return new AttackDistribution([new HitDistribution([new WeightedHit(1.0, [Hitsplat.INACCURATE])])]);
    }

    const leagues = this.player.leagues.six;
    if (this.opts.isEcho) {
      const meleeEcho = this.isUsingMeleeStyle() && leagues.effects.talent_2h_melee_echos && this.player.equipment.weapon?.isTwoHanded;
      const isWearingThrown = meleeEcho || (this.player.equipment.weapon?.category === EquipmentCategory.THROWN || this.wearing('Eclipse atlatl'));
      let echoDist = HitDistribution.linear(acc, min, max);

      if (leagues.effects.talent_thrown_maxhit_echoes && isWearingThrown) {
        const effectChance = 0.2;
        echoDist = echoDist.scaleProbability(1 - effectChance);
        echoDist.addHit(new WeightedHit(effectChance * acc, [new Hitsplat(max)]));
        echoDist.addHit(new WeightedHit(effectChance * (1 - acc), [Hitsplat.INACCURATE]));
      }
      this.trackDist(DetailKey.DIST_LEAGUES_ECHO, echoDist);

      // echoes don't trigger any other effects, break early
      return new AttackDistribution([echoDist]);
    }

    // standard linear
    const standardHitDist = HitDistribution.linear(acc, min, max);
    let dist = new AttackDistribution([standardHitDist]);
    this.trackDist(DetailKey.DIST_BASE, dist);

    // Monsters that always die in one hit no matter what
    if (ONE_HIT_MONSTERS.includes(this.monster.id)) {
      return new AttackDistribution([
        HitDistribution.single(1.0, [new Hitsplat(this.monster.skills.hp)]),
      ]);
    }

    if (this.monster.name === 'Respiratory system' && this.isUsingDemonbane()) {
      return new AttackDistribution([
        HitDistribution.single(acc, [new Hitsplat(this.monster.skills.hp)]),
      ]);
    }

    if (leagues.effects.talent_crossbow_max_hit
        && this.player.equipment.weapon?.category === 'Crossbow') {
      dist = new AttackDistribution([HitDistribution.single(acc, [new Hitsplat(max)])]);
    }

    const spellement = this.getSpellement();
    if (leagues.effects.talent_air_spell_max_hit_prayer_bonus && this.player.bonuses.prayer > 0 && spellement === 'air') {
      const weakToAir = this.getMonsterWeakness()?.element === 'air';
      const effectChance = this.player.bonuses.prayer * (weakToAir ? 2 : 1) / 100;
      if (effectChance >= 1) {
        dist = new AttackDistribution([HitDistribution.single(acc, [new Hitsplat(max)])]);
      } else {
        const tmp = standardHitDist.scaleProbability(1 - effectChance);
        tmp.addHit(new WeightedHit(acc * effectChance, [new Hitsplat(max)]));
        tmp.addHit(new WeightedHit((1 - acc) * effectChance, [Hitsplat.INACCURATE]));
        dist = new AttackDistribution([tmp]);
      }
    }

    if (leagues.effects.talent_air_spell_damage_active_prayers && spellement === 'air') {
      const prayersActive = this.player.prayers.length;
      const bonusDamagePerPrayer = leagues.effects.talent_air_spell_damage_active_prayers;
      dist = dist.transform(multiplyTransformer(100 + (prayersActive * bonusDamagePerPrayer), 100));
      this.trackDist(DetailKey.DIST_LEAGUES_AIR_SPELL_PRAYER_COUNT, dist);
    }

    if (this.player.leagues.six.effects.talent_water_spell_damage_high_hp && spellement === 'water') {
      dist = dist.transform(this.leaguesWaterHpBonus());
      this.trackDist(DetailKey.DIST_LEAGUES_WATER_SPELL_DAMAGE_HIGH_HP, dist);
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

    if (style === 'ranged' && this.wearing('Dark bow')) {
      dist = new AttackDistribution([standardHitDist, standardHitDist]);
      if (this.opts.usingSpecialAttack) {
        dist = dist.transform(flatLimitTransformer(48, min));
      }
    }

    let accurateZeroApplicable: boolean = true;
    if (this.opts.usingSpecialAttack) {
      if (this.wearing('Dragon claws')) {
        accurateZeroApplicable = false;
        dist = dClawDist(acc, max);
      } else if (this.wearing(['Bone claws', 'Burning claws'])) {
        accurateZeroApplicable = false;
        dist = burningClawSpec(acc, max);
      }
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

    // simple multi-hit specs
    if (this.opts.usingSpecialAttack) {
      let hitCount = 1;
      if (this.wearing(['Dragon dagger', 'Dragon knife', 'Rosewood blowpipe']) || this.isWearingMsb()) {
        hitCount = 2;
      } else if (this.wearing('Webweaver bow')) {
        hitCount = 4;
      }

      if (hitCount !== 1) {
        dist = new AttackDistribution(Array(hitCount).fill(standardHitDist));
      }
    }

    if (this.opts.usingSpecialAttack && this.wearing('Abyssal dagger')) {
      const secondHit = HitDistribution.linear(1.0, min, max);
      dist = dist.transform((h) => new HitDistribution([new WeightedHit(1.0, [h])]).zip(secondHit), { transformInaccurate: false });
    }

    if (this.opts.usingSpecialAttack && this.wearing('Saradomin sword')) {
      const magicHit = HitDistribution.linear(1.0, 1, 16);
      dist = dist.transform(
        (h) => {
          if (h.accurate && !IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS.includes(this.monster.id)) {
            return new HitDistribution([new WeightedHit(1.0, [h])]).zip(magicHit);
          }
          return new HitDistribution([new WeightedHit(1.0, [h, Hitsplat.INACCURATE])]);
        },
      );
    }

    if (this.opts.usingSpecialAttack && this.wearing('Granite hammer')) {
      dist = dist.transform(flatAddTransformer(5), { transformInaccurate: true });
    }

    if (this.opts.usingSpecialAttack && this.wearing('Purging staff')) {
      // todo(wgs): does this require the correct runes or only the level of each demonbane spell?
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
        hits.push(HitDistribution.linear(acc, min, Math.max(min, splatMax)));
      }
      dist = new AttackDistribution(hits);
    }

    if (this.isUsingMeleeStyle() && this.wearing('Dual macuahuitl')) {
      const firstMax = Math.trunc(max / 2);
      const secondMax = max - firstMax;
      const firstHit = new AttackDistribution([HitDistribution.linear(acc, min, Math.max(min, firstMax))]);
      const secondHit = HitDistribution.linear(acc, min, Math.max(min, secondMax));
      dist = firstHit.transform(
        (h) => {
          if (h.accurate) {
            return new HitDistribution([new WeightedHit(1.0, [h])]).zip(secondHit);
          }
          return new HitDistribution([new WeightedHit(1.0, [h, Hitsplat.INACCURATE])]);
        },
      );
    }

    if (this.isUsingMeleeStyle() && this.isWearingTwoHitWeapon()) {
      const firstMax = Math.trunc(max / 2);
      const secondMax = max - firstMax;
      dist = new AttackDistribution([
        HitDistribution.linear(acc, min, Math.max(min, firstMax)),
        HitDistribution.linear(acc, min, Math.max(min, secondMax)),
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
      const demonbaneFactor = this.wearing('Purging staff') ? 50 : 25;
      dist = dist.transform(
        (h) => HitDistribution.single(1.0, [new Hitsplat(
          h.damage + Math.trunc(Math.trunc(h.damage * demonbaneFactor / 100) * this.demonbaneVulnerability() / 100),
          h.accurate,
        )]),
      );
    }

    if (this.player.style.type === 'magic' && this.isWearingAhrims()) {
      dist = dist.transform(
        (h) => new HitDistribution([
          new WeightedHit(0.75, [h]),
          new WeightedHit(0.25, [new Hitsplat(Math.trunc(h.damage * 13 / 10), h.accurate)]),
        ]),
      );
    }

    if (this.tdUnshieldedBonusApplies()) {
      const bonusDmg = Math.max(0, this.getAttackSpeed() ** 2 - 16);
      dist = dist.transform(
        flatAddTransformer(bonusDmg),
        { transformInaccurate: false },
      );
    }

    if (this.isUsingMeleeStyle() && this.isWearingDharok()) {
      const newMax = this.player.skills.hp;
      const curr = this.player.skills.hp + this.player.boosts.hp;
      dist = dist.scaleDamage(10000 + (newMax - curr) * newMax, 10000);
    }

    if (this.isUsingMeleeStyle() && this.isWearingBerserkerNecklace() && this.isWearingTzhaarWeapon()) {
      dist = dist.scaleDamage(6, 5);
    }

    // all this vampyre stuff was tested methodically by @jmyaeger, many thanks!
    // there is still a consideration that this behaviour may be unintentional,
    // but it has been in the game long enough that we are implementing it anyway
    if (isVampyre(mattrs)) {
      // efaritay's bonus only applies if we can deal uncapped damage
      const efaritay = this.wearing("Efaritay's aid");
      const doEfaritay = (d: AttackDistribution) => (efaritay ? d.scaleDamage(11, 10) : d);

      if (this.wearing('Blisterwood flail')) {
        dist = doEfaritay(dist);
        dist = dist.scaleDamage(5, 4);
      } else if (this.wearing('Blisterwood sickle')) {
        dist = doEfaritay(dist);
        dist = dist.scaleDamage(23, 20);
      } else if (this.wearing('Ivandis flail')) {
        dist = doEfaritay(dist);
        dist = dist.scaleDamage(6, 5);
      } else if (this.wearing('Rod of ivandis') && !mattrs.includes(MonsterAttribute.VAMPYRE_3)) {
        dist = doEfaritay(dist);
        dist = dist.scaleDamage(11, 10);
      } else if (this.isWearingSilverWeapon() && mattrs.includes(MonsterAttribute.VAMPYRE_1)) {
        dist = doEfaritay(dist);
        dist = dist.scaleDamage(11, 10);
      }
      // also relevant:
      // * half damage against t2 by non-ivandis weapons with efaritay's, in applyNpcTransforms
      // * no damage against t2 by non-ivandis weapons without efaritay's, in isImmune
      // * no damage against t3 by non-blisterwood weapons, in isImmune
    }

    // bolt effects
    const boltContext: BoltContext = {
      maxHit: max,
      alwaysMaxHit: isDefined(this.player.leagues.six.effects.talent_crossbow_max_hit),
      rangedLvl: this.player.skills.ranged + this.player.boosts.ranged,
      zcb: this.wearing('Zaryte crossbow'),
      spec: this.opts.usingSpecialAttack,
      kandarinDiary: this.player.buffs.kandarinDiary,
      monster: this.monster,
    };
    if (this.player.style.type === 'ranged' && this.player.equipment.weapon?.name.includes('rossbow')) {
      if (this.wearing(['Opal bolts (e)', 'Opal dragon bolts (e)'])) {
        dist = dist.transform(opalBolts(boltContext));
      } else if (this.wearing(['Pearl bolts (e)', 'Pearl dragon bolts (e)'])) {
        dist = dist.transform(pearlBolts(boltContext));
      } else if (this.wearing(['Diamond bolts (e)', 'Diamond dragon bolts (e)'])) {
        dist = dist.transform(diamondBolts(boltContext));
      } else if (this.wearing(['Dragonstone bolts (e)', 'Dragonstone dragon bolts (e)'])) {
        dist = dist.transform(dragonstoneBolts(boltContext));
      } else if (this.wearing(['Onyx bolts (e)', 'Onyx dragon bolts (e)']) && !mattrs.includes(MonsterAttribute.UNDEAD)) {
        dist = dist.transform(onyxBolts(boltContext));
      }
    }

    if (this.player.spell && this.player.spell.max_hit === 0) {
      // don't raise things like bind
      accurateZeroApplicable = false;
    }

    if (leagues.effects.talent_earth_scale_defence_stat && spellement === 'earth') {
      const defenceLevel = this.player.skills.def + this.player.boosts.def;
      const bonusDamage = this.trackFactor(DetailKey.LEAGUES_EARTH_SPELL_DEFENCE_BONUS, defenceLevel, [1, 12]);
      dist = dist.transform(flatAddTransformer(bonusDamage), { transformInaccurate: false });
    }

    if (leagues.effects.talent_light_weapon_doublehit
      && this.isUsingMeleeStyle()
      && !this.opts.usingSpecialAttack
      && (this.player.equipment.weapon?.weight ?? Infinity) < 1) {
      const lightMax = this.trackFactor(DetailKey.LEAGUES_LIGHT_WEAPON_DOUBLEHIT_MAX, max, [4, 10]);
      const lightDist = HitDistribution.linear(acc, Math.min(min, lightMax), lightMax);
      dist.addDist(lightDist);
    }

    if (leagues.effects.talent_firerune_regen_damage_boost) {
      const regeneratingWithStaff = this.player.equipment.weapon?.category === EquipmentCategory.POWERED_STAFF
        && this.player.style.stance !== 'Manual Cast'
        && leagues.effects.talent_regen_stave_charges_fire;
      let fireRunesUsed = 0;
      if (this.player.spell) {
        fireRunesUsed = COMBAT_SPELL_FIRE_RUNE_COST[this.player.spell.name] ?? 0;
      } else if (regeneratingWithStaff) {
        fireRunesUsed = 1;
      }

      let regenChance = (leagues.effects.talent_regen_ammo ?? 0) / 100;
      if (fireRunesUsed > 0 && regenChance > 0) {
        let alwaysRegenerated = 0;
        while (regenChance > 1) {
          alwaysRegenerated += fireRunesUsed;
          regenChance -= 1;
        }
        dist = dist.transform((h) => new HitDistribution([
          new WeightedHit(regenChance, [new Hitsplat(h.damage + alwaysRegenerated + fireRunesUsed)]),
          new WeightedHit(1.0 - regenChance, [new Hitsplat(h.damage + alwaysRegenerated)]),
        ]), { transformInaccurate: false });
      }
    }

    // raise accurate 0s to 1
    if (accurateZeroApplicable) {
      dist = dist.transform(
        (h) => HitDistribution.single(1.0, [new Hitsplat(Math.max(h.damage, 1))]),
        { transformInaccurate: false },
      );
    }

    if (this.player.style.type === 'magic' && this.player.spell?.spellbook === 'standard') {
      const twinflameCompat = ['Bolt', 'Blast', 'Wave'].some((spellClass) => this.player.spell?.name.includes(spellClass) ?? false);
      const shadowflameCompat = this.player.spell.element;
      if ((this.wearing('Twinflame staff') && twinflameCompat) || (this.wearing('Shadowflame quadrant') && shadowflameCompat)) {
        dist = dist.transform(
          (h) => HitDistribution.single(1.0, [
            new Hitsplat(h.damage),
            new Hitsplat(Math.trunc(h.damage * 4 / 10)),
          ]),
        );
      }
    }

    // we apply corp earlier than other limiters,
    // and rubies later than other bolts,
    // since corp takes full ruby bolt effect damage but reduced damage from bolts otherwise
    if (this.monster.name === 'Corporeal Beast' && !this.isWearingCorpbaneWeapon()) {
      dist = dist.transform(divisionTransformer(2));
    }

    if (this.player.style.type === 'ranged'
      && (this.player.equipment.weapon?.name.includes('rossbow') || this.wearing("King's barrage"))) {
      const currentHp = this.player.skills.hp + this.player.boosts.hp;
      if (this.wearing(['Ruby bolts (e)', 'Ruby dragon bolts (e)']) && currentHp >= 10) {
        dist = dist.transform(rubyBolts(boltContext));
      }
    }

    if (this.player.style.type === 'magic' && this.wearing('Brimstone ring') && !this.opts.overrides.defenceRoll) {
      const effectChance = 0.25;
      const effectDef = this.trackFactor(DetailKey.NPC_DEFENCE_BRIMSTONE, this.getNPCDefenceRoll(), [9, 10]);
      const effectDist = this.noInitSubCalc(this.player, this.monster, {
        loadoutName: `${this.opts.loadoutName}/brimstone`,
        overrides: {
          defenceRoll: effectDef,
        },
      }).getAttackerDist();

      const zippedDists = [];
      for (let i = 0; i < dist.dists.length; i++) {
        zippedDists.push(
          new HitDistribution([
            ...dist.dists[i]
              .scaleProbability(1 - effectChance)
              .hits,
            ...effectDist.dists[i]
              .scaleProbability(effectChance)
              .hits,
          ]),
        );
      }
      dist = new AttackDistribution(zippedDists).flatten();
    }

    // monsters that are always max hit no matter what
    if ((this.player.style.type === 'magic' && ALWAYS_MAX_HIT_MONSTERS.magic.includes(this.monster.id))
          || (this.isUsingMeleeStyle() && ALWAYS_MAX_HIT_MONSTERS.melee.includes(this.monster.id))
          || (this.player.style.type === 'ranged' && ALWAYS_MAX_HIT_MONSTERS.ranged.includes(this.monster.id))) {
      if (YAMA_VOID_FLARE_IDS.includes(this.monster.id) && this.player.buffs.markOfDarknessSpell && this.player.spell?.name.includes('Demonbane')) {
        const demonbaneFactor = this.wearing('Purging staff') ? 50 : 25;
        return new AttackDistribution([HitDistribution.single(1.0, [new Hitsplat(max + Math.trunc(Math.trunc(max * demonbaneFactor / 100) * this.demonbaneVulnerability() / 100))])]);
      }

      return new AttackDistribution([HitDistribution.single(1.0, [new Hitsplat(dist.getMax())])]);
    }

    if (process.env.NEXT_PUBLIC_HIT_DIST_SANITY_CHECK) {
      dist.dists.forEach((hitDist, ix) => {
        const sumAccuracy = sum(hitDist.hits, (wh) => wh.probability);
        const fractionalDamage = some(hitDist.hits, (wh) => some(wh.hitsplats, (h) => !Number.isInteger(h.damage)));
        if (Math.abs(sumAccuracy - 1.0) > 0.00001 || fractionalDamage) {
          console.warn(`Hit dist [${this.opts.loadoutName}#${ix}] failed sanity check!`, { sumAccuracy, fractionalDamage, hitDist });
        }
      });
    }

    return dist;
  }

  private npcTransformCache: { [k in Exclude<CombatStyleType, null>]?: HitTransformer } = {};

  applyNpcTransforms(styleType: CombatStyleType): HitTransformer {
    const cached = this.npcTransformCache[styleType!];
    if (cached) {
      return cached;
    }

    if (this.isImmune(styleType)) {
      this.npcTransformCache[styleType!] = () => HitDistribution.single(1.0, [Hitsplat.INACCURATE]);
      return this.npcTransformCache[styleType!]!;
    }

    const mattrs = this.monster.attributes;
    const relevantEffects: ([HitTransformer] | [HitTransformer, TransformOpts])[] = [];

    if (this.monster.name === 'Zulrah' && this.player.leagues.six.selectedNodeIds.size <= 1) {
      // https://twitter.com/JagexAsh/status/1745852774607183888
      relevantEffects.push([cappedRerollTransformer(50, 5, 45)]);
    }
    if (this.monster.name === 'Fragment of Seren') {
      // https://twitter.com/JagexAsh/status/1375037874559721474
      relevantEffects.push([linearMinTransformer(2, 22)]);
    }
    if (['Kraken', 'Cave kraken'].includes(this.monster.name) && styleType === 'ranged') {
      // https://twitter.com/JagexAsh/status/1699360516488011950
      relevantEffects.push([divisionTransformer(7, 1)]);
    }
    if (VERZIK_P1_IDS.includes(this.monster.id) && !this.wearing('Dawnbringer')) {
      const limit = this.isUsingMeleeStyle() ? 10 : 3;
      relevantEffects.push([linearMinTransformer(limit)]);
    }
    if (TEKTON_IDS.includes(this.monster.id) && styleType === 'magic') {
      relevantEffects.push([divisionTransformer(5, 1)]);
    }
    if (GLOWING_CRYSTAL_IDS.includes(this.monster.id) && styleType === 'magic') {
      relevantEffects.push([divisionTransformer(3)]);
    }
    if ((OLM_MELEE_HAND_IDS.includes(this.monster.id) || OLM_HEAD_IDS.includes(this.monster.id)) && styleType === 'magic') {
      relevantEffects.push([divisionTransformer(3)]);
    }
    if ((OLM_MAGE_HAND_IDS.includes(this.monster.id) || OLM_MELEE_HAND_IDS.includes(this.monster.id)) && styleType === 'ranged') {
      relevantEffects.push([divisionTransformer(3)]);
    }
    if (ICE_DEMON_IDS.includes(this.monster.id) && this.getSpellement() !== 'fire' && !this.isUsingDemonbane()) {
      // https://twitter.com/JagexAsh/status/1133350436554121216
      relevantEffects.push([divisionTransformer(3)]);
    }
    if (this.monster.name === 'Slagilith' && this.player.equipment.weapon?.category !== EquipmentCategory.PICKAXE) {
      // https://twitter.com/JagexAsh/status/1219652159148646401
      relevantEffects.push([divisionTransformer(3)]);
    }
    if (NIGHTMARE_TOTEM_IDS.includes(this.monster.id) && styleType === 'magic') {
      relevantEffects.push([multiplyTransformer(2)]);
    }
    if (['Slash Bash', 'Zogre', 'Skogre'].includes(this.monster.name)) {
      if (this.player.spell?.name === 'Crumble Undead') {
        relevantEffects.push([divisionTransformer(2)]);
      } else if (this.player.style.type !== 'ranged'
        || !this.player.equipment.ammo?.name.includes(' brutal')
        || this.player.equipment.weapon?.name !== 'Comp ogre bow') {
        relevantEffects.push([divisionTransformer(4)]);
      }
    }
    if (BA_ATTACKER_MONSTERS.includes(this.monster.id) && this.player.buffs.baAttackerLevel !== 0) {
      // todo is this pre- or post-roll?
      relevantEffects.push([flatAddTransformer(this.player.buffs.baAttackerLevel), { transformInaccurate: true }]);
    }
    if (this.monster.name === 'Tormented Demon') {
      if (this.monster.inputs.phase !== 'Unshielded' && !this.isUsingDemonbane() && !this.isUsingAbyssal()) {
        // 20% damage reduction when not using demonbane or abyssal
        // todo floor of 1?
        relevantEffects.push([multiplyTransformer(4, 5, 1)]);
      }
    }
    if (mattrs.includes(MonsterAttribute.VAMPYRE_2)) {
      if (!this.wearingVampyrebane(MonsterAttribute.VAMPYRE_2) && this.wearing("Efaritay's aid")) {
        relevantEffects.push([divisionTransformer(2)]);
      } else if (this.isWearingSilverWeapon()) {
        relevantEffects.push([flatLimitTransformer(10)]);
      }
    }
    if (HUEYCOATL_TAIL_IDS.includes(this.monster.id)) {
      const crush = styleType === 'crush'
        && this.player.offensive.crush > this.player.offensive.slash
        && this.player.offensive.crush > this.player.offensive.stab;
      const earth = this.getSpellement() === 'earth';

      // crush and earth spells have a higher limiter
      relevantEffects.push([linearMinTransformer((crush || earth) ? 9 : 4)]);

      // and crush also gets misses turned into 1s
      if (crush) {
        relevantEffects.push([(h) => {
          if (h.damage > 0) {
            return HitDistribution.single(1.0, [h]);
          }
          return HitDistribution.single(1.0, [new Hitsplat(1)]);
        }]);
      }
    }
    if (HUEYCOATL_PHASE_IDS.includes(this.monster.id) && this.monster.inputs.phase === 'With Pillar') {
      relevantEffects.push([multiplyTransformer(13, 10)]);
    }

    if (ABYSSAL_SIRE_TRANSITION_IDS.includes(this.monster.id) && this.monster.inputs.phase === 'Transition') {
      relevantEffects.push([divisionTransformer(2)]);
    }

    const flatArmour = this.monster.defensive.flat_armour;
    if (flatArmour && styleType !== 'magic') {
      relevantEffects.push([flatAddTransformer(-flatArmour), { transformInaccurate: false }]);
    }

    const transformer: HitTransformer = (hitsplat) => {
      let dist = HitDistribution.single(1.0, [hitsplat]);
      for (const t of relevantEffects) {
        dist = dist.wideTransform(t[0], t.length > 1 ? t[1] : DEFAULT_TRANSFORM_OPTS);
      }

      return dist.flatten();
    };
    this.npcTransformCache[styleType!] = transformer;
    return transformer;
  }

  isImmune(styleType: CombatStyleType): boolean {
    const monsterId = this.monster.id;
    const mattrs = this.monster.attributes;

    if (IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS.includes(monsterId) && styleType === 'magic') {
      return true;
    }
    if (IMMUNE_TO_RANGED_DAMAGE_NPC_IDS.includes(monsterId) && styleType === 'ranged') {
      return true;
    }
    if (IMMUNE_TO_MELEE_DAMAGE_NPC_IDS.includes(monsterId) && this.isUsingMeleeStyle()) {
      if (ZULRAH_IDS.includes(monsterId) && this.player.equipment.weapon?.category === EquipmentCategory.POLEARM) return false;
      if (this.player.leagues.six.effects.talent_melee_range_multiplier && this.player.equipment.weapon?.isTwoHanded === true) return false;
      return true;
    }
    if (mattrs.includes(MonsterAttribute.FLYING) && this.isUsingMeleeStyle()) {
      if (this.player.leagues.six.effects.talent_melee_range_multiplier && this.player.equipment.weapon?.isTwoHanded === true) return false;
      // Vespula is immune to melee despite flying attribute.
      if (VESPULA_IDS.includes(this.monster.id)) return true;
      if (this.player.equipment.weapon?.category === EquipmentCategory.POLEARM || this.player.equipment.weapon?.category === EquipmentCategory.SALAMANDER) return false;
      return true;
    }
    if (IMMUNE_TO_NON_SALAMANDER_MELEE_DAMAGE_NPC_IDS.includes(monsterId)
      && this.isUsingMeleeStyle()
      && this.player.equipment.weapon?.category !== EquipmentCategory.SALAMANDER) {
      return true;
    }
    if (mattrs.includes(MonsterAttribute.VAMPYRE_3) && !this.wearingVampyrebane(MonsterAttribute.VAMPYRE_3)) {
      return true;
    }
    if (mattrs.includes(MonsterAttribute.VAMPYRE_2) && !this.wearingVampyrebane(MonsterAttribute.VAMPYRE_2) && !this.wearing("Efaritay's aid") && !this.isWearingSilverWeapon()) {
      return true;
    }
    if (GUARDIAN_IDS.includes(monsterId) && (!this.isUsingMeleeStyle() || this.player.equipment.weapon?.category !== EquipmentCategory.PICKAXE)) {
      return true;
    }
    if (mattrs.includes(MonsterAttribute.LEAFY) && !this.isWearingLeafBladedWeapon()) {
      return true;
    }
    if (DOOM_OF_MOKHAIOTL_IDS.includes(monsterId) && this.monster.inputs.phase === 'Shielded' && !this.isUsingDemonbane()) {
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
      if (styleType === 'magic' && this.getSpellement() !== 'water'
        || (styleType === 'ranged' && !this.player.equipment.ammo?.name?.includes('arrow'))) {
        return true;
      }
    }
    // Eclipse moon clone is immune to non-melee attacks
    if (ECLIPSE_MOON_IDS.includes(this.monster.id) && this.monster.version === 'Clone' && !this.isUsingMeleeStyle()) {
      return true;
    }

    return false;
  }

  private applyLeaguesPostProcessing(npcDist: AttackDistribution): AttackDistribution {
    const acc = this.getHitChance();
    const [min, max] = this.getMinAndMax();

    const leagues = this.player.leagues.six;
    const blindbagUniques = this.getBlindbagUniques();
    if (leagues.effects.talent_free_random_weapon_attack_chance
      && this.isUsingMeleeStyle()
      && !this.opts.usingSpecialAttack
      && blindbagUniques >= 1
      && (this.player.equipment.weapon?.weight ?? 0) >= 1) {
      let chanceBlindbagProc = leagues.effects.talent_free_random_weapon_attack_chance / 100;
      if (leagues.effects.talent_unique_blindbag_chance) {
        chanceBlindbagProc += (0.02 * blindbagUniques);
      }

      let blindbagDist = new HitDistribution([new WeightedHit(1 - chanceBlindbagProc, [Hitsplat.INACCURATE])]);
      const partialDists = leagues.blindbagWeapons.map((weapon) => {
        const chanceThisWeapon = 1 / leagues.blindbagWeapons.length;
        let playerWithWeapon = <Player>{
          ...this.player,
          equipment: {
            ...this.player.equipment,
            weapon: getCanonicalItem(weapon),
          },
          style: getCombatStylesForCategory(weapon.category)[0], // todo use same slot as equipped?
        };
        playerWithWeapon = {
          ...playerWithWeapon,
          ...calculateEquipmentBonusesFromGear(playerWithWeapon, this.monster),
        };

        const subCalc = this.noInitSubCalc(playerWithWeapon, this.monster, {
          loadoutName: `${this.opts.loadoutName}/Blindbag ${weapon.id} (${weapon.name})`,
          isBlindBag: true,
          blindBagDistance: this.getDistanceToEnemy(),
          blindBagUniques: blindbagUniques,
          isLeaguesSubCalc: true,
        });

        return subCalc.getDistribution()
          .singleHitsplat
          .scaleProbability(chanceBlindbagProc * chanceThisWeapon)
          .hits;
      });
      partialDists.forEach((partial) => blindbagDist.addHits(partial));
      blindbagDist = blindbagDist.cumulative();
      this.trackDist(DetailKey.DIST_LEAGUES_BLINDBAG, blindbagDist);

      let recursiveBlindBag = blindbagDist;
      for (let i = 1; i <= 3; i++) {
        const thisRecurse = blindbagDist.scaleProbability(chanceBlindbagProc ** i);
        thisRecurse.addHit(new WeightedHit(1 - (chanceBlindbagProc ** i), [Hitsplat.INACCURATE]));
        recursiveBlindBag = recursiveBlindBag.zip(thisRecurse);
        recursiveBlindBag = recursiveBlindBag.cumulative();
      }
      this.trackDist(DetailKey.DIST_LEAGUES_BLINDBAG_RECURSIVE, recursiveBlindBag);

      npcDist.addDist(recursiveBlindBag);
    }

    const rangedEcho = this.player.style.type === 'ranged' && leagues.effects.talent_ranged_regen_echo_chance;
    const meleeEcho = this.isUsingMeleeStyle() && leagues.effects.talent_2h_melee_echos && this.player.equipment.weapon?.isTwoHanded;
    if (rangedEcho || meleeEcho) {
      const isWearingBow = meleeEcho || (this.player.equipment.weapon?.category === EquipmentCategory.BOW && !this.wearing('Eclipse atlatl'));
      const isWearingCrossbow = meleeEcho || this.player.equipment.weapon?.category === EquipmentCategory.CROSSBOW;

      const regenChance = this.track(DetailKey.LEAGUES_ECHO_CHANCE_REGEN, meleeEcho ? acc : (leagues.effects.talent_regen_ammo ?? 0) / 100);
      let echoChance = meleeEcho ? 0.05 : (leagues.effects.talent_ranged_regen_echo_chance! / 100);
      if (leagues.effects.talent_crossbow_echo_reproc_chance && isWearingCrossbow) {
        echoChance += leagues.effects.talent_crossbow_echo_reproc_chance / 100;
      }
      this.track(DetailKey.LEAGUES_ECHO_CHANCE_TRIGGER, echoChance);

      const alwaysAccurate = leagues.effects.talent_bow_always_pass_accuracy && isWearingBow;
      const echoAcc = this.track(DetailKey.LEAGUES_ECHO_ACCURACY, alwaysAccurate ? 1 : acc);

      const echoSubCalc = this.noInitSubCalc(
        {
          ...this.player,
        },
        this.monster,
        {
          loadoutName: `${this.opts.loadoutName}/Echo`,
          isLeaguesSubCalc: true,
          isEcho: true,
          overrides: { accuracy: echoAcc, maxHit: [min, max] },
        },
      );
      let echoDist = this.trackDist(DetailKey.DIST_LEAGUES_ECHO, echoSubCalc.getDistribution().dists[0]);

      const combinedEchoHappeningChance = echoChance * regenChance;
      echoDist = echoDist.scaleProbability(combinedEchoHappeningChance);
      echoDist.addHit(new WeightedHit(1 - combinedEchoHappeningChance, [Hitsplat.INACCURATE]));
      npcDist.addDist(echoDist);

      if (leagues.effects.talent_ranged_echo_cyclical) {
        const cyclicChance = this.track(DetailKey.LEAGUES_ECHO_CHANCE_CYCLICAL, echoChance / 2);
        const echoDistCyclical = echoDist.scaleProbability(cyclicChance);
        echoDistCyclical.addHit(new WeightedHit(1 - cyclicChance, [Hitsplat.INACCURATE]));
        this.trackDist(DetailKey.DIST_LEAGUES_ECHO_CYCLICAL, echoDistCyclical);

        npcDist.addDist(echoDistCyclical);
        npcDist.addDist(echoDistCyclical);
        npcDist.addDist(echoDistCyclical);
      }
    }

    if (this.wearing('Fang of the hound') && this.isUsingMeleeStyle()) {
      const flamesOfCerberusDist = this.noInitSubCalc(
        {
          ...this.player,
          spell: spellByName('Flames of Cerberus'),
          style: { name: 'Spell', type: 'magic', stance: 'Autocast' },
        },
        this.monster,
        {
          loadoutName: `${this.opts.loadoutName}/Flames of Cerberus`,
          isLeaguesSubCalc: true,
          overrides: { accuracy: 1.0 },
        },
      ).getDistribution().dists[0];
      this.trackDist(DetailKey.DIST_LEAGUES_FLAMES_OF_CERBERUS, flamesOfCerberusDist);

      let procDist = flamesOfCerberusDist;
      if (!this.opts.usingSpecialAttack) {
        procDist = flamesOfCerberusDist.scaleProbability(0.05);
        procDist.addHit(new WeightedHit(0.95, [Hitsplat.INACCURATE]));
      }
      npcDist = npcDist.transform(
        (h) => HitDistribution.single(1.0, [h]).zip(procDist),
        { transformInaccurate: false },
      );
    }

    return npcDist;
  }

  /**
   * Returns the player's attack speed.
   */
  public getAttackSpeed(): number {
    return this.player.attackSpeed
      ?? calculateAttackSpeed(this.player, this.monster);
  }

  public getExpectedAttackSpeed() {
    if (this.isWearingBloodMoonSet()) {
      const acc = this.getHitChance();
      const procChance = this.opts.usingSpecialAttack
        ? 1 - ((1 - acc) ** 2) // always if hit
        : (acc / 3) + ((acc * acc) * 2 / 9); // 1/3 per hit;
      return this.getAttackSpeed() - procChance;
    }

    if (this.tdUnshieldedBonusApplies()) {
      return this.getAttackSpeed() - 1;
    }

    if (this.opts.usingSpecialAttack && this.wearing('Eye of ayak')) {
      return 5;
    }

    return this.getAttackSpeed();
  }

  /**
   * Returns the expected damage per tick, based on the player's attack speed.
   */
  public getDpt() {
    return this.getExpectedDamage() / this.getExpectedAttackSpeed();
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
        if (p) {
          val += p.value * htk[hp - hit];
        }
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
    if (this.wearing('Soulreaper axe')) {
      // assumes using spec every time you reach the current stack count
      const ticksPerSpec = this.getAttackSpeed() * this.player.buffs.soulreaperStacks;
      return this.getDps() * this.getExpectedAttackSpeed() / ticksPerSpec;
    }

    const specCost = this.getSpecCost();
    if (!specCost) {
      console.warn(`Expected spec cost for weapon [${this.player.equipment.weapon?.name}] but was not provided`);
      return 0;
    }

    const ticksToRegen = this.wearing('Lightbearer') ? 25 : 50;
    const ticksPerSpec = specCost * (ticksToRegen / 10);
    return this.getDps() * this.getExpectedAttackSpeed() / ticksPerSpec;
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
      .singleHitsplat
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
    tickHps[1][this.monster.inputs.monsterCurrentHp || this.monster.skills.hp] = 1.0;

    // output map, will be converted at the end
    const ttks = new Map<number, number>();

    // sum of non-zero-health probabilities
    let epsilon = 1.0;

    // if the hit dist depends on hp, we'll have to recalculate it each time, so cache the results to not repeat work
    const recalcDistOnHp = this.distIsCurrentHpDependent(this.player, this.monster);
    const hpHitDists = new Array<DelayedHit[]>(this.monster.skills.hp + 1);
    hpHitDists[this.monster.skills.hp] = playerDist;
    if (recalcDistOnHp) {
      for (let hp = 0; hp <= this.monster.skills.hp; hp++) {
        hpHitDists[hp] = this.distAtHp(playerDist, hp);
      }
    }

    // todo dp backwards from 0 hp?
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

    if (!this.distIsCurrentHpDependent(this.player, this.monster) || hp === this.monster.inputs.monsterCurrentHp) {
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

    // similarly, only recompute the dist for the yellow keris below 25% hp
    if (this.wearing('Keris partisan of the sun')
      && TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id)
      && hp >= Math.trunc(this.monster.skills.hp / 4)) {
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
    if (!opts.isBlindBag) {
      subCalc.allEquippedItems = this.allEquippedItems;
    }
    subCalc.baseMonster = this.baseMonster;

    return subCalc;
  }

  /**
   * @param weaponDemonbane as a percent out of 100
   */
  demonbaneFactor(weaponDemonbane: number): Factor {
    const vulnerability = this.monster.inputs.demonbaneVulnerability ?? 100;
    const percent = this.trackFactor(DetailKey.PLAYER_DEMONBANE_FACTOR, weaponDemonbane, [vulnerability, 100]);
    return [percent, 100];
  }

  public distIsCurrentHpDependent(loadout: Player, monster: Monster): boolean {
    if (monster.name === 'Vardorvis') {
      return true;
    }
    if (loadout.equipment.weapon?.name.includes('rossbow') && this.wearing(['Ruby bolts (e)', 'Ruby dragon bolts (e)'])) {
      return true;
    }
    if (this.wearing('Keris partisan of the sun') && TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id)) {
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

    if (this.wearing('Dual macuahuitl') && !this.isWearingBloodMoonSet()) {
      return FeatureStatus.NOT_APPLICABLE;
    }
    if (this.wearing('Soulreaper axe')) {
      return this.player.buffs.soulreaperStacks === 0
        ? FeatureStatus.NOT_APPLICABLE
        : FeatureStatus.IMPLEMENTED;
    }
    if (this.wearing('Brine sabre')) {
      return UNDERWATER_MONSTERS.includes(this.monster.id)
        ? FeatureStatus.IMPLEMENTED
        : FeatureStatus.NOT_APPLICABLE;
    }

    if (PARTIALLY_IMPLEMENTED_SPECS.includes(weaponName)) {
      return FeatureStatus.PARTIALLY_IMPLEMENTED;
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
          loadoutName: `${this.opts.loadoutName}/spec`,
          usingSpecialAttack: true,
        });

      default:
        return null;
    }
  }

  private applyP2WardensDamageModifier([, max]: MinMax): MinMax {
    // 1/3 of enemy defence is removed from accuracy
    const reducedNpcDefence = Math.trunc(this.getNPCDefenceRoll() / 3);
    const accuracyDelta = this.track(
      DetailKey.WARDENS_ACCURACY_DELTA,
      Math.max(this.getMaxAttackRoll() - reducedNpcDefence, 0),
    );

    // remaining accuracy provides a % dmg modifier from 15% - 40% based on lerp from 0 to 42k MAR
    const modifier = this.track(
      DetailKey.WARDENS_DMG_MODIFIER,
      Math.max(Math.min(iLerp(15, 40, 0, 42_000, accuracyDelta), 40), 15),
    );

    const maxPctRange = 20;
    return [
      // these apply the % separately
      // in effect, we're dealing between [15-35, 40-60]% of normal damage
      this.track(DetailKey.MIN_HIT_WARDENS, Math.trunc(max * modifier / 100)),
      this.track(DetailKey.MAX_HIT_WARDENS, Math.trunc(max * (modifier + maxPctRange) / 100)),
    ];
  }

  private getSpellement(): Spellement | null {
    const spell = this.player.spell;
    if (!spell) return null;

    const { effects } = this.player.leagues.six;
    if (spell.name.includes('Smoke') && effects.talent_smoke_counts_as_air) {
      return 'air';
    }
    if (spell.name.includes('Ice') && effects.talent_ice_counts_as_water) {
      return 'water';
    }
    if (spell.name.includes('Shadow') && effects.talent_shadow_counts_as_earth) {
      return 'earth';
    }
    if (spell.name.includes('Blood') && effects.talent_blood_counts_as_fire) {
      return 'fire';
    }

    return spell?.element;
  }

  private getBlindbagUniques(): number {
    if (this.opts.isBlindBag) {
      return this.opts.blindBagUniques;
    }

    const uniqueIds = new Set(this.player.leagues.six.blindbagWeapons.map((eq) => eq.id)).size;
    return Math.min(uniqueIds, 5);
  }

  private getMaxMeleeRange(): number {
    const effects = this.player.leagues.six.effects;
    const halberd = this.player.equipment.weapon?.category === EquipmentCategory.POLEARM;
    let attackRange = halberd ? 2 : 1;
    if (effects.talent_melee_range_multiplier && this.player.equipment.weapon?.isTwoHanded) {
      attackRange *= 2;
    }
    if (effects.talent_melee_range_conditional_boost && attackRange >= 4) {
      attackRange = 7;
    }
    return attackRange;
  }

  private getDistanceToEnemy(): number {
    if (this.opts.isBlindBag) {
      // Blindbag hits copy the distance from the main hit.
      return this.opts.blindBagDistance;
    }

    let distance = this.player.leagues.six.distanceToEnemy;
    if (this.isUsingMeleeStyle()) {
      distance = Math.min(distance, this.getMaxMeleeRange());
    }
    return distance;
  }

  private getMonsterWeakness(): Monster['weakness'] {
    // shadowflame quadrant effectively switches an existing weakness to be whatever we're casting
    // devil's element gives 30% whether we're converting or not
    // we can get the same result by always forcing the element to be the current spell if we have either
    // and then if we have shadowflame, add in the existing weakness
    const spellement = this.getSpellement();
    const baseWeakness = this.monster.weakness;
    if (!spellement) {
      return null;
    }

    const shadowflame = this.wearing('Shadowflame quadrant');
    const devils = this.wearing("Devil's element");
    if (!shadowflame && !devils) {
      return baseWeakness;
    }

    const usingRightSpell = shadowflame || baseWeakness?.element === spellement;
    const baseSeverity = (baseWeakness && usingRightSpell) ? baseWeakness.severity : 0;
    const devilsBonus = devils ? 30 : 0;
    return { element: spellement, severity: baseSeverity + devilsBonus };
  }

  private leaguesWaterHpBonus(): HitTransformer {
    const maxHp = this.player.skills.hp;
    const currentHp = this.player.skills.hp + this.player.boosts.hp;

    // intentionally not capping to maxHp here as it functions on overheal
    const damageBonusPct = Math.trunc(20 * currentHp / maxHp);
    return multiplyTransformer(100 + damageBonusPct, 100);
  }
}
