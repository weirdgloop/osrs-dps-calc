import { EquipmentPiece, Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import {
  AttackDistribution,
  cappedRerollTransformer,
  divisionTransformer,
  flatLimitTransformer,
  HitDistribution,
  linearMinTransformer,
  multiplyTransformer,
  WeightedHit,
} from '@/lib/HitDist';
import { isBindSpell, isFireSpell, isWaterSpell } from '@/types/Spell';
import { PrayerData, PrayerMap } from '@/enums/Prayer';
import { isVampyre, MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  GLOWING_CRYSTAL_IDS,
  GUARDIAN_IDS,
  IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS,
  IMMUNE_TO_MELEE_DAMAGE_NPC_IDS,
  IMMUNE_TO_NON_SALAMANDER_MELEE_DAMAGE_NPC_IDS,
  IMMUNE_TO_RANGED_DAMAGE_NPC_IDS,
  OLM_HEAD_IDS,
  OLM_MAGE_HAND_IDS,
  OLM_MELEE_HAND_IDS,
  TEKTON_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS,
  VERZIK_P1_IDS,
} from '@/lib/constants';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { scaledMonster } from '@/lib/MonsterScaling';
import { CombatStyleStance } from '@/types/PlayerCombatStyle';
import { CalcDetails, DetailEntry, DetailKey } from '@/lib/CalcDetails';
import { Factor } from '@/lib/Math';
import {
  AmmoApplicability,
  ammoApplicability,
  getCanonicalItem,
} from '@/lib/Equipment';
import { UserIssue } from '@/types/State';
import UserIssueType from '@/enums/UserIssueType';
import { keys } from '@/utils';

const DEFAULT_ATTACK_SPEED = 4;
const SECONDS_PER_TICK = 0.6;

const TTK_DIST_MAX_ITER_ROUNDS = 1000;
const TTK_DIST_EPSILON = 0.0001;

const AUTOCAST_STANCES: CombatStyleStance[] = ['Autocast', 'Defensive Autocast'];
const CAST_STANCES: CombatStyleStance[] = [...AUTOCAST_STANCES, 'Manual Cast'];

const ONE_HIT_MONSTERS: number[] = [
  7223, // Giant rat (Scurrius)
  8584, // Flower
  11193, // Flower (A Night at the Theatre)
];

export interface CalcOpts {
  loadoutName: string,
  detailedOutput: boolean,
  overrides?: {
    accuracy?: number,
    attackRoll?: number,
    defenceRoll?: number,
  },
}

const DEFAULT_OPTS: CalcOpts = {
  loadoutName: 'unknown',
  detailedOutput: false,
};

export default class CombatCalc {
  private player: Player;

  private monster: Monster;

  private opts: CalcOpts;

  // Array of the names of all equipped items (for quick checks)
  private allEquippedItems: string[];

  private memoizedDist?: AttackDistribution;

  private _details?: CalcDetails;

  public userIssues: UserIssue[] = [];

  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    this.player = player;
    this.monster = monster;
    this.opts = {
      ...DEFAULT_OPTS,
      ...opts,
    };

    if (this.opts.detailedOutput) {
      this._details = new CalcDetails();
    }

    this.canonicalizeEquipment();
    this.allEquippedItems = Object.values(this.player.equipment).filter((v) => v !== null).flat(1).map((eq: EquipmentPiece | null) => eq?.name || '');
    this.sanitizeInputs();
  }

  private canonicalizeEquipment() {
    // canonicalize equipment ids
    const inputEq = this.player.equipment;
    let canonicalized = inputEq;
    for (const k of keys(inputEq)) {
      const v = inputEq[k];
      if (!v) continue;

      const canonical = getCanonicalItem(v);
      if (v.id !== canonical.id) {
        canonicalized = {
          ...canonicalized,
          [k]: canonical,
        };
      }
    }
    this.player = {
      ...this.player,
      equipment: canonicalized,
    };
  }

  private sanitizeInputs() {
    const eq = this.player.equipment;

    // we should do clone-edits here to prevent affecting ui state
    if (!CAST_STANCES.includes(this.player.style.stance)) {
      this.player = {
        ...this.player,
        spell: null,
      };
    }

    if (this.player.style.stance !== 'Manual Cast' && ammoApplicability(eq.weapon?.id, eq.ammo?.id) === AmmoApplicability.INVALID) {
      if (eq.ammo?.name) {
        this.addIssue(UserIssueType.EQUIPMENT_WRONG_AMMO, 'This ammo does not work with your current weapon.');
      } else {
        this.addIssue(UserIssueType.EQUIPMENT_MISSING_AMMO, 'Your weapon requires ammo to use.');
      }
    }

    // Certain spells require specific weapons to be equipped
    const spellName = this.player.spell?.name;
    if (
      (spellName === 'Iban Blast' && !this.wearing(['Iban\'s staff', 'Iban\'s staff (u)']))
      || (spellName === 'Saradomin Strike' && !this.wearing(['Saradomin staff', 'Staff of light']))
      || (spellName === 'Claws of Guthix' && !this.wearing(['Guthix staff', 'Void knight mace', 'Staff of balance']))
      || (spellName === 'Flames of Zamarok' && !this.wearing(['Zamorak staff', 'Staff of the dead', 'Toxic staff of the dead', 'Thammaron\'s sceptre (a)', 'Accursed sceptre (a)']))
      || (spellName === 'Magic Dart' && !this.wearing(['Slayer\'s staff', 'Slayer\'s staff (e)', 'Staff of the dead', 'Toxic staff of the dead', 'Staff of light', 'Staff of balance']))
    ) {
      this.player = {
        ...this.player,
        spell: null,
      };
      this.addIssue(UserIssueType.SPELL_WRONG_WEAPON, 'This spell needs a specific weapon equipped to cast.');
    }

    // Certain spells can only be cast on specific monsters
    if (
      (spellName?.includes('Demonbane') && !this.monster.attributes.includes(MonsterAttribute.DEMON))
      || (spellName === 'Crumble Undead' && !this.monster.attributes.includes(MonsterAttribute.UNDEAD))
    ) {
      this.player = {
        ...this.player,
        spell: null,
      };
      this.addIssue(UserIssueType.SPELL_WRONG_MONSTER, 'This spell cannot be cast on the selected monster.');
    }
  }

  private track<T extends Parameters<CalcDetails['track']>[1]>(label: Parameters<CalcDetails['track']>[0], value: T, textOverride?: Parameters<CalcDetails['track']>[2]): T {
    this._details?.track(label, value, textOverride);
    return value;
  }

  private trackFactor(label: Parameters<CalcDetails['track']>[0], base: number, factor: Factor): number {
    const result = Math.trunc(base * factor[0] / factor[1]);
    const multStr = factor[0] !== 1 ? ` * ${factor[0]}` : '';
    const divStr = factor[1] !== 1 ? ` / ${factor[1]}` : '';
    this.track(label, result, `${base}${multStr}${divStr} = ${result}`);
    return result;
  }

  private trackMaxHitFromEffective(label: Parameters<CalcDetails['track']>[0], effectiveLevel: number, gearBonus: number): number {
    // a bit of a special case, and would otherwise be a lot of intermediates
    const result = Math.trunc((effectiveLevel * gearBonus + 320) / 640);
    this.track(label, result, `(${effectiveLevel} * ${gearBonus} + 320) / 640 = ${result}`);
    return result;
  }

  private trackAdd(label: Parameters<CalcDetails['track']>[0], base: number, addend: number): number {
    const result = Math.trunc(base + addend);
    this.track(label, result, `${base} ${addend >= 0 ? '+' : '-'} ${addend} = ${result}`);
    return result;
  }

  private addIssue(type: UserIssueType, message: string) {
    this.userIssues.push({ type, message, loadout: this.opts.loadoutName });
  }

  get details(): DetailEntry[] {
    return this._details?.lines || [];
  }

  /**
   * Simple utility function for checking if an item name is equipped. If an array of string is passed instead, this
   * function will return a boolean indicating whether ANY of the provided items are equipped.
   * @param item - item name
   */
  private wearing(item: string | string[]): boolean {
    if (Array.isArray(item)) {
      return (item as string[]).some((i) => this.allEquippedItems.includes(i));
    }
    return this.allEquippedItems.includes(item);
  }

  /**
   * Simple utility function for checking if ALL passed items are equipped.
   * @param items - array of item names
   */
  private wearingAll(items: string[]) {
    return items.every((i) => this.allEquippedItems.includes(i));
  }

  /**
   * Whether the player is using either a slash, crush, or stab combat style.
   */
  private isUsingMeleeStyle(): boolean {
    return ['slash', 'crush', 'stab'].includes(this.player.style.type);
  }

  /**
   * Whether the player is wearing the full void set, excluding the helmet.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingVoidRobes(): boolean {
    return this.wearing(['Void knight top', 'Void knight top (or)', 'Elite void top', 'Elite void top (or)'])
      && this.wearing(['Void knight robe', 'Void knight robe (or)', 'Elite void robe', 'Elite void robe (or)'])
      && this.wearing('Void knight gloves');
  }

  /**
   * Whether the player is wearing the full elite void set, excluding the helmet.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingEliteVoidRobes(): boolean {
    return this.wearing(['Elite void top', 'Elite void top (or)'])
      && this.wearing(['Elite void robe', 'Elite void robe (or)'])
      && this.wearing('Void knight gloves');
  }

  /**
   * Whether the player is wearing the full melee void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingMeleeVoid(): boolean {
    return this.isWearingVoidRobes() && this.wearing(['Void melee helm', 'Void melee helm (or)']);
  }

  /**
   * Whether the player is wearing the full elite ranged void set.
   * @see https://oldschool.runescape.wiki/w/Elite_Void_Knight_equipment
   */
  private isWearingEliteRangedVoid(): boolean {
    return this.isWearingEliteVoidRobes() && this.wearing(['Void ranger helm', 'Void ranger helm (or)']);
  }

  /**
   * Whether the player is wearing the full elite magic void set.
   * @see https://oldschool.runescape.wiki/w/Elite_Void_Knight_equipment
   */
  private isWearingEliteMagicVoid(): boolean {
    return this.isWearingEliteVoidRobes() && this.wearing(['Void mage helm', 'Void mage helm (or)']);
  }

  /**
   * Whether the player is wearing the full ranged void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingRangedVoid(): boolean {
    return this.isWearingVoidRobes() && this.wearing(['Void ranger helm', 'Void ranger helm (or)']);
  }

  /**
   * Whether the player is wearing the full magic void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  private isWearingMagicVoid(): boolean {
    return this.isWearingVoidRobes() && this.wearing(['Void mage helm', 'Void mage helm (or)']);
  }

  /**
   * Whether the player is wearing any item that acts as a black mask for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Black_mask
   */
  private isWearingBlackMask(): boolean {
    return this.isWearingImbuedBlackMask() || this.wearing(['Black mask', 'Slayer helmet']);
  }

  /**
   * Whether the player is wearing any item that acts as an imbued black mask for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Black_mask_(i)
   */
  private isWearingImbuedBlackMask(): boolean {
    return this.wearing(['Black mask (i)', 'Slayer helmet (i)']);
  }

  /**
   * Whether the player is using a smoke battlestaff or mystic smoke staff.
   * @see https://oldschool.runescape.wiki/w/Smoke_battlestaff
   */
  private isWearingSmokeStaff(): boolean {
    return this.wearing(['Smoke battlestaff', 'Mystic smoke staff']);
  }

  /**
   * Whether the player is using a Tzhaar weapon.
   * @see https://oldschool.runescape.wiki/w/Obsidian_equipment
   */
  private isWearingTzhaarWeapon(): boolean {
    return this.wearing(['Tzhaar-ket-em', 'Tzhaar-ket-om', 'Tzhaar-ket-om (t)', 'Toktz-xil-ak', 'Toktz-xil-ek', 'Toktz-mej-tal']);
  }

  /**
   * Whether the player is wearing the entire set of obsidian armour.
   * @see https://oldschool.runescape.wiki/w/Obsidian_equipment
   */
  private isWearingObsidian(): boolean {
    return this.wearingAll(['Obsidian helmet', 'Obsidian platelegs', 'Obsidian platebody']);
  }

  /**
   * Whether the player is wearing a Berserker necklace.
   * @see https://oldschool.runescape.wiki/w/Berserker_necklace
   */
  private isWearingBerserkerNecklace(): boolean {
    return this.wearing(['Berserker necklace', 'Berserker necklace (or)']);
  }

  /**
   * Whether the player is using an item that acts as a crystal bow for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Crystal_bow
   */
  private isWearingCrystalBow(): boolean {
    return this.wearing('Crystal bow') || this.allEquippedItems.some((ei) => ei.includes('Bow of faerdhinen'));
  }

  /**
   * Whether the player is using any variant of Osmumten's fang.
   * @see https://oldschool.runescape.wiki/w/Osmumten%27s_fang
   */
  private isWearingFang(): boolean {
    return this.wearing(["Osmumten's fang", "Osmumten's fang (or)"]);
  }

  /**
   * Whether the player is using any variant of the scythe of vitur.
   * @see https://oldschool.runescape.wiki/w/Scythe_of_vitur
   */
  private isWearingScythe(): boolean {
    return this.wearing('Scythe of vitur') || this.allEquippedItems.some((ei) => ei.includes('of vitur'));
  }

  /**
   * Whether the player is using the Keris dagger.
   * @see https://oldschool.runescape.wiki/w/Keris
   */
  private isWearingKeris(): boolean {
    return this.allEquippedItems.some((ei) => ei.includes('Keris'));
  }

  /**
   * Whether the player is wearing the entire Dharok the Wretched's equipment set.
   * @see https://oldschool.runescape.wiki/w/Dharok_the_Wretched%27s_equipment
   */
  private isWearingDharok(): boolean {
    return this.wearingAll(["Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe"]);
  }

  /**
   * Whether the player is wearing the entire Verac the Defiled's equipment set.
   * @see https://oldschool.runescape.wiki/w/Verac_the_Defiled%27s_equipment
   */
  private isWearingVeracs(): boolean {
    return this.wearingAll(["Verac's helm", "Verac's brassard", "Verac's plateskirt", "Verac's flail"]);
  }

  /**
   * Whether the player is wearing the entire Karil the Tainted's equipment set.
   * @see https://oldschool.runescape.wiki/w/Karil_the_Tainted%27s_equipment
   */
  private isWearingKarils(): boolean {
    return this.wearingAll(["Karil's coif", "Karil's leathertop", "Karil's leatherskirt", "Karil's crossbow", 'Amulet of the damned']);
  }

  /**
   * Whether the player is wearing the entire Ahrim the Blighted's equipment set.
   * @see https://oldschool.runescape.wiki/w/Ahrim_the_Blighted%27s_equipment
   */

  private isWearingAhrims(): boolean {
    return this.wearingAll(["Ahrim's staff", "Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", 'Amulet of the damned']);
  }

  /**
   * Whether the player is wearing a silver weapon.
   * @see https://oldschool.runescape.wiki/w/Silver_weaponry
   */

  private isWearingSilverWeapon(): boolean {
    if (this.player.equipment.ammo?.name.startsWith('Silver bolts')
      && this.player.style.type === 'ranged') {
      return true;
    }

    return this.isUsingMeleeStyle() && this.wearing([
      'Blessed axe',
      'Ivandis flail',
      'Blisterwood flail',
      'Silver sickle',
      'Silver sickle (b)',
      'Emerald sickle',
      'Emerald sickle (b)',
      'Enchanted emerald sickle (b)',
      'Ruby sickle (b)',
      'Enchanted ruby sickle (b)',
      'Blisterwood sickle',
      'Silverlight',
      'Darklight',
      'Arclight',
      'Rod of ivandis',
      'Wolfbane',
    ]);
  }

  /**
   * Whether the player is wearing an Ivandis weapon--that is, a weapon capable of harming Tier 3 Vampyres.
   * @see https://oldschool.runescape.wiki/w/Silver_weaponry
   */
  private isWearingIvandisWeapon(): boolean {
    return this.isUsingMeleeStyle() && this.wearing([
      'Ivandis flail',
      'Blisterwood sickle',
      'Blisterwood flail',
    ]);
  }

  /**
   * Whether the player is wearing a leaf-bladed weapon capable of harming leafy monsters.
   * @see https://oldschool.runescape.wiki/w/Leafy_(attribute)
   */
  private isWearingLeafBladedWeapon(): boolean {
    if (this.isUsingMeleeStyle() && this.wearing([
      'Leaf-bladed battleaxe',
      'Leaf-bladed spear',
      'Leaf-bladed sword',
    ])) {
      return true;
    }

    if (this.player.spell?.name === 'Magic Dart') {
      return true;
    }

    if (
      this.wearing([
        'Broad arrows',
        'Broad bolts',
        'Amethyst broad bolts',
      ])
      && this.player.style.type === 'ranged'
    ) {
      return true;
    }

    return false;
  }

  /**
   * Whether the player is wearing a weapon capable of dealing full damage to the Corporeal Beast.
   * @see https://oldschool.runescape.wiki/w/Corpbane_weapons
   */
  private isWearingCorpbaneWeapon(): boolean {
    const { weapon } = this.player.equipment;
    const isStab = this.player.style.type === 'stab';
    if (!weapon) {
      return false;
    }

    if (this.isWearingFang()) {
      return isStab;
    }

    if (weapon.name.endsWith('halberd')) {
      return isStab;
    }

    if (weapon.name.includes('spear')) {
      return isStab;
    }

    if (this.player.style.type === 'magic') {
      return true;
    }

    return false;
  }

  private isRevWeaponBuffApplicable(): boolean {
    if (!this.player.buffs.inWilderness || this.player.equipment.weapon?.version !== 'Charged') {
      return false;
    }

    switch (this.player.style.type) {
      case 'magic':
        return this.wearing(['Accursed sceptre', 'Accursed sceptre (a)', 'Thammaron\'s sceptre', 'Thammaron\'s sceptre (a)']);

      case 'ranged':
        return this.wearing(['Craw\'s bow', 'Webweaver bow']);

      default:
        return this.wearing(['Ursine chainmace', 'Viggora\'s chainmace']);
    }
  }

  /**
   * Whether the player is wearing a leaf-bladed weapon capable of harming rat monsters.
   * @see https://oldschool.runescape.wiki/w/Rat_(attribute)
   */
  private isWearingRatBoneWeapon(): boolean {
    return this.wearing([
      'Bone mace',
      'Bone shortbow',
      'Bone staff',
    ]);
  }

  private isChargeSpellApplicable(): boolean {
    if (!this.player.buffs.chargeSpell) {
      return false;
    }

    switch (this.player.spell?.name) {
      case 'Saradomin Strike':
        return this.wearing(['Saradomin cape', 'Imbued saradomin cape', 'Saradomin max cape', 'Imbued saradomin max cape']);
      case 'Claws of Guthix':
        return this.wearing(['Guthix cape', 'Imbued guthix cape', 'Guthix max cape', 'Imbued guthix max cape']);
      case 'Flames of Zamorak':
        return this.wearing(['Zamorak cape', 'Imbued zamorak cape', 'Zamorak max cape', 'Imbued zamorak max cape']);
      default:
        return false;
    }
  }

  /**
   * Get the NPC defence roll for this loadout, which is based on the player's current combat style
   */
  public getNPCDefenceRoll(): number {
    if (this.opts.overrides?.defenceRoll !== undefined) {
      return this.track(DetailKey.DEFENCE_ROLL_FINAL, this.opts.overrides.defenceRoll);
    }

    const level = this.track(
      DetailKey.DEFENCE_ROLL_LEVEL,
      this.player.style.type === 'magic' && !USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS.includes(this.monster.id)
        ? this.monster.skills.magic
        : this.monster.skills.def,
    );
    const effectiveLevel = this.trackAdd(DetailKey.DEFENCE_ROLL_EFFECTIVE_LEVEL, level, 9);

    const statBonus = this.trackAdd(DetailKey.DEFENCE_STAT_BONUS, this.monster.defensive[this.player.style.type], 64);
    let defenceRoll = this.trackFactor(DetailKey.DEFENCE_ROLL_BASE, effectiveLevel, [statBonus, 1]);

    if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id) && this.monster.inputs.toaInvocationLevel) {
      defenceRoll = this.track(DetailKey.DEFENCE_ROLL_TOA, Math.trunc(defenceRoll * (250 + this.monster.inputs.toaInvocationLevel) / 250));
    }

    return this.track(DetailKey.DEFENCE_ROLL_FINAL, defenceRoll);
  }

  private getPlayerMaxMeleeAttackRoll(): number {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.ACCURACY_LEVEL, this.player.skills.atk + this.player.boosts.atk);
    for (const p of this.getPrayers(true)) {
      effectiveLevel = this.trackFactor(DetailKey.ACCURACY_LEVEL_PRAYER, effectiveLevel, p.factorAccuracy!);
    }

    let stanceBonus = 8;
    if (style.stance === 'Accurate') {
      stanceBonus += 3;
    } else if (style.stance === 'Controlled') {
      stanceBonus += 1;
    }

    effectiveLevel = this.trackAdd(DetailKey.ACCURACY_EFFECTIVE_LEVEL, effectiveLevel, stanceBonus);

    const isWearingVoid = this.isWearingMeleeVoid();
    if (isWearingVoid) {
      effectiveLevel = this.trackFactor(DetailKey.ACCURACY_EFFECTIVE_LEVEL_VOID, effectiveLevel, [11, 10]);
    }

    const gearBonus = this.trackAdd(DetailKey.ACCURACY_GEAR_BONUS, this.player.offensive[style.type], 64);
    const baseRoll = this.trackFactor(DetailKey.ACCURACY_ROLL_BASE, effectiveLevel, [gearBonus, 1]);
    let attackRoll = baseRoll;

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;

    // These bonuses do not stack with each other
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      attackRoll = this.trackFactor(DetailKey.ACCURACY_FORINTHRY_SURGE, attackRoll, factor);
    } else if (this.wearing(['Salve amulet (e)', 'Salve amulet(ei)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_SALVE, attackRoll, [6, 5]);
    } else if (this.wearing(['Salve amulet', 'Salve amulet(i)']) && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_SALVE, attackRoll, [7, 6]);
    } else if (this.isWearingBlackMask() && buffs.onSlayerTask) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_BLACK_MASK, attackRoll, [7, 6]);
    }

    if (this.isWearingTzhaarWeapon() && this.isWearingObsidian()) {
      const obsidianBonus = this.trackFactor(DetailKey.ACCURACY_OBSIDIAN, baseRoll, [1, 10]);
      attackRoll = this.trackAdd(DetailKey.ACCURACY_OBSIDIAN, attackRoll, obsidianBonus);
    }

    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_REV_WEAPON, attackRoll, [3, 2]);
    }
    if (this.wearing('Arclight') && mattrs.includes(MonsterAttribute.DEMON)) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor([7, 10]));
    }
    if (this.wearing('Dragon hunter lance') && mattrs.includes(MonsterAttribute.DRAGON)) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_DRAGONHUNTER, attackRoll, [6, 5]);
    }
    if (this.wearing('Keris partisan of breaching') && mattrs.includes(MonsterAttribute.KALPHITE)) {
      // https://twitter.com/JagexAsh/status/1704107285381787952
      attackRoll = this.trackFactor(DetailKey.ACCURACY_KERIS, attackRoll, [133, 100]);
    }
    if (this.wearing(['Blisterwood flail', 'Blisterwood sickle']) && isVampyre(mattrs)) {
      attackRoll = this.trackFactor(DetailKey.ACCURACY_VAMPYREBANE, attackRoll, [21, 20]);
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
        attackRoll = this.trackFactor(DetailKey.ACCURACY_INQ, attackRoll, [200 + inqPieces, 200]);
      }
    }

    return attackRoll;
  }

  /**
   * Get the player's max melee hit
   */
  private getPlayerMaxMeleeHit(): number {
    const { style } = this.player;
    const { buffs } = this.player;

    const baseLevel: number = this.trackAdd(DetailKey.DAMAGE_LEVEL, this.player.skills.str, this.player.boosts.str);
    let effectiveLevel: number = baseLevel;

    for (const p of this.getPrayers(false)) {
      effectiveLevel = this.trackFactor(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, p.factorStrength!);
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
    let maxHit = baseMax;

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
      maxHit = this.trackFactor(DetailKey.MAX_HIT_GOLEMBANE, maxHit, [6, 5]);
    }
    if (this.isRevWeaponBuffApplicable()) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_REV_WEAPON, maxHit, [3, 2]);
    }
    if (this.wearing(['Silverlight', 'Darklight', 'Silverlight (dyed)']) && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor([3, 5]));
    }
    if (this.wearing('Blisterwood flail') && isVampyre(mattrs)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [5, 4]);
    }
    if (this.wearing('Blisterwood sickle') && isVampyre(mattrs)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [23, 20]);
    }
    if (this.wearing('Ivandis flail') && isVampyre(mattrs)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_VAMPYREBANE, maxHit, [6, 5]);
    }
    if ((this.wearing("Efaritay's aid") || this.isWearingSilverWeapon()) && mattrs.includes(MonsterAttribute.VAMPYRE_1)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_EFARITAY, maxHit, [11, 10]); // todo should this be before/after the vampyrebane weapons above?
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
        maxHit = this.trackFactor(DetailKey.MAX_HIT_INQ, maxHit, [200 + inqPieces, 200]);
      }
    }

    return maxHit;
  }

  private getPlayerMaxRangedAttackRoll() {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.ACCURACY_LEVEL, this.player.skills.ranged + this.player.boosts.ranged);
    for (const p of this.getPrayers(true)) {
      effectiveLevel = this.trackFactor(DetailKey.ACCURACY_LEVEL_PRAYER, effectiveLevel, p.factorAccuracy!);
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
      attackRoll = this.trackFactor(DetailKey.ACCURACY_FORINTHRY_SURGE, attackRoll, factor);
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
      attackRoll = CombatCalc.tbowScaling(attackRoll, tbowMagic, true);
    }
    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = Math.trunc(attackRoll * 3 / 2);
    }
    if (this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      attackRoll = Math.trunc(attackRoll * 13 / 10);
    }

    return attackRoll;
  }

  /**
   * Get the player's max ranged hit
   */
  private getPlayerMaxRangedHit() {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.DAMAGE_LEVEL, this.player.skills.ranged + this.player.boosts.ranged);
    for (const p of this.getPrayers(false)) {
      effectiveLevel = this.trackFactor(DetailKey.DAMAGE_LEVEL_PRAYER, effectiveLevel, p.factorStrength!);
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

    let maxHit = Math.trunc((effectiveLevel * (this.player.bonuses.ranged_str + 64) + 320) / 640);

    // tested this in-game, slayer helmet (i) + crystal legs + crystal body + bowfa, on accurate, no rigour, 99 ranged
    // max hit is 36, but would be 37 if placed after slayer helm
    if (this.isWearingCrystalBow()) {
      const crystalPieces = (this.wearing('Crystal helm') ? 1 : 0) + (this.wearing('Crystal legs') ? 2 : 0) + (this.wearing('Crystal body') ? 3 : 0);
      maxHit = Math.trunc(maxHit * (40 + crystalPieces) / 40);
    }

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;
    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      maxHit = this.trackFactor(DetailKey.MAX_HIT_FORINTHRY_SURGE, maxHit, factor);
    } else if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 6 / 5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      maxHit = Math.trunc(maxHit * 7 / 6);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      maxHit = Math.trunc(maxHit * 23 / 20);
    }

    if (this.wearing('Twisted bow')) {
      const cap = mattrs.includes(MonsterAttribute.XERICIAN) ? 350 : 250;
      const tbowMagic = Math.min(cap, Math.max(this.monster.skills.magic, this.monster.offensive.magic));
      maxHit = CombatCalc.tbowScaling(maxHit, tbowMagic, false);
    }
    if (this.isRevWeaponBuffApplicable()) {
      maxHit = Math.trunc(maxHit * 3 / 2);
    }
    if (this.wearing('Dragon hunter crossbow') && mattrs.includes(MonsterAttribute.DRAGON)) {
      // TODO: https://twitter.com/JagexAsh/status/1647928422843273220 for max_hit seems to be additive now
      maxHit = Math.trunc(maxHit * 5 / 4);
    }
    if (this.isWearingRatBoneWeapon() && mattrs.includes(MonsterAttribute.RAT)) {
      maxHit = this.trackAdd(DetailKey.MAX_HIT_RATBANE, maxHit, 10);
    }

    return maxHit;
  }

  private getPlayerMaxMagicAttackRoll() {
    const { style } = this.player;

    let effectiveLevel: number = this.track(DetailKey.ACCURACY_LEVEL, this.player.skills.magic + this.player.boosts.magic);
    for (const p of this.getPrayers(true)) {
      effectiveLevel = this.trackFactor(DetailKey.ACCURACY_LEVEL_PRAYER, effectiveLevel, p.factorAccuracy!);
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

    let attackRoll = effectiveLevel * (magicBonus + 64);

    if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      attackRoll = this.trackFactor(DetailKey.ACCURACY_FORINTHRY_SURGE, attackRoll, factor);
    } else if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 6 / 5);
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      attackRoll = Math.trunc(attackRoll * 23 / 20);
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      attackRoll = Math.trunc(attackRoll * 23 / 20);
    }

    if (this.player.spell?.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      const baseFactor: Factor = buffs.markOfDarknessSpell ? [8, 20] : [4, 20];
      attackRoll = this.trackFactor(DetailKey.ACCURACY_DEMONBANE, attackRoll, this.demonbaneFactor(baseFactor));
    }
    if (this.isRevWeaponBuffApplicable()) {
      attackRoll = Math.trunc(attackRoll * 3 / 2);
    }
    if (this.isWearingSmokeStaff() && this.player.spell?.spellbook === 'standard') {
      attackRoll = Math.trunc(attackRoll * 11 / 10);
    }
    if (this.wearing('Tome of water') && (isWaterSpell(this.player.spell) || isBindSpell(this.player.spell))) { // todo does this go here?
      attackRoll = Math.trunc(attackRoll * 6 / 5);
    }

    return attackRoll;
  }

  /**
   * Get the player's max magic hit
   */
  private getPlayerMaxMagicHit() {
    let maxHit: number = 0;
    const magicLevel = this.player.skills.magic + this.player.boosts.magic;
    const { spell } = this.player;

    // Specific bonuses that are applied from equipment
    const mattrs = this.monster.attributes;
    const { buffs } = this.player;

    if (spell) {
      maxHit = spell.max_hit || 0;
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
      maxHit = Math.trunc((magicLevel * (56) + 320) / 640);
    } else if (this.wearing('Orange salamander')) {
      maxHit = Math.trunc((magicLevel * (59 + 64) + 320) / 640);
    } else if (this.wearing('Red salamander')) {
      maxHit = Math.trunc((magicLevel * (77 + 64) + 320) / 640);
    } else if (this.wearing('Black salamander')) {
      maxHit = Math.trunc((magicLevel * (92 + 64) + 320) / 640);
    }

    if (maxHit === 0) {
      // at this point either they've selected a 0-dmg spell
      // or they picked a staff-casting option without choosing a spell
      return 0;
    }

    if (this.wearing('Chaos gauntlets') && spell?.name.toLowerCase().includes('bolt')) {
      maxHit += 3;
    }
    if (this.isChargeSpellApplicable()) {
      maxHit += 10;
    }

    let magicDmgBonus = this.player.bonuses.magic_str * 10;

    if (this.isWearingEliteMagicVoid()) {
      magicDmgBonus += 25;
    }
    if (this.isWearingSmokeStaff() && spell?.spellbook === 'standard') {
      magicDmgBonus += 100;
    }

    let blackMaskBonus = false;
    if (this.wearing('Salve amulet(ei)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      magicDmgBonus += 200;
    } else if (this.wearing('Salve amulet(i)') && mattrs.includes(MonsterAttribute.UNDEAD)) {
      magicDmgBonus += 150;
    } else if (this.isWearingImbuedBlackMask() && buffs.onSlayerTask) {
      blackMaskBonus = true;
    }

    maxHit = Math.trunc(maxHit * (1000 + magicDmgBonus) / 1000);

    if (blackMaskBonus) {
      maxHit = Math.trunc(maxHit * 23 / 20);
    } else if (this.wearing('Amulet of avarice') && this.monster.name.startsWith('Revenant')) {
      const factor = <Factor>[buffs.forinthrySurge ? 27 : 24, 20];
      maxHit = this.trackFactor(DetailKey.MAX_HIT_FORINTHRY_SURGE, maxHit, factor);
    }

    if (this.player.buffs.markOfDarknessSpell && this.player.spell?.name.includes('Demonbane') && mattrs.includes(MonsterAttribute.DEMON)) {
      maxHit = this.trackFactor(DetailKey.MAX_HIT_DEMONBANE, maxHit, this.demonbaneFactor([5, 20]));
    }

    if (this.isRevWeaponBuffApplicable()) {
      maxHit = Math.trunc(maxHit * 3 / 2);
    }

    return maxHit;
  }

  private getPrayers(accuracy: boolean): PrayerData[] {
    const style = this.player.style.type;

    let prayers = this.player.prayers.map((p) => PrayerMap[p]);
    if (this.isUsingMeleeStyle()) {
      prayers = prayers.filter((p) => p.combatStyle === 'melee');
    } else if (style === 'ranged') {
      prayers = prayers.filter((p) => p.combatStyle === 'ranged');
    } else {
      prayers = prayers.filter((p) => p.combatStyle === 'magic');
    }

    return prayers.filter((p) => (accuracy ? p.factorAccuracy : p.factorStrength));
  }

  /**
   * Get the max hit for this loadout, which is based on the player's current combat style
   */
  private getMaxHit() {
    if (this.player.style.stance !== 'Manual Cast') {
      const weaponId = this.player.equipment.weapon?.id;
      const ammoId = this.player.equipment.ammo?.id;
      if (ammoApplicability(weaponId, ammoId) === AmmoApplicability.INVALID) {
        return 0;
      }
    }

    const style = this.player.style.type;

    let maxHit = 0;
    if (this.isUsingMeleeStyle()) {
      maxHit = this.getPlayerMaxMeleeHit();
    }
    if (style === 'ranged') {
      maxHit = this.getPlayerMaxRangedHit();
    }
    if (style === 'magic') {
      maxHit = this.getPlayerMaxMagicHit();
    }

    return this.track(DetailKey.MAX_HIT_FINAL, maxHit);
  }

  /**
   * Get the max attack roll for this loadout, which is based on the player's current combat style
   */
  public getMaxAttackRoll() {
    if (this.opts.overrides?.attackRoll !== undefined) {
      return this.track(DetailKey.ACCURACY_ROLL_FINAL, this.opts.overrides?.attackRoll);
    }

    if (this.player.style.stance !== 'Manual Cast') {
      const weaponId = this.player.equipment.weapon?.id;
      const ammoId = this.player.equipment.ammo?.id;
      if (ammoApplicability(weaponId, ammoId) === AmmoApplicability.INVALID) {
        return this.track(DetailKey.ACCURACY_ROLL_FINAL, 0.0);
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

    return this.track(DetailKey.ACCURACY_ROLL_FINAL, atkRoll);
  }

  public static getNormalAccuracyRoll(atk: number, def: number): number {
    const stdRoll = (attack: number, defence: number) => ((attack > defence)
      ? 1 - ((defence + 2) / (2 * (attack + 1)))
      : attack / (2 * (defence + 1)));

    if (atk < 0) atk = Math.min(0, atk + 2);
    if (def < 0) def = Math.min(0, def + 2);

    if (atk >= 0 && def >= 0) return stdRoll(atk, def);
    if (atk >= 0 && def < 0) return 1 - 1 / (-def + 1) / (atk + 1);
    if (atk < 0 && def >= 0) return 0;
    if (atk < 0 && def < 0) return stdRoll(-def, -atk);
    return 0;
  }

  public static getFangAccuracyRoll(atk: number, def: number): number {
    const stdRoll = (attack: number, defence: number) => ((attack > def)
      ? 1 - (defence + 2) * (2 * defence + 3) / (attack + 1) / (attack + 1) / 6
      : attack * (4 * attack + 5) / 6 / (attack + 1) / (defence + 1));

    const rvRoll = (attack: number, defence: number) => ((attack < def)
      ? attack * (defence * 6 - 2 * attack + 5) / 6 / (defence + 1) / (defence + 1)
      : 1 - (defence + 2) * (2 * defence + 3) / 6 / (defence + 1) / (attack + 1));

    if (atk < 0) atk = Math.min(0, atk + 2);
    if (def < 0) def = Math.min(0, def + 2);
    if (atk >= 0 && def >= 0) return stdRoll(atk, def);
    if (atk >= 0 && def < 0) return 1 - 1 / (-def + 1) / (atk + 1);
    if (atk < 0 && def >= 0) return 0;
    if (atk < 0 && def < 0) return rvRoll(-def, -atk);
    return 0;
  }

  public getHitChance() {
    if (this.opts.overrides?.accuracy) {
      return this.track(DetailKey.ACCURACY_FINAL, this.opts.overrides.accuracy);
    }

    if (VERZIK_P1_IDS.includes(this.monster.id) && this.wearing('Dawnbringer')) {
      this.track(DetailKey.ACCURACY_DAWNBRINGER, 1.0);
      return this.track(DetailKey.ACCURACY_FINAL, 1.0);
    }

    // Giant rat (Scurrius)
    if (this.monster.id === 7223 && this.player.style.stance !== 'Manual Cast') {
      this.track(DetailKey.ACCURACY_SCURRIUS_RAT, 1.0);
      return this.track(DetailKey.ACCURACY_FINAL, 1.0);
    }

    const atk = this.getMaxAttackRoll();
    const def = this.getNPCDefenceRoll();

    let hitChance = this.track(
      DetailKey.ACCURACY_BASE,
      CombatCalc.getNormalAccuracyRoll(atk, def),
    );

    if (this.player.style.type === 'magic' && this.wearing('Brimstone ring')) {
      const effectDef = Math.trunc(def * 9 / 10);
      const effectHitChance = (atk > effectDef)
        ? 1 - ((effectDef + 2) / (2 * (atk + 1)))
        : atk / (2 * (effectDef + 1));

      hitChance = this.track(DetailKey.ACCURACY_BRIMSTONE, (0.75 * hitChance) + (0.25 * effectHitChance));
    }

    if (this.isWearingFang() && this.player.style.type === 'stab') {
      if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(this.monster.id)) {
        hitChance = this.track(DetailKey.ACCURACY_FANG_TOA, 1 - (1 - hitChance) ** 2);
      } else {
        hitChance = this.track(
          DetailKey.ACCURACY_FANG,
          CombatCalc.getFangAccuracyRoll(atk, def),
        );
      }
    }

    return this.track(DetailKey.ACCURACY_FINAL, hitChance);
  }

  public getDistribution(): AttackDistribution {
    if (this.memoizedDist === undefined) {
      this.memoizedDist = this.getDistributionImpl();
    }

    return this.memoizedDist;
  }

  private getDistributionImpl(): AttackDistribution {
    const mattrs = this.monster.attributes;
    const acc = this.getHitChance();
    const max = this.getMaxHit();
    const style = this.player.style.type;

    // standard linear
    const standardHitDist = HitDistribution.linear(acc, 0, max);
    let dist = new AttackDistribution([standardHitDist]);

    // Monsters that always die in one hit no matter what
    if (ONE_HIT_MONSTERS.includes(this.monster.id)) {
      return new AttackDistribution([
        HitDistribution.single(1.0, this.monster.skills.hp),
      ]);
    }

    if (this.isUsingMeleeStyle() && this.isWearingFang()) {
      const shrink = Math.trunc(max * 3 / 20);
      dist = new AttackDistribution(
        [HitDistribution.linear(acc, shrink, max - shrink)],
      );
    }

    if (this.isUsingMeleeStyle() && this.wearing('Gadderhammer') && mattrs.includes(MonsterAttribute.SHADE)) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.95).scaleDamage(5, 4).hits,
          ...standardHitDist.scaleProbability(0.05).scaleDamage(2).hits,
        ]),
      ]);
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
      dist = new AttackDistribution([
        standardHitDist.scaleProbability(0.75),
        new HitDistribution([
          ...standardHitDist.hits.map((h) => new WeightedHit(
            h.probability * 0.25, // 25% chance to
            [...h.hitsplats, ...h.hitsplats.map((s) => Math.trunc(s / 2))], // deal a second hitsplat of half damage
          )),
        ]),
      ]);
    }

    if (this.isUsingMeleeStyle() && this.isWearingScythe()) {
      const hits: HitDistribution[] = [];
      for (let i = 0; i < Math.min(Math.max(this.monster.size, 1), 3); i++) {
        hits.push(HitDistribution.linear(acc, 0, Math.floor(max / (2 ** i))));
      }
      dist = new AttackDistribution(hits);
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

    if (this.monster.name === 'Ice demon' && (isFireSpell(this.player.spell) || this.player.spell?.name === 'Flames of Zamorak')) {
      // https://twitter.com/JagexAsh/status/1133350436554121216
      dist = dist.scaleDamage(3, 2);
    }
    if (this.wearing('Tome of fire') && isFireSpell(this.player.spell)) {
      dist = dist.scaleDamage(3, 2);
    }
    if (this.wearing('Tome of water') && isWaterSpell(this.player.spell)) {
      dist = dist.scaleDamage(6, 5);
    }

    if (this.player.style.type === 'magic' && this.isWearingAhrims()) {
      dist = new AttackDistribution([
        new HitDistribution([
          ...standardHitDist.scaleProbability(0.75).hits,
          ...standardHitDist.scaleProbability(0.25).scaleDamage(13, 10).hits,
        ]),
      ]);
    }

    // bolt effects
    if (this.player.style.type === 'ranged' && this.player.equipment.weapon?.name.includes('rossbow')) {
      const zaryte = this.wearing('Zaryte crossbow');
      const rangedLvl = this.player.skills.ranged + this.player.boosts.ranged;
      const kandarinDiaryFactor = this.player.buffs.kandarinDiary ? 1.1 : 1.0;

      if (this.wearing(['Opal bolts (e)', 'Opal dragon bolts (e)'])) {
        const chance = 0.05 * kandarinDiaryFactor;
        const bonusDmg = Math.trunc(rangedLvl / (zaryte ? 9 : 10));
        dist = dist.transform((h) => new HitDistribution([
          new WeightedHit(chance, [h + bonusDmg]),
          new WeightedHit(1 - chance, [h]),
        ]));
      }

      if (this.wearing(['Pearl bolts (e)', 'Pearl dragon bolts (e)'])) {
        const chance = 0.06 * kandarinDiaryFactor;
        const divisor = mattrs.includes(MonsterAttribute.FIERY) ? 15 : 20;
        const bonusDmg = Math.trunc(rangedLvl / (zaryte ? divisor - 2 : divisor));
        dist = dist.transform((h) => new HitDistribution([
          new WeightedHit(chance, [h + bonusDmg]),
          new WeightedHit(1 - chance, [h]),
        ]));
      }

      if (this.wearing(['Diamond bolts (e)', 'Diamond dragon bolts (e)'])) {
        const chance = 0.1 * kandarinDiaryFactor;
        const effectMax = max + Math.trunc(max * (zaryte ? 26 : 15) / 100);
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(1.0, 0, effectMax).scaleProbability(chance).hits,
          ]),
        ]);
      }

      if (this.wearing(['Dragonstone bolts (e)', 'Dragonstone dragon bolts (e)']) && (!mattrs.includes(MonsterAttribute.FIERY) || !mattrs.includes(MonsterAttribute.DRAGON))) {
        const chance = 0.06 * kandarinDiaryFactor;
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
        const chance = 0.11 * kandarinDiaryFactor;
        const effectMax = max + Math.trunc(rangedLvl * (zaryte ? 32 : 20) / 100);
        dist = new AttackDistribution([
          new HitDistribution([
            ...standardHitDist.scaleProbability(1 - chance).hits,
            ...HitDistribution.linear(1.0, 0, effectMax).scaleProbability(acc * chance).hits,
            new WeightedHit((1 - acc) * chance, [0]),
          ]),
        ]);
      }
    }

    // we apply corp early and rubies late since corp takes full ruby bolt effect damage
    if (this.monster.name === 'Corporeal Beast' && !this.isWearingCorpbaneWeapon()) {
      dist = dist.transform(divisionTransformer(2));
    }

    if (this.player.style.type === 'ranged' && this.player.equipment.weapon?.name.includes('rossbow')) {
      if (this.wearing(['Ruby bolts (e)', 'Ruby dragon bolts (e)'])) {
        const chance = 0.06 * (this.player.buffs.kandarinDiary ? 1.1 : 1.0);
        const effectDmg = this.wearing('Zaryte crossbow')
          ? Math.min(110, Math.trunc(this.monster.inputs.monsterCurrentHp * 22 / 100))
          : Math.min(100, Math.trunc(this.monster.inputs.monsterCurrentHp / 5));
        dist = new AttackDistribution([
          new HitDistribution([
            ...dist.dists[0].scaleProbability(1 - chance).hits,
            new WeightedHit(chance, [effectDmg]),
          ]),
        ]);
      }
    }

    return this.applyLimiters(dist);
  }

  applyLimiters(dist: AttackDistribution): AttackDistribution {
    // we apply this here instead of at the top of getDistributionImpl just in case of multi-hits
    if (this.isImmune()) {
      return new AttackDistribution([new HitDistribution([new WeightedHit(1.0, [0])])]);
    }

    if (this.monster.name === 'Zulrah') {
      // https://twitter.com/JagexAsh/status/1745852774607183888
      dist = dist.transform(cappedRerollTransformer(50, 5, 45));
    }
    if (this.monster.name === 'Fragment of Seren') {
      // https://twitter.com/JagexAsh/status/1375037874559721474
      dist = dist.transform(linearMinTransformer(2, 22));
    }
    if (this.monster.name === 'Kraken' && this.player.style.type === 'ranged') {
      // https://twitter.com/JagexAsh/status/1699360516488011950
      dist = dist.transform(divisionTransformer(7, 1));
    }
    if (VERZIK_P1_IDS.includes(this.monster.id) && !this.wearing('Dawnbringer')) {
      const limit = this.isUsingMeleeStyle() ? 10 : 3;
      dist = dist.transform(linearMinTransformer(limit));
    }
    if (TEKTON_IDS.includes(this.monster.id) && this.player.style.type === 'magic') {
      dist = dist.transform(divisionTransformer(5, 1));
    }
    if (GLOWING_CRYSTAL_IDS.includes(this.monster.id) && this.player.style.type === 'magic') {
      dist = dist.transform(divisionTransformer(3));
    }
    if ((OLM_MELEE_HAND_IDS.includes(this.monster.id) || OLM_HEAD_IDS.includes(this.monster.id)) && this.player.style.type === 'magic') {
      dist = dist.transform(divisionTransformer(3));
    }
    if ((OLM_MAGE_HAND_IDS.includes(this.monster.id) || OLM_MELEE_HAND_IDS.includes(this.monster.id)) && this.player.style.type === 'ranged') {
      dist = dist.transform(divisionTransformer(3));
    }
    if (this.monster.attributes.includes(MonsterAttribute.VAMPYRE_2) && this.wearing("Efaritay's aid") && !this.isWearingSilverWeapon()) {
      dist = dist.transform(flatLimitTransformer(10));
    }
    if (this.monster.name === 'Ice demon' && !isFireSpell(this.player.spell) && this.player.spell?.name !== 'Flames of Zamorak') {
      // https://twitter.com/JagexAsh/status/1133350436554121216
      dist = dist.transform(divisionTransformer(3));
    }
    if (this.monster.name === 'Slagilith' && this.player.equipment.weapon?.category !== EquipmentCategory.PICKAXE) {
      // https://twitter.com/JagexAsh/status/1219652159148646401
      dist = dist.transform(divisionTransformer(3));
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

    // now also cap hits indiscriminately by the monster's max health, in case it is higher
    dist = dist.transform(flatLimitTransformer(this.monster.skills.hp));

    return dist;
  }

  isImmune(): boolean {
    const monsterId = this.monster.id;
    const mattrs = this.monster.attributes;
    const styleType = this.player.style.type;

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
      if (styleType === 'magic' && !isWaterSpell(this.player.spell)
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
    if (AUTOCAST_STANCES.includes(this.player.style.stance)) {
      if (this.player.equipment.weapon?.name === 'Harmonised nightmare staff' && this.player.spell?.spellbook === 'standard') {
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

  /**
   * Returns the expected damage per tick, based on the player's attack speed.
   */
  public getDpt() {
    return this.getDistribution().getExpectedDamage() / this.getAttackSpeed();
  }

  /**
   * Returns the damage-per-second calculation, which is the damage-per-tick divided by the number of seconds per tick.
   */
  public getDps() {
    return this.getDpt() / SECONDS_PER_TICK;
  }

  /**
   * Returns the average hits-to-kill calculation.
   */
  public getHtk() {
    const dist = this.getDistribution();
    const hist = dist.asHistogram();
    const max = dist.getMax();
    if (max === 0) {
      return 0;
    }

    const htk = new Float64Array(this.monster.skills.hp + 1); // 0 hits left to do if hp = 0

    for (let hp = 1; hp <= this.monster.skills.hp; hp++) {
      let val = 1.0; // takes at least one hit
      for (let hit = 1; hit <= Math.min(hp, max); hit++) {
        const p = hist[hit];
        val += p.chance * htk[hp - hit];
      }

      htk[hp] = val / (1 - hist[0].chance);
    }

    return htk[this.monster.skills.hp];
  }

  /**
   * Returns the average time-to-kill (in seconds) calculation.
   */
  public getTtk() {
    return this.getHtk() * this.getAttackSpeed() * SECONDS_PER_TICK;
  }

  /**
   * Returns a distribution of times-to-kill (in ticks) to probabilities.
   * Because the result will not be densely populated (unless attack speed is 1),
   * it is an object where keys are tick counts and values are probabilities.
   */
  public getTtkDistribution(): Map<number, number> {
    const speed = this.getAttackSpeed();
    const dist = this.getDistribution().singleHitsplat;
    if (dist.expectedHit() === 0) {
      return new Map<number, number>();
    }

    // distribution of health values at current iter step
    // we don't need to track the 0-health state, but using +1 here removes the need for -1s later on
    let hps = new Float64Array(this.monster.skills.hp + 1);
    hps[this.monster.skills.hp] = 1.0;

    // output map, will be converted at the end
    const ttks = new Map<number, number>();

    // sum of non-zero-health probabilities
    let epsilon = 1.0;

    // if the hit dist depends on hp, we'll have to recalculate it each time, so cache the results to not repeat work
    const recalcDistOnHp = CombatCalc.distIsCurrentHpDependent(this.player, this.monster);
    const hpHitDists = new Map<number, HitDistribution>();
    hpHitDists.set(this.monster.skills.hp, dist);
    if (recalcDistOnHp) {
      for (let hp = 0; hp < this.monster.skills.hp; hp++) {
        hpHitDists.set(hp, this.distAtHp(hp));
      }
    }

    // 1. until the amount of hp values remaining above zero is more than our desired epsilon accuracy,
    //    or we reach the maximum iteration rounds
    for (let hit = 0; hit < (TTK_DIST_MAX_ITER_ROUNDS + 1) && epsilon >= TTK_DIST_EPSILON; hit++) {
      const nextHps = new Float64Array(this.monster.skills.hp + 1);

      // 3. for each possible hp value,
      for (const [hp, hpProb] of hps.entries()) {
        // this is a bit of a hack, but idk if there's a better way
        const currDist: HitDistribution = recalcDistOnHp ? hpHitDists.get(hp)! : dist;

        // 4. for each damage amount possible,
        for (const h of currDist.hits) {
          const dmgProb = h.probability;
          const dmg = h.hitsplats[0]; // guaranteed to be length 1 from asSingleHitsplat

          // 5. the chance of this path being reached is the previous chance of landing here * the chance of hitting this amount
          const chanceOfAction = dmgProb * hpProb;
          if (chanceOfAction === 0) {
            continue;
          }

          const newHp = hp - dmg;

          // 6. if the hp we are about to arrive at is <= 0, the npc is killed, the iteration count is hits done,
          //    and we add this probability path into the delta
          if (newHp <= 0) {
            const tick = hit * speed + 1;
            ttks.set(tick, (ttks.get(tick) || 0) + chanceOfAction);
            epsilon -= chanceOfAction;
          } else {
            // 7. otherwise, we add the chance of this path to the next iteration's hp value
            nextHps[newHp] += chanceOfAction;
          }
        }
      }

      // 8. update counters and repeat
      hps = nextHps;
    }

    return ttks;
  }

  distAtHp(hp: number): HitDistribution {
    if (!CombatCalc.distIsCurrentHpDependent(this.player, this.monster) || hp === this.monster.inputs.monsterCurrentHp) {
      return this.getDistribution().singleHitsplat;
    }

    // a special case for optimization, ruby bolts only change dps under 500 hp
    // so for high health targets, avoid recomputing dist until then
    if (this.player.style.type === 'ranged'
      && this.player.equipment.weapon?.name.includes('rossbow')
      && ['Ruby bolts (e)', 'Ruby dragon bolts (e)'].includes(this.player.equipment.ammo?.name || '')
      && this.monster.inputs.monsterCurrentHp >= 500
      && hp >= 500) {
      return this.getDistribution().singleHitsplat;
    }

    return new CombatCalc(
      this.player,
      scaledMonster({
        ...this.monster,
        inputs: {
          ...this.monster.inputs,
          monsterCurrentHp: hp,
        },
      }),
      this.opts,
    ).getDistribution().singleHitsplat;
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
}
