import {IReactionPublic, makeAutoObservable, reaction, toJS} from 'mobx';
import React, {createContext, useContext} from 'react';
import {PartialDeep} from 'type-fest';
import {Potion, PotionMap} from './enums/Potion';
import * as localforage from 'localforage';
import {Calculator, ImportableData, Preferences, State, UI} from '@/types/State';
import {ARM_PRAYERS, BRAIN_PRAYERS, DEFENSIVE_PRAYERS, OFFENSIVE_PRAYERS, Prayer} from './enums/Prayer';
import merge from 'lodash.mergewith';
import {EquipmentCategory, getCombatStylesForCategory} from './enums/EquipmentCategory';
import {
  EquipmentPiece,
  Player,
  PlayerBonuses,
  PlayerDefensive,
  PlayerEquipment,
  PlayerOffensive,
  PlayerSkills
} from '@/types/Player';
import {Monster} from '@/types/Monster';
import {MonsterAttribute} from "@/enums/MonsterAttribute";
import {toast} from "react-toastify";
import {
  fetchPlayerSkills,
  fetchShortlinkData,
  getEquipment,
  getEquipmentForLoadout,
  WORKER_JSON_REPLACER
} from "@/utils";
import {TrailblazerRelic} from "@/enums/TrailblazerRelic";
import {RuinousPower} from "@/enums/RuinousPower";
import {RecomputeValuesRequest, WorkerRequestType} from "@/types/WorkerData";

const calculateEquipmentBonuses = (eq: EquipmentPiece[]) => {
  let b: {
    bonuses: PlayerBonuses,
    offensive: PlayerOffensive,
    defensive: PlayerDefensive
  } = {
    bonuses: {
      str: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[7], 0),
      magic_str: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[1], 0),
      ranged_str: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[4], 0),
      prayer: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive[5], 0),
    },
    offensive: {
      slash: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[5], 0),
      stab: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[6], 0),
      crush: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[0], 0),
      ranged: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[3], 0),
      magic: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.offensive[2], 0),
    },
    defensive: {
      slash: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive[3], 0),
      stab: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive[4], 0),
      crush: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive[0], 0),
      ranged: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive[2], 0),
      magic: eq.reduce((acc: number, curr: EquipmentPiece) => acc + curr.defensive[1], 0),
    }
  };

  return b;
}

const generateInitialEquipment = () => {
  let slots = ['head', 'cape', 'neck', 'ammo', 'weapon', 'body', 'shield', 'legs', 'hands', 'feet', 'ring'];
  let equipment: {[k: string]: any} = {};
  for (let s of slots) {
    equipment[s] = null;
  }
  return equipment as PlayerEquipment;
}

const generateEmptyPlayer: () => Player = () => {
  return {
    username: '',
    style: getCombatStylesForCategory(EquipmentCategory.NONE)[0],
    skills: {
      atk: 99,
      def: 99,
      hp: 99,
      magic: 99,
      prayer: 99,
      ranged: 99,
      str: 99,
    },
    boosts: {
      atk: 0,
      def: 0,
      hp: 0,
      magic: 0,
      prayer: 0,
      ranged: 0,
      str: 0,
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
    },
    trailblazerRelics: [],
    ruinousPowers: []
  }
}

class GlobalState implements State {
  monster: Monster = {
    id: 415,
    name: 'Abyssal demon',
    image: 'Abyssal demon.png',
    size: 1,
    skills: {
      atk: 97,
      def: 135,
      hp: 150,
      magic: 1,
      ranged: 1,
      str: 67,
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
      crush: 20,
      magic: 0,
      ranged: 20,
      slash: 20,
      stab: 20,
    },
    attributes: ['demon'],
    invocationLevel: 0
  }

  loadouts: Player[] = [
    generateEmptyPlayer()
  ]

  selectedLoadout = 0;

  ui: UI = {
    showPreferencesModal: false,
    username: '',
  }

  prefs: Preferences = {
    advancedMode: false,
    rememberUsername: true,
    showHitDistribution: false,
    showLoadoutComparison: false,
    showTtkComparison: false,
    hitDistsHideZeros: false,
  }

  calc: Calculator = {
    loadouts: [
      {
        npcDefRoll: 0,
        maxHit: 0,
        maxAttackRoll: 0,
        accuracy: 0,
        dps: 0,
        ttk: 0,
        hitDist: [],
        ttkDist: undefined,
      }
    ]
  }

  worker: Worker | null = null

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});

    const recomputeBoosts = () => {
      // Re-compute the player's boost values.
      let boosts: PlayerSkills = {atk: 0, def: 0, hp: 0, magic: 0, prayer: 0, ranged: 0, str: 0}

      for (let p of this.player.buffs.potions) {
        let result = PotionMap[p].calculateFn(this.player.skills);
        for (let k of Object.keys(result)) {
          let r = result[k as keyof typeof result] as number;
          if (r > boosts[k as keyof typeof boosts]) {
            // If this skill's boost is higher than what it already is, then change it
            boosts[k as keyof typeof boosts] = result[k as keyof typeof result] as number;
          }
        }
      }

      this.updatePlayer({boosts: boosts});
    };

    const triggers: ((r: IReactionPublic) => any)[] = [
      () => toJS(this.player.skills),
      () => toJS(this.player.buffs.potions),
    ];
    triggers.map(t => reaction(t, recomputeBoosts, {fireImmediately: true}));
  }

  /**
   * Get the currently selected player (loadout)
   */
  get player() {
    return this.loadouts[this.selectedLoadout];
  }

  /**
   * Returns the data for the currently equipped items
   */
  get equipmentData() {
    return getEquipmentForLoadout(this.player);
  }

  /**
   * Get the available combat styles for the currently equipped weapon
   * @see https://oldschool.runescape.wiki/w/Combat_Options
   */
  get availableCombatStyles() {
    const cat = this.player.equipment.weapon ? getEquipment(this.player.equipment.weapon).category : EquipmentCategory.NONE;
    return getCombatStylesForCategory(cat);
  }

  /**
   * Return the player's worn equipment bonuses. This is NOT the same as the player's current bonuses overall.
   * For that, interpret the values in `store.player` for the current loadout.
   */
  get equipmentBonuses() {
    return calculateEquipmentBonuses(Object.values(this.equipmentData).filter((v) => {
      return (v !== null && v !== undefined);
    }) as EquipmentPiece[]);
  }

  /**
   * Return the player's skill bonuses.
   * @param ui
   */

  updateUIState(ui: PartialDeep<UI>) {
    this.ui = Object.assign(this.ui, ui);
  }

  updateCalculator(calc: PartialDeep<Calculator>) {
    this.calc = Object.assign(this.calc, calc);
  }

  setWorker(worker: Worker | null) {
    this.worker = worker;
  }

  async loadShortlink(linkId: string) {
    let data: ImportableData;
    try {
      data = await fetchShortlinkData(linkId);
    } catch (e) {
      toast.error('Failed to load shared data.', {toastId: 'shortlink-fail'})
      return;
    }

    /**
     * For future reference: if we ever change the schema of the loadouts or the monster object,
     * then some of the JSON data we store for shortlinks will be incorrect. We can handle those instances here, as
     * a sort of "on-demand migration".
     *
     * Also: the reason we're merging the objects below is that we're trying our hardest not to cause the app to
     * error if the JSON data is bad. To achieve that, we do a deep merge of the loadouts and monster objects so that
     * the existing data still remains.
     */

    this.updateImportedData(data);
  }

  updateImportedData(data: ImportableData) {
    this.selectedLoadout = data.selectedLoadout;
    this.loadouts = merge(this.loadouts, data.loadouts);
    this.monster = merge(this.monster, data.monster);
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
    const username = this.ui.username;

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

    if (pref && pref.hasOwnProperty('advancedMode')) {
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
      // If there are Ruinous Powers, disable them.
      if (this.player.ruinousPowers.length > 0) {
        this.player.ruinousPowers = [];
        toast.info('Switched to the normal prayer book', {toastId: 'prayer-switch'});
      }

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
   * Toggle a Trailblazer League relic.
   * @param relic
   */
  togglePlayerTrailblazerRelic(relic: TrailblazerRelic) {
    const isToggled = this.player.trailblazerRelics.includes(relic);
    if (isToggled) {
      this.player.trailblazerRelics = this.player.trailblazerRelics.filter((r) => r !== relic);
    } else {
      this.player.trailblazerRelics = [...this.player.trailblazerRelics, relic];
    }
  }

  /**
   * Toggle a Ruinous Power prayer.
   * @param power
   */
  togglePlayerRuinousPower(power: RuinousPower) {
    const isToggled = this.player.ruinousPowers.includes(power);
    if (isToggled) {
      this.player.ruinousPowers = this.player.ruinousPowers.filter((r) => r !== power);
    } else {
      // If there are normal prayers, disable them.
      if (this.player.prayers.length > 0) {
        this.player.prayers = [];
        toast.info('Switched to the Ruinous Powers prayer book', {toastId: 'prayer-switch'});
      }

      this.player.ruinousPowers = [...this.player.ruinousPowers, power];
    }
  }

  /**
   * Update the player state.
   * @param player
   */
  updatePlayer(player: PartialDeep<Player>) {
    if (Object.hasOwn(player.equipment || {}, 'weapon')) {
      const currentWeapon = this.equipmentData.weapon;
      const newWeapon = player.equipment?.weapon ? getEquipment(player.equipment.weapon) : {} as EquipmentPiece;

      if (newWeapon !== undefined) {
        const oldWeaponCat = currentWeapon?.category || EquipmentCategory.NONE;
        const newWeaponCat = newWeapon.category || EquipmentCategory.NONE;
        if ((newWeaponCat !== undefined) && (newWeaponCat !== oldWeaponCat)) {
          // If the weapon slot category was changed, we should reset the player's selected combat style to the first one that exists.
          player.style = getCombatStylesForCategory(newWeaponCat)[0];
        }
      }

      const currentShield = this.equipmentData.shield;
      const newShield = player.equipment?.shield ? getEquipment(player.equipment.shield) : {} as EquipmentPiece;

      // Special handling for if a shield is equipped, and we're using a two-handed weapon
      if (player.equipment?.shield && newShield.name !== '' && currentWeapon?.isTwoHanded) {
        player = {...player, equipment: {...player.equipment, weapon: null}};
      }
      // ...and vice-versa
      if (player.equipment?.weapon && newWeapon?.isTwoHanded && currentShield?.name !== '') {
        player = {...player, equipment: {...player.equipment, shield: null}};
      }
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
        [slot]: null
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

  doWorkerRecompute() {
    if (this.worker) {
      const loadouts = this.loadouts.map((i) => {
        return {
          ...i,
          equipment: getEquipmentForLoadout(i)
        }
      });

      this.worker.postMessage(JSON.stringify({
        type: WorkerRequestType.RECOMPUTE_VALUES,
        data: {
          loadouts,
          monster: this.monster,
          calcOpts: {
            includeTtkDist: this.prefs.showTtkComparison,
          },
        }
      } as RecomputeValuesRequest, WORKER_JSON_REPLACER))
    }
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
