import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import localforage from 'localforage';
import { makeAutoObservable, reaction } from 'mobx';
import { PartialDeep } from 'type-fest';
import { LoadoutId, Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { CalcStore } from '@/state/CalcStore';
import LoadoutStore from '@/state/LoadoutStore';
import { MonsterStore } from '@/state/MonsterStore';
import { PreferencesStore } from '@/state/PreferencesStore';
import { UIStore } from '@/state/UIStore';
import {
  hasNonDefaultDefenceReductions, migrateImportableData, resolveMonsterDefinition, toPlayerPatch,
} from '@/state/serialization';

const STATE_KEY = 'dps-calc-state';

/**
 * The exported data version, which can be used to perform lazy migrations on load,
 * if the application changes since the data was written to storage.
 * This value should be incremented every time {@link ImportableData},
 * or any of its subproperties, are updated in a non-backwards-compatible manner,
 * or also in any manner that could affect the migrations required on load.
 */
export const IMPORT_VERSION = 13 as const;

/**
 * This is the state that can be exported and imported (through shortlinks).
 * If you change the schema here without taking precautions, you **will** break existing shortlinks.
 */
export interface ImportableData {
  // can be any number <= IMPORT_VERSION
  serializationVersion: number;

  loadouts: PartialDeep<Player>[];
  selectedLoadout: LoadoutId;

  monster: Monster;
}

/**
 * Owns every store, and import/export to shortlinks and local storage.
 * While you *can* add reactions here to avoid circular dependencies,
 * you should reconsider any implementation that requires such a case.
 */
export default class RootStore {
  readonly preferences = new PreferencesStore();

  readonly monster = new MonsterStore();

  readonly ui = new UIStore(this.monster);

  readonly loadouts = new LoadoutStore(this.monster, this.preferences);

  readonly calc = new CalcStore(this.loadouts, this.monster, this.preferences, this.ui);

  constructor() {
    makeAutoObservable(this, {
      preferences: false,
      ui: false,
      monster: false,
      loadouts: false,
      calc: false,
    }, { autoBind: true });
  }

  /**
   * The shortlink and browser storage format.
   */
  get snapshot(): ImportableData {
    return {
      serializationVersion: IMPORT_VERSION,
      loadouts: this.loadouts.loadouts.map((l) => l.snapshot),
      monster: this.monster.snapshot,
      selectedLoadout: this.loadouts.selectedUuid,
    };
  }

  /**
   * Restore the previous session from local storage, if there is one. Do this before `start`.
   * @returns whether a session was restored
   */
  async load(): Promise<boolean> {
    const state = await localforage.getItem<ImportableData>(STATE_KEY);
    if (!state) {
      return false;
    }

    this.importData(state);
    return true;
  }

  /**
   * Save the session to browser storage whenever it changes, if enabled (i.e. not in shortlink mode).
   */
  start({ persistState }: { persistState: boolean }): () => void {
    if (!persistState) {
      return () => {};
    }

    return reaction(() => this.snapshot, (data) => {
      localforage.setItem(STATE_KEY, data).catch((e) => console.error(e));
    });
  }

  /**
   * Replace the monster and all loadouts with shortlink or browser storage data. Mutates `data` while migrating it.
   */
  importData(data: ImportableData) {
    migrateImportableData(data);

    if (data.monster) {
      const definition = resolveMonsterDefinition(data.monster);
      this.monster.load(definition, data.monster.inputs ?? {});
      if (hasNonDefaultDefenceReductions(data.monster.inputs)) {
        this.ui.update({ isDefensiveReductionsExpanded: true });
      }
    }

    this.loadouts.replaceAll(data.loadouts.map(toPlayerPatch), data.selectedLoadout);
  }
}

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStore = () => useRequiredContext(RootStoreContext, 'useStore');
