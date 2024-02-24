import {
  IReactionPublic, makeAutoObservable, reaction, toJS,
} from 'mobx';
import React, { createContext, useContext, useState } from 'react';
import { PartialDeep } from 'type-fest';
import * as localforage from 'localforage';
import {
  CalculatedLoadout, Calculator, ImportableData, Preferences, State, UI, UserIssue,
} from '@/types/State';
import merge from 'lodash.mergewith';
import { Player, PlayerEquipment, PlayerSkills } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { toast } from 'react-toastify';
import {
  Debouncer, fetchPlayerSkills, fetchShortlinkData, getCombatStylesForCategory, PotionMap,
} from '@/utils';
import { ComputeBasicRequest, ComputeReverseRequest, WorkerRequestType } from '@/worker/CalcWorkerTypes';
import getMonsters from '@/lib/Monsters';
import { availableEquipment, calculateEquipmentBonusesFromGear } from '@/lib/Equipment';
import { CalcWorker } from '@/worker/CalcWorker';
import { spellByName } from '@/types/Spell';
import { EquipmentCategory } from './enums/EquipmentCategory';
import {
  ARM_PRAYERS,
  BRAIN_PRAYERS,
  DEFENSIVE_PRAYERS,
  OFFENSIVE_PRAYERS,
  OVERHEAD_PRAYERS,
  Prayer,
} from './enums/Prayer';
import Potion from './enums/Potion';
import { WikiSyncer, startPollingForRuneLite } from './lib/WikiSyncer';

const CALC_DEBOUNCE_MS: number = 250;

const EMPTY_CALC_LOADOUT = {} as CalculatedLoadout;

const generateInitialEquipment = () => {
  const initialEquipment: PlayerEquipment = {
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
  };
  return initialEquipment;
};

export const generateEmptyPlayer = (name?: string) => ({
  name: name ?? 'Loadout 1',
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
    mining: 99,
  },
  boosts: {
    atk: 0,
    def: 0,
    hp: 0,
    magic: 0,
    prayer: 0,
    ranged: 0,
    str: 0,
    mining: 0,
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
    onSlayerTask: true,
    inWilderness: false,
    kandarinDiary: false,
    chargeSpell: false,
    markOfDarknessSpell: false,
    forinthrySurge: false,
    soulreaperStacks: 0,
  },
  spell: null,
});

class GlobalState implements State {
  monster: Monster = {
    id: 415,
    name: 'Abyssal demon',
    version: 'Standard',
    image: 'Abyssal demon.png',
    size: 1,
    speed: 4,
    style: 'stab',
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
    attributes: [MonsterAttribute.DEMON],
    inputs: {
      isFromCoxCm: false,
      toaInvocationLevel: 0,
      toaPathLevel: 0,
      partyMaxCombatLevel: 126,
      partyAvgMiningLevel: 99,
      partyMaxHpLevel: 99,
      partySize: 1,
      monsterCurrentHp: 150,
      defenceReductions: {
        vulnerability: false,
        accursed: false,
        dwh: 0,
        arclight: 0,
        bgs: 0,
      },
    },
  };

  loadouts: Player[] = [
    generateEmptyPlayer(),
  ];

  selectedLoadout = 0;

  ui: UI = {
    showPreferencesModal: false,
    showShareModal: false,
    username: '',
  };

  prefs: Preferences = {
    manualMode: false,
    rememberUsername: true,
    showHitDistribution: false,
    showLoadoutComparison: false,
    showTtkComparison: false,
    showNPCVersusPlayerResults: false,
    hitDistsHideZeros: false,
  };

  calc: Calculator = {
    loadouts: [
      {
        npcDefRoll: 0,
        maxHit: 0,
        maxAttackRoll: 0,
        npcMaxHit: 0,
        npcMaxAttackRoll: 0,
        npcDps: 0,
        npcAccuracy: 0,
        playerDefRoll: 0,
        accuracy: 0,
        dps: 0,
        ttk: 0,
        hitDist: [],
        ttkDist: undefined,
      },
    ],
  };

  private calcWorker!: CalcWorker;

  availableMonsters = getMonsters();

  private _debug: boolean = false;

  rlUsernames: Map<number, WikiSyncer>;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    const recomputeBoosts = () => {
      // Re-compute the player's boost values.
      const boosts: Partial<PlayerSkills> = {
        atk: 0, def: 0, magic: 0, prayer: 0, ranged: 0, str: 0, mining: 0,
      };

      for (const p of this.player.buffs.potions) {
        const result = PotionMap[p].calculateFn(this.player.skills);
        for (const k of Object.keys(result)) {
          const r = result[k as keyof typeof result] as number;
          if (r > boosts[k as keyof typeof boosts]!) {
            // If this skill's boost is higher than what it already is, then change it
            boosts[k as keyof typeof boosts] = result[k as keyof typeof result] as number;
          }
        }
      }

      this.updatePlayer({ boosts });
    };

    const potionTriggers: ((r: IReactionPublic) => unknown)[] = [
      () => toJS(this.player.skills),
      () => toJS(this.player.buffs.potions),
    ];
    potionTriggers.map((t) => reaction(t, recomputeBoosts, { fireImmediately: false }));

    // for toa monster + shadow handling
    const equipmentTriggers: ((r: IReactionPublic) => unknown)[] = [
      () => toJS(this.monster),
    ];
    equipmentTriggers.map((t) => reaction(t, () => {
      if (!this.prefs.manualMode) {
        this.recalculateEquipmentBonusesFromGearAll();
      }
    }));

    // reset monster current hp when selecting a new monster
    const monsterHpTriggers: ((r: IReactionPublic) => unknown)[] = [
      () => toJS(this.monster.id),
    ];
    monsterHpTriggers.map((t) => reaction(t, () => {
      this.monster.inputs.monsterCurrentHp = this.monster.skills.hp;
    }));

    this.rlUsernames = startPollingForRuneLite();
  }

  set debug(debug: boolean) {
    this._debug = debug;
  }

  get debug(): boolean {
    return this._debug;
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
    return this.player.equipment;
  }

  /**
   * Get the user's current issues based on their calculated loadouts
   */
  get userIssues() {
    let is: UserIssue[] = [];
    for (const l of Object.values(this.calc.loadouts)) {
      if (l.userIssues) is = [...is, ...l.userIssues];
    }
    return is;
  }

  /**
   * Get the available combat styles for the currently equipped weapon
   * @see https://oldschool.runescape.wiki/w/Combat_Options
   */
  get availableCombatStyles() {
    const cat = this.player.equipment.weapon?.category || EquipmentCategory.NONE;
    return getCombatStylesForCategory(cat);
  }

  /**
   * Whether the currently selected monster has non-standard mechanics or behaviour.
   * In this case, we should hide UI elements relating to reverse DPS/damage taken metrics.
   */
  get isNonStandardMonster() {
    return !['slash', 'crush', 'stab', 'magic', 'ranged'].includes(this.monster.style || '');
  }

  setCalcWorker(worker: CalcWorker) {
    if (this.calcWorker) {
      console.warn('[GlobalState] CalcWorker is already set!');
    }
    worker.initWorker();
    worker.setDebouncer(new Debouncer(CALC_DEBOUNCE_MS));
    this.calcWorker = worker;
  }

  recalculateEquipmentBonusesFromGear(loadoutIx?: number) {
    loadoutIx = loadoutIx !== undefined ? loadoutIx : this.selectedLoadout;

    const totals = calculateEquipmentBonusesFromGear(this.loadouts[loadoutIx], this.monster);
    this.updatePlayer({
      bonuses: totals.bonuses,
      offensive: totals.offensive,
      defensive: totals.defensive,
    }, loadoutIx);
  }

  recalculateEquipmentBonusesFromGearAll() {
    this.loadouts.forEach((_, i) => this.recalculateEquipmentBonusesFromGear(i));
  }

  updateUIState(ui: PartialDeep<UI>) {
    this.ui = Object.assign(this.ui, ui);
  }

  updateCalcResults(calc: PartialDeep<Calculator>) {
    this.calc = merge(this.calc, calc, (obj, src, key) => {
      // When we're handling the details array, merge the obj + src together instead of replacing
      if (key === 'details' && Array.isArray(src) && Array.isArray(obj)) {
        return [...obj, ...src];
      }
      return undefined;
    });
  }

  async loadShortlink(linkId: string) {
    let data: ImportableData;

    await toast.promise(async () => {
      data = await fetchShortlinkData(linkId);

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
    }, {
      pending: 'Loading data from shared link...',
      success: 'Loaded data from shared link!',
      error: 'Failed to load shared link data. Please try again.',
    }, {
      toastId: 'shortlink',
    });
  }

  updateImportedData(data: ImportableData) {
    if (data.monster && data.monster.id) {
      const monsterById = getMonsters().find((m) => m.id === data.monster.id);
      if (!monsterById) {
        throw new Error(`Failed to find monster by id '${data.monster.id}' from shortlink`);
      }

      // only use the shortlink for user-input fields, trust cdn for others in case they change
      this.updateMonster({
        ...monsterById,
        inputs: data.monster.inputs,
      });
    }

    // Expand some minified fields with thier full metadata
    data.loadouts = data.loadouts.map((loadout, i) => {
      // For each item, if only an item ID is available, load the other data.
      if (loadout.equipment) {
        for (const [k, v] of Object.entries(loadout.equipment)) {
          if (v === null) continue;
          if (Object.keys(v).length === 1 && Object.hasOwn(v, 'id')) {
            const item = availableEquipment.find((eq) => eq.id === v.id);
            loadout.equipment[k as keyof typeof loadout.equipment] = item || null;
          }
        }
      }

      // load the current spell, if applicable
      if (loadout.spell?.name) {
        loadout.spell = spellByName(loadout.spell.name);
      }

      return { name: `Loadout ${i + 1}`, ...loadout };
    });

    // manually recompute equipment in case their metadata has changed since the shortlink was created
    data.loadouts.forEach((p, ix) => {
      if (this.loadouts[ix] === undefined) this.loadouts.push(generateEmptyPlayer());
      this.updatePlayer(p, ix);
    });
    this.recalculateEquipmentBonusesFromGearAll();

    this.selectedLoadout = data.selectedLoadout || 0;
  }

  loadPreferences() {
    localforage.getItem('dps-calc-prefs').then((v) => {
      this.updatePreferences(v as PartialDeep<Preferences>);
    }).catch((e) => {
      console.error(e);
      // TODO maybe some handling here
    });
  }

  async fetchCurrentPlayerSkills() {
    const { username } = this.ui;

    try {
      const res = await toast.promise(
        fetchPlayerSkills(username),
        {
          pending: 'Fetching player skills...',
          success: `Successfully fetched player skills for ${username}!`,
          error: 'Error fetching player skills',
        },
        {
          toastId: 'skills-fetch',
        },
      );

      if (res) this.updatePlayer({ skills: res });
    } catch (e) {
      console.error(e);
    }
  }

  updatePreferences(pref: PartialDeep<Preferences>) {
    // Update local state store
    this.prefs = Object.assign(this.prefs, pref);

    if (pref && Object.prototype.hasOwnProperty.call(pref, 'manualMode')) {
      // Reset player bonuses to their worn equipment
      this.recalculateEquipmentBonusesFromGearAll();
    }

    // Save to browser storage
    localforage.setItem('dps-calc-prefs', toJS(this.prefs)).catch((e) => {
      console.error(e);
      // TODO something that isn't this
      // eslint-disable-next-line no-alert
      alert('Could not persist preferences to browser. Make sure our site has permission to do this.');
    });
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
   * @param loadoutIx Which loadout to update. Defaults to the current selected loadout.
   */
  updatePlayer(player: PartialDeep<Player>, loadoutIx?: number) {
    loadoutIx = loadoutIx !== undefined ? loadoutIx : this.selectedLoadout;

    const eq = player.equipment;
    if (eq && (Object.hasOwn(eq, 'weapon') || Object.hasOwn(eq, 'shield'))) {
      const currentWeapon = this.loadouts[loadoutIx].equipment.weapon;
      const newWeapon = player.equipment?.weapon;

      if (newWeapon !== undefined) {
        const oldWeaponCat = currentWeapon?.category || EquipmentCategory.NONE;
        const newWeaponCat = newWeapon?.category || EquipmentCategory.NONE;
        if ((newWeaponCat !== undefined) && (newWeaponCat !== oldWeaponCat)) {
          // If the weapon slot category was changed, we should reset the player's selected combat style to the first one that exists.
          player.style = getCombatStylesForCategory(newWeaponCat)[0];
        }
      }

      const currentShield = this.loadouts[loadoutIx].equipment.shield;
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

    this.loadouts[loadoutIx] = merge(this.loadouts[loadoutIx], player);
    if (!this.prefs.manualMode) {
      if (eq || Object.hasOwn(player, 'spell')) {
        this.recalculateEquipmentBonusesFromGear(loadoutIx);
      }
    }
  }

  /**
   * Update the monster state.
   * @param monster
   */
  updateMonster(monster: PartialDeep<Monster>) {
    // If monster attributes were passed to this function, clear the existing ones
    if (monster.attributes !== undefined) this.monster.attributes = [];

    this.monster = merge(this.monster, monster, (obj, src) => {
      // This check is to ensure that empty arrays always override existing arrays, even if they have values.
      if (Array.isArray(src) && src.length === 0) {
        return src;
      }
      return undefined;
    });
  }

  /**
   * Clear an equipment slot, removing the item that was inside of it.
   * @param slot
   */
  clearEquipmentSlot(slot: keyof PlayerEquipment) {
    this.updatePlayer({
      equipment: {
        [slot]: null,
      },
    });
  }

  setSelectedLoadout(ix: number) {
    this.selectedLoadout = ix;
  }

  deleteLoadout(ix: number) {
    if (this.loadouts.length === 1) {
      // If there is only one loadout, clear it instead of deleting it
      this.loadouts[0] = generateEmptyPlayer();
      return;
    }

    this.loadouts = this.loadouts.filter((p, i) => i !== ix);
    // If the selected loadout index is equal to or over the index we just remove, shift it down by one, else add one
    if ((this.selectedLoadout >= ix) && ix !== 0) {
      this.selectedLoadout -= 1;
    }
  }

  renameLoadout(ix: number, name: string) {
    const loadout = this.loadouts[ix];

    const trimmedName = name.trim();
    if (loadout) {
      if (trimmedName) {
        loadout.name = trimmedName;
      } else {
        loadout.name = `Loadout ${ix + 1}`;
      }
    }
  }

  get canCreateLoadout() {
    return (this.loadouts.length < 5);
  }

  createLoadout(selected?: boolean, cloneIndex?: number) {
    // Do not allow creating a loadout if we're over the limit
    if (!this.canCreateLoadout) return;

    const newLoadout = (cloneIndex !== undefined) ? toJS(this.loadouts[cloneIndex]) : generateEmptyPlayer();
    newLoadout.name = `Loadout ${this.loadouts.length + 1}`;

    this.loadouts.push(newLoadout);
    if (selected) this.selectedLoadout = (this.loadouts.length - 1);
  }

  async doWorkerRecompute() {
    if (!this.calcWorker?.isReady()) {
      console.debug('[GlobalState] doWorkerRecompute called but worker is not ready, ignoring for now.');
      return;
    }

    // clear existing loadout data
    const calculatedLoadouts: CalculatedLoadout[] = [];
    this.loadouts.forEach(() => calculatedLoadouts.push(EMPTY_CALC_LOADOUT));
    this.calc.loadouts = calculatedLoadouts;

    const data: Extract<ComputeBasicRequest['data'], ComputeReverseRequest['data']> = {
      loadouts: this.loadouts,
      monster: this.monster,
      calcOpts: {
        includeTtkDist: this.prefs.showTtkComparison,
        detailedOutput: this.debug,
        disableMonsterScaling: this.prefs.manualMode,
      },
    };
    const request = async (type: WorkerRequestType.COMPUTE_BASIC | WorkerRequestType.COMPUTE_REVERSE) => {
      const resp = await this.calcWorker.do({
        type,
        data,
      });

      console.log(`[GlobalState] Calc response ${WorkerRequestType[type]}`, resp.payload);
      this.updateCalcResults({ loadouts: resp.payload });
    };

    await request(WorkerRequestType.COMPUTE_BASIC);
    await request(WorkerRequestType.COMPUTE_REVERSE);
  }
}

const StoreContext = createContext<GlobalState>(new GlobalState());

const StoreProvider: React.FC<{ store: GlobalState, children: React.ReactNode }> = ({ store, children }) => {

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

const useStore = () => useContext(StoreContext);

export { GlobalState, StoreProvider, useStore };
