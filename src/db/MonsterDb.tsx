import { makeAutoObservable, runInAction } from 'mobx';
import type monsters from '$/json/monsters.json';
import React, { createContext, useContext, useMemo } from 'react';

export type MonsterData = typeof monsters[number];

export class MonsterDb {
  // # opts out of observability
  #monsters?: MonsterData[];

  loaded: boolean = false;

  monsterEntries: { name: string, id: number }[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    import('$/json/monsters.json').then((m) => {
      this.#monsters = m;
      this.monsterEntries = m.map((monster) => ({ name: monster.name, id: monster.id }));
      runInAction(() => { this.loaded = true; });
    });
  }

  public find(id: number): MonsterData | undefined {
    const ret = this.#monsters?.find((monster) => monster.id === id);
    if (ret) {
      // the data in the json is mutable, so we need to make a copy
      return structuredClone(ret);
    }

    // monster with that id doesn't exist
    return undefined;
  }
}

const MonsterDbContext = createContext<MonsterDb>({} as MonsterDb);

export const MonsterDbProvider: React.FC<{ value: MonsterDb, children: React.ReactNode }> = ({ value, children }) => (
  <MonsterDbContext.Provider value={value}>{children}</MonsterDbContext.Provider>
);

export const DefaultMonsterDbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useMemo(() => new MonsterDb(), []);
  return (
    <MonsterDbProvider value={db}>{children}</MonsterDbProvider>
  );
};

export const useMonsterDb = () => useContext(MonsterDbContext);
