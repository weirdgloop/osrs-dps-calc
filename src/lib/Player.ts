import { getCombatStylesForCategory, PotionMap } from '@/utils';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { IPlayer, PlayerEquipment } from '@/types/Player';
import { PartialDeep } from 'type-fest';
import { makeAutoObservable } from 'mobx';
import Potion from '@/enums/Potion';
import {
  ARM_PRAYERS,
  BRAIN_PRAYERS,
  DEFENSIVE_PRAYERS,
  OFFENSIVE_PRAYERS,
  OVERHEAD_PRAYERS,
  Prayer,
} from '@/enums/Prayer';
import { Spell } from '@/types/Spell';
import merge from 'lodash.mergewith';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import { Monster } from '@/types/Monster';

class Player implements IPlayer {
  public name = 'Loadout 1';

  public username = '';

  public style = getCombatStylesForCategory(EquipmentCategory.NONE)[0];

  public skills = {
    atk: 99,
    def: 99,
    hp: 99,
    magic: 99,
    prayer: 99,
    ranged: 99,
    str: 99,
    mining: 99,
  };

  public equipment = {
    ammo: null,
    body: null,
    cape: null,
    feet: null,
    hands: null,
    head: null,
    legs: null,
    neck: null,
    ring: null,
    shield: null,
    weapon: null,
  } as PlayerEquipment;

  public prayers: Prayer[] = [];

  public bonuses = {
    str: 0,
    ranged_str: 0,
    magic_str: 0,
    prayer: 0,
  };

  public defensive = {
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    ranged: 0,
  };

  public offensive = {
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    ranged: 0,
  };

  public buffs = {
    potions: [] as Potion[],
    onSlayerTask: true,
    inWilderness: false,
    kandarinDiary: false,
    chargeSpell: false,
    markOfDarknessSpell: false,
    forinthrySurge: false,
    soulreaperStacks: 0,
    usingSunfireRunes: false,
  };

  public spell: Spell | null = null;

  constructor(props?: PartialDeep<IPlayer>) {
    if (props) merge(this, props);

    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Returns a new empty Player class with the specified name
   * @param name
   */
  public static newEmpty(name?: string) {
    return new Player({ name: name || 'New Loadout' });
  }

  get boosts() {
    const ret = {
      atk: 0, def: 0, hp: 0, magic: 0, prayer: 0, ranged: 0, str: 0, mining: 0,
    };

    for (const p of this.buffs.potions) {
      const result = PotionMap[p].calculateFn(this.skills);
      for (const k of Object.keys(result)) {
        const r = result[k as keyof typeof result] as number;
        if (r > ret[k as keyof typeof ret]!) {
          // If this skill's boost is higher than what it already is, then change it
          ret[k as keyof typeof ret] = result[k as keyof typeof result] as number;
        }
      }
    }

    return ret;
  }

  /**
   * Toggle a potion, with logic to remove from or add to the potions array depending on if it is already in there.
   * @param potion
   */
  togglePotion(potion: Potion) {
    const isToggled = this.buffs.potions.includes(potion);
    if (isToggled) {
      this.buffs.potions = this.buffs.potions.filter((p) => p !== potion);
    } else {
      this.buffs.potions = [...this.buffs.potions, potion];
    }
  }

  /**
   * Toggle a prayer, with logic to remove from or add to the prayers array depending on if it is already in there.
   * @param prayer
   */
  togglePrayer(prayer: Prayer) {
    const isToggled = this.prayers.includes(prayer);
    if (isToggled) {
      // If we're toggling off an existing prayer, just filter it out from the array
      this.prayers = this.prayers.filter((p) => p !== prayer);
    } else {
      // If we're toggling on a new prayer, let's do some checks to ensure that some prayers cannot be enabled alongside it
      let newPrayers = [...this.prayers];

      // If this is a defensive prayer, disable all other defensive prayers
      if (DEFENSIVE_PRAYERS.includes(prayer)) newPrayers = newPrayers.filter((p) => !DEFENSIVE_PRAYERS.includes(p));

      // If this is an overhead prayer, disable all other overhead prayers
      if (OVERHEAD_PRAYERS.includes(prayer)) newPrayers = newPrayers.filter((p) => !OVERHEAD_PRAYERS.includes(p));

      // If this is an offensive prayer...
      if (OFFENSIVE_PRAYERS.includes(prayer)) {
        newPrayers = newPrayers.filter((p) => {
          // If this is a "brain" prayer, it can only be paired with arm prayers
          if (BRAIN_PRAYERS.includes(prayer)) return !OFFENSIVE_PRAYERS.includes(p) || ARM_PRAYERS.includes(p);
          // If this is an "arm" prayer, it can only be paired with brain prayers
          if (ARM_PRAYERS.includes(prayer)) return !OFFENSIVE_PRAYERS.includes(p) || BRAIN_PRAYERS.includes(p);
          // Otherwise, there are no offensive prayers it can be paired with, disable them all
          return !OFFENSIVE_PRAYERS.includes(p);
        });
      }

      this.prayers = [...newPrayers, prayer];
    }
  }

  /**
   * Clear an equipment slot, removing the item that was inside of it.
   * @param slot
   */
  clearEquipmentSlot(slot: keyof PlayerEquipment) {
    this.update({
      equipment: {
        [slot]: null,
      },
    });
  }

  /**
   * Update this object.
   * @param player
   * @param recalculate Whether to recalculate bonuses.
   * @param monster If we're re-calculating bonuses, pass the monster to calculate against.
   */
  update(player: PartialDeep<Player>, recalculate = true, monster?: Monster) {
    const eq = player.equipment;
    if (eq && (Object.hasOwn(eq, 'weapon') || Object.hasOwn(eq, 'shield'))) {
      const currentWeapon = this.equipment.weapon;
      const newWeapon = player.equipment?.weapon;

      if (newWeapon !== undefined) {
        const oldWeaponCat = currentWeapon?.category || EquipmentCategory.NONE;
        const newWeaponCat = newWeapon?.category || EquipmentCategory.NONE;
        if ((newWeaponCat !== undefined) && (newWeaponCat !== oldWeaponCat) && !player.style) {
          // If the weapon slot category was changed, we should reset the player's selected combat style to the first one that exists.
          player.style = getCombatStylesForCategory(newWeaponCat)[0];
        }
      }

      const currentShield = this.equipment.shield;
      const newShield = player.equipment?.shield;

      // Special handling for if a shield is equipped, and we're using a two-handed weapon
      if (player.equipment?.shield && newShield !== undefined && currentWeapon?.isTwoHanded) {
        player = { ...player, equipment: { ...player.equipment, weapon: null } };
      }
      // ...and vice-versa
      if (player.equipment?.weapon && newWeapon?.isTwoHanded && currentShield?.name !== '') {
        player = { ...player, equipment: { ...player.equipment, shield: null } };
      }
    }

    merge(this, player);
    if (recalculate && monster && (eq || Object.hasOwn(player, 'spell'))) {
      this.recalculateGearBonuses(monster);
    }
  }

  recalculateGearBonuses(monster: Monster) {
    const totals = calculateEquipmentBonusesFromGear(this, monster);
    this.update({
      bonuses: totals.bonuses,
      offensive: totals.offensive,
      defensive: totals.defensive,
    });
  }

  rename(name: string) {
    const trimmedName = name.trim();
    this.name = trimmedName ?? 'New Loadout';
  }
}

export default Player;
