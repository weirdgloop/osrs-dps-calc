import { EquipmentPiece, Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { keys } from '@/utils';
import { AmmoApplicability, ammoApplicability, getCanonicalItem } from '@/lib/Equipment';
import UserIssueType from '@/enums/UserIssueType';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { CAST_STANCES } from '@/lib/constants';
import { UserIssue } from '@/types/State';

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

/**
 * Base class which the other calculators extend.
 */
export default class BaseCalc {
  protected opts: CalcOpts;

  // The player that we're using for this calculation
  protected player: Player;

  // The monster that we're using for this calculation
  protected monster: Monster;

  // Array of the names of all equipped items (for quick checks)
  protected allEquippedItems: string[];

  protected userIssues: UserIssue[] = [];

  constructor(player: Player, monster: Monster, opts: Partial<CalcOpts> = {}) {
    this.opts = {
      ...DEFAULT_OPTS,
      ...opts,
    };

    this.player = player;
    this.monster = monster;

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
    return ['slash', 'crush', 'stab'].includes(this.player.style.type);
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
    return this.wearing(['Smoke battlestaff', 'Mystic smoke staff']);
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

  /**
   * Whether the player is using any variant of the scythe of vitur.
   * @see https://oldschool.runescape.wiki/w/Scythe_of_vitur
   */
  protected isWearingScythe(): boolean {
    return this.wearing('Scythe of vitur') || this.allEquippedItems.some((ei) => ei.includes('of vitur'));
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
   * Whether the player is wearing the entire Karil the Tainted's equipment set.
   * @see https://oldschool.runescape.wiki/w/Karil_the_Tainted%27s_equipment
   */
  protected isWearingKarils(): boolean {
    return this.wearingAll(["Karil's coif", "Karil's leathertop", "Karil's leatherskirt", "Karil's crossbow", 'Amulet of the damned']);
  }

  /**
   * Whether the player is wearing the entire Ahrim the Blighted's equipment set.
   * @see https://oldschool.runescape.wiki/w/Ahrim_the_Blighted%27s_equipment
   */

  protected isWearingAhrims(): boolean {
    return this.wearingAll(["Ahrim's staff", "Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", 'Amulet of the damned']);
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
   * Whether the player is wearing an Ivandis weapon--that is, a weapon capable of harming Tier 3 Vampyres.
   * @see https://oldschool.runescape.wiki/w/Silver_weaponry
   */
  protected isWearingIvandisWeapon(): boolean {
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

    if (weapon.name.includes('spear')) {
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

  protected addIssue(type: UserIssueType, message: string) {
    this.userIssues.push({ type, message, loadout: this.opts.loadoutName });
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
}
