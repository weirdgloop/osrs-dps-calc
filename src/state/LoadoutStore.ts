import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import { makeAutoObservable } from 'mobx';
import { Monster } from '@/types/Monster';
import { NUMBER_OF_LOADOUTS } from '@/lib/constants';
import { LoadoutId } from '@/types/Player';
import { PlayerPatch, PlayerStore } from '@/state/PlayerStore';
import { PreferencesStore } from '@/state/PreferencesStore';

export default class LoadoutStore {
  loadouts: PlayerStore[];

  selectedUuid: LoadoutId;

  readonly #monster: Pick<Monster, 'id'>;

  readonly #preferences: Pick<PreferencesStore, 'manualMode'>;

  // Stop functions for the loadouts started by start
  readonly #stops: Map<LoadoutId, () => void> = new Map();

  #started = false;

  constructor(monster: Pick<Monster, 'id'>, preferences: Pick<PreferencesStore, 'manualMode'>) {
    this.#monster = monster;
    this.#preferences = preferences;

    const first = new PlayerStore(monster, preferences, 'Loadout 1');
    this.loadouts = [first];
    this.selectedUuid = first.uuid;

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get selectedIndex(): number {
    return this.loadouts.findIndex((l) => l.uuid === this.selectedUuid);
  }

  get currentLoadout(): PlayerStore {
    return this.loadouts[this.selectedIndex];
  }

  get canCreate(): boolean {
    return this.loadouts.length < NUMBER_OF_LOADOUTS;
  }

  start(): () => void {
    this.#started = true;
    this.loadouts.forEach((l) => this.#startLoadout(l));
    return () => {
      this.#started = false;
      this.loadouts.forEach((l) => this.#stopLoadout(l));
    };
  }

  select(uuid: LoadoutId) {
    if (this.loadouts.some((l) => l.uuid === uuid)) {
      this.selectedUuid = uuid;
    }
  }

  create({ select = false, cloneFrom }: { select?: boolean, cloneFrom?: LoadoutId } = {}): PlayerStore | undefined {
    if (!this.canCreate) {
      return undefined;
    }

    const loadout = new PlayerStore(this.#monster, this.#preferences, `Loadout ${this.loadouts.length + 1}`);
    const source = this.loadouts.find((l) => l.uuid === cloneFrom);
    if (source) {
      loadout.update({ ...source.snapshot, name: loadout.name });
      if (source.manualBonuses) loadout.setManualBonuses(source.manualBonuses);
    }

    this.loadouts.push(loadout);
    this.#startLoadout(loadout);
    if (select) {
      this.selectedUuid = loadout.uuid;
    }
    return loadout;
  }

  remove(uuid: LoadoutId) {
    const index = this.loadouts.findIndex((l) => l.uuid === uuid);
    if (index === -1) {
      return;
    }

    if (this.loadouts.length === 1) {
      this.replaceAll([{}]);
      return;
    }

    const [removed] = this.loadouts.splice(index, 1);
    this.#stopLoadout(removed);
    if (this.selectedUuid === uuid) {
      this.selectedUuid = this.loadouts[Math.max(0, index - 1)].uuid;
    }
  }

  rename(uuid: LoadoutId, name: string) {
    const index = this.loadouts.findIndex((l) => l.uuid === uuid);
    if (index !== -1) {
      this.loadouts[index].setName(name.trim() || `Loadout ${index + 1}`);
    }
  }

  /**
   * Replace every loadout, keeping each patch's `uuid` if it has one.
   */
  replaceAll(patches: PlayerPatch[], selectedUuid?: LoadoutId) {
    this.loadouts.forEach((l) => this.#stopLoadout(l));
    const loadouts = (patches.length > 0 ? patches : [{}]).map((patch, i) => {
      const loadout = new PlayerStore(this.#monster, this.#preferences, `Loadout ${i + 1}`, patch.uuid);
      loadout.update(patch);
      return loadout;
    });
    this.loadouts = loadouts;
    loadouts.forEach((l) => this.#startLoadout(l));
    this.selectedUuid = (loadouts.find((l) => l.uuid === selectedUuid) ?? loadouts[0]).uuid;
  }

  #startLoadout(loadout: PlayerStore) {
    if (this.#started) {
      this.#stops.set(loadout.uuid, loadout.start());
    }
  }

  #stopLoadout(loadout: PlayerStore) {
    this.#stops.get(loadout.uuid)?.();
    this.#stops.delete(loadout.uuid);
  }
}

export const LoadoutContext = createContext<LoadoutStore | null>(null);

export const useLoadouts = () => useRequiredContext(LoadoutContext, 'useLoadouts');
