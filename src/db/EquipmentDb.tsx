import { makeAutoObservable, runInAction } from 'mobx';
import type equipment from '$/json/equipment.json';
import React, { createContext, useContext, useMemo } from 'react';

export type EquipmentData = typeof equipment[number];

export class EquipmentDb {
  // # opts out of observability
  #equipment?: EquipmentData[];

  loaded: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    import('$/json/equipment.json').then((e) => {
      this.#equipment = e;
      runInAction(() => { this.loaded = true; });
    });
  }

  public find(id: number): EquipmentData | undefined {
    const ret = this.#equipment?.find((eq) => eq.id === id);
    if (ret) {
      // the data in the json is mutable, so we need to make a copy
      return structuredClone(ret);
    }

    // monster with that id doesn't exist
    return undefined;
  }
}

const EquipmentDbContext = createContext<EquipmentDb>({} as EquipmentDb);

export const EquipmentDbProvider: React.FC<{ value: EquipmentDb, children: React.ReactNode }> = ({ value, children }) => (
  <EquipmentDbContext.Provider value={value}>{children}</EquipmentDbContext.Provider>
);

export const DefaultEquipmentDbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useMemo(() => new EquipmentDb(), []);
  return (
    <EquipmentDbProvider value={db}>{children}</EquipmentDbProvider>
  );
};

export const useEquipmentDb = () => useContext(EquipmentDbContext);
