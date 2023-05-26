import {makeAutoObservable, toJS} from 'mobx';
import React, {createContext, useContext} from 'react';
import {PartialDeep} from 'type-fest';
import {Potion} from './enums/Potion';
import * as localforage from 'localforage';
import {Calculator, Preferences, State, UI} from '@/types/State';
import {ARM_PRAYERS, BRAIN_PRAYERS, DEFENSIVE_PRAYERS, OFFENSIVE_PRAYERS, Prayer} from './enums/Prayer';
import merge from 'lodash.mergewith';
import {EquipmentCategory, getCombatStylesForCategory} from './enums/EquipmentCategory';
import {EquipmentPiece, Player, PlayerBonuses, PlayerDefensive, PlayerEquipment, PlayerOffensive} from '@/types/Player';
import {Monster} from '@/types/Monster';
import {MonsterAttribute} from "@/enums/MonsterAttribute";
import {toast} from "react-toastify";
import {fetchPlayerSkills} from "@/utils";

const calculateEquipmentBonuses = (eq: EquipmentPiece[]) => {
  let b: {
    bonuses: PlayerBonuses,
    offensive: PlayerOffensive,
    defensive: PlayerDefensive
  } = {
    bonuses: {
      str: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.str, 0),
      magic_str: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.magic_str, 0),
      ranged_str: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.ranged_str, 0),
      prayer: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive.prayer, 0),
    },
    offensive: {
      slash: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.slash, 0),
      stab: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.stab, 0),
      crush: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.crush, 0),
      ranged: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.ranged, 0),
      magic: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive.magic, 0),
    },
    defensive: {
      slash: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive.slash, 0),
      stab: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive.stab, 0),
      crush: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive.crush, 0),
      ranged: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive.ranged, 0),
      magic: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive.magic, 0),
    }
  };

  return b;
}

const emptyEquipmentSlot: EquipmentPiece = {
  name: '',
  image: '',
  category: EquipmentCategory.NONE,
  offensive: {
    crush: 0,
    magic_str: 0,
    magic: 0,
    ranged: 0,
    ranged_str: 0,
    slash: 0,
    stab: 0,
    str: 0
  },
  defensive: {
    crush: 0,
    magic: 0,
    ranged: 0,
    slash: 0,
    stab: 0,
    prayer: 0
  },
  isTwoHanded: false
}

const generateInitialEquipment = () => {
  let slots = ['head', 'cape', 'neck', 'ammo', 'weapon', 'body', 'shield', 'legs', 'hands', 'feet', 'ring'];
  let equipment: {[k: string]: any} = {};
  for (let s of slots) {
    equipment[s] = emptyEquipmentSlot;
  }
  return equipment as PlayerEquipment;
}

const generateEmptyPlayer: () => Player = () => {
  return {
    username: '',
    style: getCombatStylesForCategory(EquipmentCategory.NONE)[0],
    skills: {
      atk: 1,
      def: 1,
      hp: 10,
      magic: 1,
      prayer: 1,
      ranged: 1,
      str: 1,
    },
    equipment: generateInitialEquipment(),
    prayers: [],
    bonuses: {
      str: 0,
      ranged_str: 0,
      magic_str: 0,
      prayer: 0,
    },
    defensive: {
      stab: 0,
      slash: 0,
      crush: 0,
      magic: 0,
      ranged: 0,
    },
    offensive: {
      stab: 0,
      slash: 0,
      crush: 0,
      magic: 0,
      ranged: 0,
    },
    buffs: {
      potions: [],
      onSlayerTask: false,
      inWilderness: false,
      kandarinDiary: false,
      chargeSpell: false,
    },
    spell: {
      name: '',
      image: '',
      max_hit: 0,
      spellbook: 'standard',
    }
  }
}

class GlobalState implements State {
  monster: Monster = {
    name: '',
    size: 0,
    skills: {
      atk: 0,
      def: 0,
      hp: 0,
      magic: 0,
      ranged: 0,
      str: 0,
    },
    offensive: {
      atk: 0,
      magic: 0,
      magic_str: 0,
      ranged: 0,
      ranged_str: 0,
      str: 0,
    },
    defensive: {
      crush: 0,
      magic: 0,
      ranged: 0,
      slash: 0,
      stab: 0,
    },
    attributes: []
  }

  loadouts: Player[] = [
    generateEmptyPlayer()
  ]

  selectedLoadout = 0;

  ui: UI = {
    showPreferencesModal: false,
    potionsScrollPosition: 0,
  }

  prefs: Preferences = {
    allowEditingPlayerStats: false,
    allowEditingMonsterStats: false,
    rememberUsername: true,
    showHitDistribution: false,
    showLoadoutComparison: false
  }

  calc: Calculator = {
    loadouts: [
      {
        npcDefRoll: 0,
        maxHit: 0,
        maxAttackRoll: 0
      }
    ]
  }

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  /**
   * Get the currently selected player (loadout)
   */
  get player() {
    return this.loadouts[this.selectedLoadout];
  }

  /**
   * Get the available combat styles for the currently equipped weapon
   * @see https://oldschool.runescape.wiki/w/Combat_Options
   */
  get availableCombatStyles() {
    return getCombatStylesForCategory(this.player.equipment.weapon.category);
  }

  /**
   * Return the player's worn equipment bonuses. This is NOT the same as the player's current bonuses overall.
   * For that, interpret the values in `store.player` for the current loadout.
   */
  get equipmentBonuses() {
    return calculateEquipmentBonuses(Object.values(toJS(this.player.equipment)));
  }

  updateUIState(ui: PartialDeep<UI>) {
    this.ui = Object.assign(this.ui, ui);
  }

  updateCalculator(calc: PartialDeep<Calculator>) {
    this.calc = Object.assign(this.calc, calc);
  }

  loadPreferences() {
    localforage.getItem('dps-calc-prefs').then((v) => {
      this.updatePreferences(v as PartialDeep<Preferences>);
    }).catch((e) => {
      console.error(e);
      // TODO maybe some handling here
    })
  }

  async fetchCurrentPlayerSkills() {
    const username = this.player.username;

    try {
      const res = await toast.promise(
        fetchPlayerSkills(username),
        {
          pending: `Fetching player skills...`,
          success: `Successfully fetched player skills for ${username}!`,
          error: `Error fetching player skills`
        },
        {
          toastId: 'skills-fetch'
        }
      )

      if (res) this.updatePlayer({skills: res});
    } catch (e) {
      console.error(e);
    }
  }

  updatePreferences(pref: PartialDeep<Preferences>) {
    // Update local state store
    this.prefs = Object.assign(this.prefs, pref);

    if (pref.allowEditingPlayerStats === false) {
      // Reset player bonuses to their worn equipment
      this.player.bonuses = this.equipmentBonuses.bonuses;
      this.player.offensive = this.equipmentBonuses.offensive;
      this.player.defensive = this.equipmentBonuses.defensive;
    }

    // Save to browser storage
    localforage.setItem('dps-calc-prefs', toJS(this.prefs)).catch((e) => {
      console.error(e);
      // TODO something that isn't this
      alert('Could not persist preferences to browser. Make sure our site has permission to do this.');
    })
  }

  /**
   * Toggle a potion, with logic to remove from or add to the potions array depending on if it is already in there.
   * @param potion
   */
  togglePlayerPotion(potion: Potion) {
    const isToggled = this.player.buffs.potions.includes(potion);
    if (isToggled) {
      this.player.buffs.potions = this.player.buffs.potions.filter((p) => p !== potion);
    } else {
      this.player.buffs.potions = [...this.player.buffs.potions, potion];
    }
  }

  /**
   * Toggle a prayer, with logic to remove from or add to the prayers array depending on if it is already in there.
   * @param prayer
   */
  togglePlayerPrayer(prayer: Prayer) {
    const isToggled = this.player.prayers.includes(prayer);
    if (isToggled) {
      // If we're toggling off an existing prayer, just filter it out from the array
      this.player.prayers = this.player.prayers.filter((p) => p !== prayer);
    } else {
      // If we're toggling on a new prayer, let's do some checks to ensure that some prayers cannot be enabled alongside it
      let newPrayers = [...this.player.prayers];

      // If this is a defensive prayer, disable all other defensive prayers
      if (DEFENSIVE_PRAYERS.includes(prayer)) newPrayers = newPrayers.filter((p) => !DEFENSIVE_PRAYERS.includes(p));

      // If this is an offensive prayer...
      if (OFFENSIVE_PRAYERS.includes(prayer)) {
        newPrayers = newPrayers.filter((p) => {
          // If this is a "brain" prayer, it can only be paired with arm prayers
          if (BRAIN_PRAYERS.includes(prayer)) return !OFFENSIVE_PRAYERS.includes(p) || ARM_PRAYERS.includes(p);
          // If this is an "arm" prayer, it can only be paired with brain prayers
          if (ARM_PRAYERS.includes(prayer)) return !OFFENSIVE_PRAYERS.includes(p) || BRAIN_PRAYERS.includes(p);
          // Otherwise, there are no offensive prayers it can be paired with, disable them all
          return !OFFENSIVE_PRAYERS.includes(p);
        })
      }

      this.player.prayers = [...newPrayers, prayer];
    }
  }

  /**
   * Toggle a monster attribute.
   * @param attr
   */
  toggleMonsterAttribute(attr: MonsterAttribute) {
    const isToggled = this.monster.attributes.includes(attr);
    if (isToggled) {
      this.monster.attributes = this.monster.attributes.filter((a) => a !== attr);
    } else {
      this.monster.attributes = [...this.monster.attributes, attr];
    }
  }

  /**
   * Update the player state.
   * @param player
   */
  updatePlayer(player: PartialDeep<Player>) {
    if (
      (player.equipment?.weapon?.category !== undefined) &&
      (player.equipment.weapon.category !== this.player.equipment.weapon.category)
    ) {
      // If the weapon slot category was changed, we should reset the player's selected combat style to the first one that exists.
      player.style = getCombatStylesForCategory(player.equipment.weapon.category)[0];
    }

    // Special handling for if a shield is equipped, and we're using a two-handed weapon
    if (player.equipment?.shield?.name !== '' && this.loadouts[this.selectedLoadout].equipment.weapon.isTwoHanded) {
      player = {...player, equipment: {...player.equipment, weapon: emptyEquipmentSlot}};
    }
    // ...and vice-versa
    if (player.equipment?.weapon?.isTwoHanded && this.loadouts[this.selectedLoadout].equipment.shield.name !== '') {
      player = {...player, equipment: {...player.equipment, shield: emptyEquipmentSlot}};
    }

    this.loadouts[this.selectedLoadout] = merge(this.player, player);
  }

  /**
   * Update the monster state.
   * @param monster
   */
  updateMonster(monster: PartialDeep<Monster>) {
    this.monster = merge(this.monster, monster, (obj, src) => {
      // This check is to ensure that empty arrays always override existing arrays, even if they have values.
      if (Array.isArray(src) && src.length === 0) {
        return src;
      }
    });
  }

  /**
   * Clear an equipment slot, removing the item that was inside of it.
   * @param slot
   */
  clearEquipmentSlot(slot: keyof PlayerEquipment ) {
    this.updatePlayer({
      equipment: {
        [slot]: emptyEquipmentSlot
      }
    })
  }

  setSelectedLoadout(ix: number) {
    this.selectedLoadout = ix;
  }

  deleteLoadout(ix: number) {
    // Sanity check to ensure we can never have less than one loadout
    if (this.loadouts.length === 1) return;

    this.loadouts = this.loadouts.filter((p, i) => i !== ix);
    // If the selected loadout index is equal to or over the index we just remove, shift it down by one, else add one
    if ((this.selectedLoadout >= ix) && ix !== 0) {
      this.selectedLoadout = this.selectedLoadout - 1;
    }
  }

  get canCreateLoadout() {
    return (this.loadouts.length < 5);
  }

  get canRemoveLoadout() {
    return (this.loadouts.length > 1);
  }

  createLoadout(selected?: boolean, cloneIndex?: number) {
    // Do not allow creating a loadout if we're over the limit
    if (!this.canCreateLoadout) return;

    this.loadouts.push((cloneIndex !== undefined) ? toJS(this.loadouts[cloneIndex]) : generateEmptyPlayer());
    if (selected) this.selectedLoadout = (this.loadouts.length - 1);
  }
}

const StoreContext = createContext<GlobalState>(new GlobalState());

const StoreProvider: React.FC<{ store: GlobalState, children: any }> = ({ store, children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  )
}

const useStore = () => {
  return useContext(StoreContext);
}

export { GlobalState, StoreProvider, useStore };