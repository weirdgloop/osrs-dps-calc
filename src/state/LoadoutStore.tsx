import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { IReactionDisposer, makeAutoObservable } from 'mobx';
import { LoadoutId } from '@/types/Player';
import PlayerStore from '@/state/PlayerStore';
import { observer } from 'mobx-react-lite';
import { PreferencesStore, usePreferences } from '@/state/Preferences';
import { MonsterStore, useMonster } from '@/state/MonsterStore';

export const MAX_LOADOUTS = 6;

export class LoadoutStore {
  loadouts: Map<LoadoutId, PlayerStore> = new Map();

  selectedLoadout: LoadoutId = 0;

  readonly #reactionDisposers: IReactionDisposer[] = [];

  // #loaded works as a `once` guard ensuring that createLoadout only inits the loadout if it's on a client context
  #loaded: boolean = false;

  constructor(
    private readonly preferencesStore: PreferencesStore,
    private readonly monsterStore: MonsterStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.createLoadout({ cloneCurrent: false });
  }

  startUp() {
    this.#loaded = true;
    this.loadouts.forEach((l) => l.startUp());
  }

  shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  get currentLoadout(): PlayerStore {
    return this.loadouts.get(this.selectedLoadout)!;
  }

  get canCreateLoadout(): boolean {
    return this.loadouts.size < MAX_LOADOUTS;
  }

  get allLoadouts(): number[] {
    return [...this.loadouts.keys()];
  }

  public removeLoadout(uid?: LoadoutId) {
    uid ??= this.selectedLoadout;
    this.loadouts.delete(uid);
    this.ensureAtLeastOneLoadout();
  }

  public createLoadout({ cloneCurrent }: { cloneCurrent?: boolean } = { cloneCurrent: true }) {
    if (this.loadouts.size >= MAX_LOADOUTS) {
      return;
    }

    cloneCurrent ??= true;

    const newLoadout = new PlayerStore(this.preferencesStore, this.monsterStore);
    if (this.#loaded) {
      newLoadout.startUp();
    }

    if (cloneCurrent) {
      newLoadout.updateBasePlayer({
        ...this.currentLoadout.basePlayer,
        name: newLoadout.basePlayer.name,
      });
    }

    this.loadouts.set(newLoadout.loadoutId, newLoadout);
    this.selectedLoadout = newLoadout.loadoutId;
  }

  public selectLoadout(uid: LoadoutId) {
    if (this.loadouts.has(uid)) {
      this.selectedLoadout = uid;
    }
  }

  private ensureAtLeastOneLoadout() {
    // ensure there's always at least one loadout
    if (this.loadouts.size === 0) {
      this.createLoadout({ cloneCurrent: false });
    }

    // ensure the selected loadout is never dangling
    if (!this.loadouts.has(this.selectedLoadout)) {
      this.selectedLoadout = this.loadouts.keys().next().value!;
    }
  }
}

const LoadoutContext = createContext<LoadoutStore>({} as LoadoutStore);

export const LoadoutStoreProvider: React.FC<{ value: LoadoutStore, children: React.ReactNode }> = ({ value, children }) => (
  <LoadoutContext.Provider value={value}>{children}</LoadoutContext.Provider>
);

export const DefaultLoadoutStoreProvider: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const preferencesStore = usePreferences();
  const monsterStore = useMonster();
  const loadoutStore = useMemo(() => new LoadoutStore(preferencesStore, monsterStore), [monsterStore, preferencesStore]);
  useEffect(() => {
    loadoutStore.startUp();
    return () => loadoutStore.shutDown();
  }, [loadoutStore]);
  return (
    <LoadoutStoreProvider value={loadoutStore}>{children}</LoadoutStoreProvider>
  );
});

export const useLoadouts = () => useContext(LoadoutContext);

export const usePlayer = () => {
  const { currentLoadout } = useLoadouts();
  return currentLoadout;
};
