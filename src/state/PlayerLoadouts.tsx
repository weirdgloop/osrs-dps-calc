import React, { createContext, useContext, useMemo } from 'react';
import { makeAutoObservable, observable } from 'mobx';
import { PlayerStore } from '@/state/PlayerStore';

export const MAX_LOADOUTS = 6;

export class PlayerLoadouts {
  loadouts: PlayerStore[] = [new PlayerStore()];

  selectedLoadout: number = 0;

  constructor() {
    makeAutoObservable(this, { loadouts: observable.shallow }, { autoBind: true });
  }

  get currentLoadout(): PlayerStore {
    return this.loadouts[this.selectedLoadout];
  }

  public removeLoadout(index: number) {
    if (index < this.loadouts.length) {
      this.loadouts.splice(index, 1);
    }
    if (this.selectedLoadout >= this.loadouts.length) {
      this.selectedLoadout = this.loadouts.length - 1;
    }

    if (this.loadouts.length === 0) {
      this.createLoadout();
    }
  }

  public createLoadout(name?: string) {
    if (this.loadouts.length >= MAX_LOADOUTS) {
      return;
    }

    const newLoadout = new PlayerStore(name ?? `Loadout ${this.loadouts.length + 1}`);
    this.loadouts.push(newLoadout);
    this.selectedLoadout = this.loadouts.length - 1;
  }

  public selectLoadout(index: number) {
    if (index > 0 && index < this.loadouts.length) {
      this.selectedLoadout = index;
    }
  }
}

const LoadoutContext = createContext<PlayerLoadouts>({} as PlayerLoadouts);

export const PlayerLoadoutsProvider: React.FC<{ value: PlayerLoadouts, children: React.ReactNode }> = ({ value, children }) => (
  <LoadoutContext.Provider value={value}>{children}</LoadoutContext.Provider>
);

export const DefaultPlayerLoadoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const loadouts = useMemo(() => new PlayerLoadouts(), []);
  return (
    <PlayerLoadoutsProvider value={loadouts}>{children}</PlayerLoadoutsProvider>
  );
};

export const useLoadouts = () => useContext(LoadoutContext);
