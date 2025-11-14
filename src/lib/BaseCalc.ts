import { EquipmentPiece, Player } from '@/types/Player';
import { BurnImmunity, Monster } from '@/types/Monster';
import { AmmoApplicability, ammoApplicability, getCanonicalEquipment } from '@/lib/Equipment';
import UserIssueType from '@/enums/UserIssueType';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  CAST_STANCES,
  IMMUNE_TO_BURN_DAMAGE_NPC_IDS,
  YAMA_IDS,
  YAMA_VOID_FLARE_IDS,
} from '@/lib/constants';
import { UserIssue } from '@/types/State';
import { CalcDetails, DetailEntry } from '@/lib/CalcDetails';
import { Factor } from '@/lib/Math';
import { scaleMonster } from '@/lib/MonsterScaling';
import { getCombatStylesForCategory, isDefined } from '@/utils';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { getRangedDamageType } from '@/types/PlayerCombatStyle';

export interface CalcOpts {
  loadoutName?: string,
  detailedOutput?: boolean,
  disableMonsterScaling?: boolean,
  usingSpecialAttack?: boolean,
  overrides?: {
    accuracy?: number,
    attackRoll?: number,
    defenceRoll?: number,
  },
}

export interface InternalOpts extends CalcOpts {
  /**
   * Internal-only flag for when the calc is being spawned as a sub-calc of the current,
   * and as such the caller guarantees that all required properties are already sanitized and valid.
   */
  noInit: boolean,
}

const DEFAULT_OPTS: Required<InternalOpts> = {
  loadoutName: 'unknown',
  detailedOutput: false,
  disableMonsterScaling: false,
  usingSpecialAttack: false,
  noInit: false,
  overrides: {},
};

/**
 * Base class which the other calculators extend.
 */
export default class BaseCalc {
  protected opts: Required<InternalOpts>;

  private _details?: CalcDetails;

  // The player that we're using for this calculation
  protected player: Player;

  // The monster that we're using for this calculation
  protected monster: Monster;

  // The original monster passed in to the calculator before scaling was applied
  protected baseMonster: Monster;

  // Array of the names of all equipped items (for quick checks)
  protected allEquippedItems: string[] = [];

  userIssues: UserIssue[] = [];

  constructor(player: Player, monster: Monster, opts: CalcOpts = {}) {
    this.opts = {
      ...DEFAULT_OPTS,
      ...opts,
    };

    if (this.opts.detailedOutput) {
      this._details = new CalcDetails();
    }

    this.player = player;
    this.baseMonster = monster;
    this.monster = (this.opts.disableMonsterScaling || this.opts.noInit) ? monster : scaleMonster(monster);

    if (!this.opts.noInit) {
      this.canonicalizeEquipment();
      this.allEquippedItems = Object.values(this.player.equipment).filter((v) => v !== null).flat(1).map((eq: EquipmentPiece | null) => eq?.name || '');
      this.sanitizeInputs();
    }
  }

  protected track<T extends Parameters<CalcDetails['track']>[1]>(label: Parameters<CalcDetails['track']>[0], value: T, textOverride?: Parameters<CalcDetails['track']>[2]): T {
    this._details?.track(label, value, textOverride);
    return value;
  }

  protected trackFactor(label: Parameters<CalcDetails['track']>[0], base: number, factor: Factor): number {
    const result = Math.trunc(base * factor[0] / factor[1]);
    const multStr = factor[0] !== 1 ? ` * ${factor[0]}` : '';
    const divStr = factor[1] !== 1 ? ` / ${factor[1]}` : '';
    this.track(label, result, `${base}${multStr}${divStr} = ${result}`);
    return result;
  }

  protected trackMaxHitFromEffective(label: Parameters<CalcDetails['track']>[0], effectiveLevel: number, gearBonus: number): number {
    // a bit of a special case, and would otherwise be a lot of intermediates
    const result = Math.trunc((effectiveLevel * gearBonus + 320) / 640);
    this.track(label, result, `(${effectiveLevel} * ${gearBonus} + 320) / 640 = ${result}`);
    return result;
  }

  protected trackAdd(label: Parameters<CalcDetails['track']>[0], base: number, addend: number): number {
    const result = Math.trunc(base + addend);
    this.track(label, result, `${base} ${addend >= 0 ? `+${addend}` : `-${-addend}`} = ${result}`);
    return result;
  }

  protected trackAddFactor(label: Parameters<CalcDetails['track']>[0], base: number, factor: Factor): number {
    const addend = Math.trunc(base * factor[0] / factor[1]);
    const result = Math.trunc(base + addend);
    const multStr = factor[0] !== 1 ? ` * ${factor[0]}` : '';
    const divStr = factor[1] !== 1 ? ` / ${factor[1]}` : '';
    this.track(label, result, `${base} + (${base}${multStr}${divStr} = ${addend}) = ${result}`);
    return result;
  }

  get details(): DetailEntry[] {
    return this._details?.lines || [];
  }

  private canonicalizeEquipment() {
    this.player = {
      ...this.player,
      equipment: getCanonicalEquipment(this.player.equipment),
    };
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

  public static getConflictionGauntletsAccuracyRoll(atk: number, def: number): number {
    const singleRoll = this.getNormalAccuracyRoll(atk, def);
    const doubleRoll = this.getFangAccuracyRoll(atk, def);
    return doubleRoll / (1 + doubleRoll - singleRoll);
  }

  /**
   * Simple utility function for checking if an item name is equipped. If an array of string is passed instead, this
   * function will return a boolean indicating whether ANY of the provided items are equipped.
   * @param item - item name
   */
  protected wearing(item: string | string[]): boolean {
    if (Array.isArray(item)) {
      return (item as string[]).some((i) => this.allEquippedItems.includes(i));
    }
    return this.allEquippedItems.includes(item);
  }

  /**
   * Simple utility function for checking if ALL passed items are equipped.
   * @param items - array of item names
   */
  protected wearingAll(items: string[]) {
    return items.every((i) => this.allEquippedItems.includes(i));
  }

  /**
   * Whether the player is using either a slash, crush, or stab combat style.
   */
  protected isUsingMeleeStyle(): boolean {
    return ['slash', 'crush', 'stab'].includes(this.player.style.type || '');
  }

  /**
   * Whether the player is wearing the full void set, excluding the helmet.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  protected isWearingVoidRobes(): boolean {
    return this.wearing(['Void knight top', 'Void knight top (or)', 'Elite void top', 'Elite void top (or)'])
      && this.wearing(['Void knight robe', 'Void knight robe (or)', 'Elite void robe', 'Elite void robe (or)'])
      && this.wearing('Void knight gloves');
  }

  /**
   * Whether the player is wearing the full elite void set, excluding the helmet.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  protected isWearingEliteVoidRobes(): boolean {
    return this.wearing(['Elite void top', 'Elite void top (or)'])
      && this.wearing(['Elite void robe', 'Elite void robe (or)'])
      && this.wearing('Void knight gloves');
  }

  /**
   * Whether the player is wearing the full melee void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  protected isWearingMeleeVoid(): boolean {
    return this.isWearingVoidRobes() && this.wearing(['Void melee helm', 'Void melee helm (or)']);
  }

  /**
   * Whether the player is wearing the full elite ranged void set.
   * @see https://oldschool.runescape.wiki/w/Elite_Void_Knight_equipment
   */
  protected isWearingEliteRangedVoid(): boolean {
    return this.isWearingEliteVoidRobes() && this.wearing(['Void ranger helm', 'Void ranger helm (or)']);
  }

  /**
   * Whether the player is wearing the full elite magic void set.
   * @see https://oldschool.runescape.wiki/w/Elite_Void_Knight_equipment
   */
  protected isWearingEliteMagicVoid(): boolean {
    return this.isWearingEliteVoidRobes() && this.wearing(['Void mage helm', 'Void mage helm (or)']);
  }

  /**
   * Whether the player is wearing the full ranged void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  protected isWearingRangedVoid(): boolean {
    return this.isWearingVoidRobes() && this.wearing(['Void ranger helm', 'Void ranger helm (or)']);
  }

  /**
   * Whether the player is wearing the full magic void set.
   * @see https://oldschool.runescape.wiki/w/Void_Knight_equipment
   */
  protected isWearingMagicVoid(): boolean {
    return this.isWearingVoidRobes() && this.wearing(['Void mage helm', 'Void mage helm (or)']);
  }

  /**
   * Whether the player is wearing *any* slayer helmet
   * @see https://oldschool.runescape.wiki/w/Slayer_helmet
   */
  protected isWearingSlayerHelmet(): boolean {
    return this.wearing(['Slayer helmet', 'Slayer helmet (i)']);
  }

  /**
   * Whether the player is wearing any item that acts as a black mask for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Black_mask
   */
  protected isWearingBlackMask(): boolean {
    return this.isWearingImbuedBlackMask() || this.wearing(['Black mask', 'Slayer helmet']);
  }

  /**
   * Whether the player is wearing any item that acts as an imbued black mask for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Black_mask_(i)
   */
  protected isWearingImbuedBlackMask(): boolean {
    return this.wearing(['Black mask (i)', 'Slayer helmet (i)']);
  }

  /**
   * Whether the player is using a smoke battlestaff or mystic smoke staff.
   * @see https://oldschool.runescape.wiki/w/Smoke_battlestaff
   */
  protected isWearingSmokeStaff(): boolean {
    return this.wearing(['Smoke battlestaff', 'Mystic smoke staff', 'Twinflame staff']);
  }

  /**
   * Whether the player is using a Tzhaar weapon.
   * @see https://oldschool.runescape.wiki/w/Obsidian_equipment
   */
  protected isWearingTzhaarWeapon(): boolean {
    return this.wearing(['Tzhaar-ket-em', 'Tzhaar-ket-om', 'Tzhaar-ket-om (t)', 'Toktz-xil-ak', 'Toktz-xil-ek', 'Toktz-mej-tal']);
  }

  /**
   * Whether the player is wearing the entire set of obsidian armour.
   * @see https://oldschool.runescape.wiki/w/Obsidian_equipment
   */
  protected isWearingObsidian(): boolean {
    return this.wearingAll(['Obsidian helmet', 'Obsidian platelegs', 'Obsidian platebody']);
  }

  /**
   * Whether the player is wearing a Berserker necklace.
   * @see https://oldschool.runescape.wiki/w/Berserker_necklace
   */
  protected isWearingBerserkerNecklace(): boolean {
    return this.wearing(['Berserker necklace', 'Berserker necklace (or)']);
  }

  /**
   * Whether the player is using an item that acts as a crystal bow for the purpose of its effect.
   * @see https://oldschool.runescape.wiki/w/Crystal_bow
   */
  protected isWearingCrystalBow(): boolean {
    return this.wearing('Crystal bow') || this.allEquippedItems.some((ei) => ei.includes('Bow of faerdhinen'));
  }

  /**
   * Whether the player is using any variant of Osmumten's fang.
   * @see https://oldschool.runescape.wiki/w/Osmumten%27s_fang
   */
  protected isWearingFang(): boolean {
    return this.wearing(["Osmumten's fang", "Osmumten's fang (or)"]);
  }

  protected isWearingAccursedSceptre(): boolean {
    return this.wearing(['Accursed sceptre', 'Accursed sceptre (a)']);
  }

  protected isWearingBlowpipe(): boolean {
    return this.wearing(['Toxic blowpipe', 'Blazing blowpipe']);
  }

  protected isWearingGodsword(): boolean {
    return this.wearing(['Ancient godsword', 'Armadyl godsword', 'Bandos godsword', 'Saradomin godsword', 'Zamorak godsword']);
  }

  /**
   * Whether the player is using any variant of the scythe of vitur.
   * @see https://oldschool.runescape.wiki/w/Scythe_of_vitur
   */
  protected isWearingScythe(): boolean {
    return this.wearing('Scythe of vitur') || this.allEquippedItems.some((ei) => ei.includes('of vitur'));
  }

  /**
   * Standard roll two-hit weapons
   */
  protected isWearingTwoHitWeapon(): boolean {
    return this.wearing([
      "Torag's hammers",
      'Sulphur blades',
      'Glacial temotli',
      'Earthbound tecpatl',
    ]);
  }

  /**
   * Whether the player is using the Keris dagger.
   * @see https://oldschool.runescape.wiki/w/Keris
   */
  protected isWearingKeris(): boolean {
    return this.allEquippedItems.some((ei) => ei.includes('Keris'));
  }

  /**
   * Whether the player is wearing the entire Dharok the Wretched's equipment set.
   * @see https://oldschool.runescape.wiki/w/Dharok_the_Wretched%27s_equipment
   */
  protected isWearingDharok(): boolean {
    return this.wearingAll(["Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe"]);
  }

  /**
   * Whether the player is wearing the entire Verac the Defiled's equipment set.
   * @see https://oldschool.runescape.wiki/w/Verac_the_Defiled%27s_equipment
   */
  protected isWearingVeracs(): boolean {
    return this.wearingAll(["Verac's helm", "Verac's brassard", "Verac's plateskirt", "Verac's flail"]);
  }

  /**
   * Whether the player is wearing the entire Karil the Tainted's equipment set including a damned item.
   * @see https://oldschool.runescape.wiki/w/Karil_the_Tainted%27s_equipment
   */
  protected isWearingKarils(): boolean {
    return this.wearingAll(["Karil's coif", "Karil's leathertop", "Karil's leatherskirt", "Karil's crossbow", 'Amulet of the damned']);
  }

  /**
   * Whether the player is wearing the entire Ahrim the Blighted's equipment set including a damned item.
   * @see https://oldschool.runescape.wiki/w/Ahrim_the_Blighted%27s_equipment
   */

  protected isWearingAhrims(): boolean {
    return this.wearingAll(["Ahrim's staff", "Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", 'Amulet of the damned']);
  }

  /**
   * Whether the player is wearing the entire Torag the Corrupted's equipment set including a damned item.
   * @see https://oldschool.runescape.wiki/w/Torag_the_Corrupted%27s_equipment
   */
  protected isWearingTorags(): boolean {
    return this.wearingAll(["Torag's helm", "Torag's platebody", "Torag's platelegs", "Torag's hammers", 'Amulet of the damned']);
  }

  protected isWearingBloodMoonSet(): boolean {
    return this.wearingAll(['Dual macuahuitl', 'Blood moon helm', 'Blood moon chestplate', 'Blood moon tassets']);
  }

  /**
   * Whether the player is wearing a silver weapon.
   * @see https://oldschool.runescape.wiki/w/Silver_weaponry
   */

  protected isWearingSilverWeapon(): boolean {
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
   * Whether the player is using a vampyrebane weapon capable of full damage against t2 or t3 vampyres
   * @see https://oldschool.runescape.wiki/w/Silver_weaponry
   */
  protected wearingVampyrebane(tier: MonsterAttribute.VAMPYRE_2 | MonsterAttribute.VAMPYRE_3): boolean {
    const t2 = tier === MonsterAttribute.VAMPYRE_2;
    return (t2 || this.isUsingMeleeStyle())
      && this.wearing([
        ...(t2 ? ['Rod of ivandis'] : []),
        'Ivandis flail',
        'Blisterwood sickle',
        'Blisterwood flail',
      ]);
  }

  protected isWearingMsb(): boolean {
    return this.wearing(['Magic shortbow', 'Magic shortbow (i)']);
  }

  protected isWearingMlb(): boolean {
    return this.wearing(['Magic longbow', 'Magic comp bow']);
  }

  /**
   * Whether the player is wearing a leaf-bladed weapon capable of harming leafy monsters.
   * @see https://oldschool.runescape.wiki/w/Leafy_(attribute)
   */
  protected isWearingLeafBladedWeapon(): boolean {
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
  protected isWearingCorpbaneWeapon(): boolean {
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

    // https://twitter.com/JagexAsh/status/1777673598099968104
    if (weapon.name.includes('spear') && weapon.name !== 'Blue moon spear') {
      return isStab;
    }

    if (this.player.style.type === 'magic') {
      return true;
    }

    return false;
  }

  protected isRevWeaponBuffApplicable(): boolean {
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
  protected isWearingRatBoneWeapon(): boolean {
    return this.wearing([
      'Bone mace',
      'Bone shortbow',
      'Bone staff',
    ]);
  }

  protected isChargeSpellApplicable(): boolean {
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
   * Whether the player is wearing the full set of Justiciar armour.
   * @see https://oldschool.runescape.wiki/w/Justiciar_armour
   */
  protected isWearingJusticiarArmour(): boolean {
    return this.wearingAll([
      'Justiciar faceguard',
      'Justiciar chestguard',
      'Justiciar legguards',
    ]);
  }

  protected isUsingDemonbane(): boolean {
    switch (this.player.style.type) {
      case 'magic':
        return this.player.spell?.name.includes('Demonbane') || false;

      case 'ranged':
        return this.wearing(['Scorching bow']);

      default:
        return this.wearing(['Silverlight', 'Darklight', 'Arclight', 'Emberlight', 'Bone claws', 'Burning claws']);
    }
  }

  protected isUsingAbyssal(): boolean {
    return this.isUsingMeleeStyle()
      && this.wearing(['Abyssal bludgeon', 'Abyssal dagger', 'Abyssal whip', 'Abyssal tentacle']);
  }

  protected tdUnshieldedBonusApplies(): boolean {
    if (this.monster.name !== 'Tormented Demon' || this.monster.inputs.phase !== 'Unshielded') {
      return false;
    }

    switch (this.player.style.type) {
      case 'magic':
        return isDefined(this.player.spell);

      case 'ranged':
        return getRangedDamageType(this.player.equipment.weapon!.category) === 'heavy';

      case 'crush':
        return true;

      default:
        return false;
    }
  }

  protected isAmmoInvalid(): boolean {
    return ammoApplicability(this.player.equipment.weapon?.id, this.player.equipment.ammo?.id) === AmmoApplicability.INVALID;
  }

  protected isImmuneToNormalBurns(): boolean {
    return this.monster.immunities.burn === BurnImmunity.NORMAL
      || this.isImmuneToStrongBurns();
  }

  protected isImmuneToStrongBurns(): boolean {
    return this.monster.immunities.burn === BurnImmunity.STRONG
      || IMMUNE_TO_BURN_DAMAGE_NPC_IDS.includes(this.monster.id);
  }

  protected addIssue(type: UserIssueType, message: string) {
    this.userIssues.push({ type, message, loadout: this.opts.loadoutName });
  }

  protected demonbaneVulnerability(): number {
    if (this.monster.id === -1 && this.monster.inputs.demonbaneVulnerability !== undefined) {
      return this.monster.inputs.demonbaneVulnerability;
    } if (this.monster.name === 'Duke Sucellus') {
      return 70;
    } if (YAMA_IDS.includes(this.monster.id)) {
      return 120;
    } if (YAMA_VOID_FLARE_IDS.includes(this.monster.id)) {
      return 200;
    }

    return 100;
  }

  private sanitizeInputs() {
    const eq = this.player.equipment;

    if (this.monster.attributes.includes(MonsterAttribute.DEMON)) {
      // make sure demonbane effectiveness is set and uses the right value
      this.monster = {
        ...this.monster,
        inputs: {
          ...this.monster.inputs,
          demonbaneVulnerability: this.demonbaneVulnerability(),
        },
      };
    }

    // make sure monsterCurrentHp is set and valid
    if (!this.monster.inputs.monsterCurrentHp || this.monster.inputs.monsterCurrentHp > this.monster.skills.hp) {
      this.monster = {
        ...this.monster,
        inputs: {
          ...this.monster.inputs,
          monsterCurrentHp: this.monster.skills.hp,
        },
      };
    }

    // specs are never manual cast, although the base loadout can be at the same time
    if (this.opts.usingSpecialAttack) {
      if (this.player.style.stance === 'Manual Cast') {
        this.player = {
          ...this.player,
          style: getCombatStylesForCategory(eq.weapon?.category || EquipmentCategory.UNARMED)[0],
          spell: null,
        };
      }

      // these staves use a built-in spell for their spec
      if (['Accursed sceptre (a)', 'Eldritch nightmare staff', 'Volatile nightmare staff'].includes(eq.weapon?.name || '')) {
        this.player = {
          ...this.player,
          style: getCombatStylesForCategory(EquipmentCategory.POWERED_STAFF)[0],
          spell: null,
        };
      }
    }

    // we should do clone-edits here to prevent affecting ui state
    if (!CAST_STANCES.includes(this.player.style.stance)) {
      this.player = {
        ...this.player,
        spell: null,
      };
    }

    if (this.player.style.stance !== 'Manual Cast' && this.isAmmoInvalid()) {
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

    // some weapons are only available to use against certain monsters
    if (
      (this.wearing('Dawnbringer') && (this.monster.name !== 'Verzik Vitur' || !this.monster.version?.includes('Phase 1'))
      || (this.wearing('Holy water') && !this.monster.attributes.includes(MonsterAttribute.DEMON)))
    ) {
      this.addIssue(UserIssueType.WEAPON_WRONG_MONSTER, 'This weapon cannot be used against the select monster.');
    }

    // Some set effects are currently not accounted for
    if (
      this.wearingAll(['Blue moon helm', 'Blue moon chestplate', 'Blue moon tassets', 'Blue moon spear'])
      || this.wearingAll(['Eclipse moon helm', 'Eclipse moon chestplate', 'Eclipse moon tassets', 'Eclipse atlatl'])
    ) {
      this.addIssue(UserIssueType.EQUIPMENT_SET_EFFECT_UNSUPPORTED, 'The calculator currently does not account for your equipment set effect.');
    }
    if (this.wearing('Ring of recoil') || this.wearing('Ring of suffering (i)') || this.wearing('Ring of suffering')) {
      this.addIssue(UserIssueType.RING_RECOIL_UNSUPPORTED, 'The calculator does not account for recoil damage.');
    }
    if (this.wearing('Echo boots')) {
      this.addIssue(UserIssueType.FEET_RECOIL_UNSUPPORTED, 'The calculator does not account for recoil damage.');
    }
  }
}
