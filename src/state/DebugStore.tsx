import React, { createContext, useContext, useMemo } from 'react';
import { makeAutoObservable } from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';

export interface DebugState {
  isDebug: boolean;
}

export class DebugStore implements DebugState {
  isDebug = process.env && process.env.NODE_ENV === 'development';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public updateDebugState(newValues: PartialDeep<DebugState>) {
    merge(this, newValues);
  }
}

const DebugContext = createContext<DebugStore>({} as DebugStore);

export const DebugStateProvider: React.FC<{ value: DebugStore, children: React.ReactNode }> = ({ value, children }) => (
  <DebugContext.Provider value={value}>{children}</DebugContext.Provider>
);

export const DefaultDebugStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useMemo(() => new DebugStore(), []);
  return (
    <DebugStateProvider value={state}>{children}</DebugStateProvider>
  );
};

export const useDebugState = () => useContext(DebugContext);
