import React, { createContext, useContext, useMemo } from 'react';
import { makeAutoObservable } from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';

/**
 * UI-specific toggled behaviour and state.
 */
export interface UIState {
  showPreferencesModal: boolean;
  showShareModal: boolean;
  username: string;
  isDefensiveReductionsExpanded: boolean;
  leagues: {
    six: {
      pactsSearchQuery: string;
    };
  };
}

export class UIStateStore implements UIState {
  showPreferencesModal = false;

  showShareModal = false;

  username = '';

  isDefensiveReductionsExpanded = false;

  leagues = {
    six: {
      pactsSearchQuery: '',
    },
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public updateUIState(newValues: PartialDeep<UIState>) {
    merge(this, newValues);
  }
}

const UIContext = createContext<UIStateStore>({} as UIStateStore);

export const UIStateProvider: React.FC<{ value: UIStateStore, children: React.ReactNode }> = ({ value, children }) => (
  <UIContext.Provider value={value}>{children}</UIContext.Provider>
);

export const DefaultUIStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useMemo(() => new UIStateStore(), []);
  return (
    <UIStateProvider value={state}>{children}</UIStateProvider>
  );
};

export const useUIState = () => useContext(UIContext);
