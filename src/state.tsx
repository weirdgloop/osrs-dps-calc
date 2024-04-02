import {
  IReactionPublic, makeAutoObservable, reaction, toJS,
} from 'mobx';
import React, { createContext, useContext } from 'react';
import { PartialDeep } from 'type-fest';
import * as localforage from 'localforage';
import {
  CalculatedLoadout, Calculator, ImportableData, Preferences, State, UI, UserIssue,
} from '@/types/State';
import merge from 'lodash.mergewith';
import { Monster } from '@/types/Monster';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { toast } from 'react-toastify';
import {
  Debouncer, fetchPlayerSkills, fetchShortlinkData, getCombatStylesForCategory,
} from '@/utils';
import { ComputeBasicRequest, ComputeReverseRequest, WorkerRequestType } from '@/worker/CalcWorkerTypes';
import getMonsters from '@/lib/Monsters';
import { availableEquipment } from '@/lib/Equipment';
import { CalcWorker } from '@/worker/CalcWorker';
import { spellByName } from '@/types/Spell';
import Player from '@/lib/Player';
import { EquipmentCategory } from './enums/EquipmentCategory';
import { WikiSyncer } from './wikisync/WikiSyncer';

const CALC_DEBOUNCE_MS: number = 250;

const EMPTY_CALC_LOADOUT = {} as CalculatedLoadout;

export const parseLoadoutsFromImportedData = (data: ImportableData) => data.loadouts.map((loadout, i) => {
  // For each item, if only an item ID is available, load the other data.
  if (loadout.equipment) {
    for (const [k, v] of Object.entries(loadout.equipment)) {
      if (!v) continue;
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
    Player.newEmpty('Loadout 1'),
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

  /**
   * Map of WikiSync instances (PORT -> WIKISYNCER) that we attempt to persistently connect to.
   * The WikiSync RuneLite plugin includes a websocket server which exposes player information from the local
   * RuneLite client to the DPS calculator.
   */
  wikisync: Map<number, WikiSyncer> = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    // Set debug variable if we're running in a dev environment
    this.debug = process.env && process.env.NODE_ENV === 'development';

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

    // this.wikisync = startPollingForRuneLite();
    this.wikisync = new Map(); // temp disabled until we're ready
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

  /**
   * Returns the WikiSyncer instances that have user information attached (AKA the user is logged in),
   * rather than all of the instances that have an attempted connection.
   */
  get validWikiSyncInstances() {
    return new Map([...this.wikisync].filter(([, v]) => v.username));
  }

  setCalcWorker(worker: CalcWorker) {
    if (this.calcWorker) {
      console.warn('[GlobalState] CalcWorker is already set!');
    }
    worker.initWorker();
    worker.setDebouncer(new Debouncer(CALC_DEBOUNCE_MS));
    this.calcWorker = worker;
  }

  recalculateEquipmentBonusesFromGearAll() {
    this.loadouts.forEach((p) => p.recalculateGearBonuses(this.monster));
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
    const loadouts = parseLoadoutsFromImportedData(data);

    // manually recompute equipment in case their metadata has changed since the shortlink was created
    loadouts.forEach((p, ix) => {
      if (this.loadouts[ix] === undefined) this.loadouts.push(Player.newEmpty());
      this.loadouts[ix].update(p);
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

      if (res) this.player.update({ skills: res });
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

  setSelectedLoadout(ix: number) {
    this.selectedLoadout = ix;
  }

  deleteLoadout(ix: number) {
    if (this.loadouts.length === 1) {
      // If there is only one loadout, clear it instead of deleting it
      this.loadouts[0] = Player.newEmpty('Loadout 1');
      return;
    }

    this.loadouts = this.loadouts.filter((p, i) => i !== ix);
    // If the selected loadout index is equal to or over the index we just remove, shift it down by one, else add one
    if ((this.selectedLoadout >= ix) && ix !== 0) {
      this.selectedLoadout -= 1;
    }
  }

  get canCreateLoadout() {
    return (this.loadouts.length < 5);
  }

  createLoadout(selected?: boolean, cloneIndex?: number) {
    // Do not allow creating a loadout if we're over the limit
    if (!this.canCreateLoadout) return;

    const newLoadout = (cloneIndex !== undefined) ? new Player(toJS(this.loadouts[cloneIndex])) : Player.newEmpty();
    newLoadout.rename(`Loadout ${this.loadouts.length + 1}`);

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
      loadouts: this.loadouts.map((l) => ({ ...l, boosts: l.boosts })),
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

const StoreProvider: React.FC<{ store: GlobalState, children: React.ReactNode }> = ({ store, children }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

const useStore = () => useContext(StoreContext);

export { GlobalState, StoreProvider, useStore };
