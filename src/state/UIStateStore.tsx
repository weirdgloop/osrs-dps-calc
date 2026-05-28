'use client';

import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import {
  IReactionDisposer, makeAutoObservable, reaction, runInAction,
} from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import { dbrowDefinitions } from '@/app/components/player/demonicPactsLeague/pactSelector/parse_skill_tree_elements';
import localforage from 'localforage';

export enum PlayerTab {
  COMBAT_OPTIONS = 'COMBAT_OPTIONS',
  SKILLS = 'SKILLS',
  EQUIPMENT = 'EQUIPMENT',
  PRAYER = 'PRAYER',
  OPTIONS = 'OPTIONS',
  LEAGUES = 'LEAGUES',
}

const LF_KEY_USERNAME = 'dps-calc-username';

/**
 * UI-specific toggled behaviour and state.
 */
export interface UIState {
  username: string;
  playerTab: PlayerTab;
  leagues: {
    six: {
      pactsSearchQuery: string;
    };
  };
}

export class UIStateStore implements UIState {
  username = '';

  playerTab: PlayerTab = PlayerTab.EQUIPMENT;

  leagues = {
    six: {
      pactsSearchQuery: '',
    },
  };

  readonly #reactionDisposers: IReactionDisposer[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  startUp() {
    this.loadUsername();

    this.#reactionDisposers.push(reaction(
      () => this.username,
      () => this.saveUsername(),
    ));
  }

  public shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  public get nodesMatchingSearch(): Set<string> {
    if (!this.leagues.six.pactsSearchQuery) {
      return new Set();
    }
    return new Set(
      Object.keys(dbrowDefinitions).filter((id) => dbrowDefinitions[id].name
        ?.toLowerCase()
        .includes(this.leagues.six.pactsSearchQuery.toLowerCase())),
    );
  }

  public updateUIState(newValues: PartialDeep<UIState>) {
    merge(this, newValues);

    if (newValues.username) {
      this.saveUsername();
    }
  }

  private saveUsername() {
    localforage.setItem(LF_KEY_USERNAME, this.username)
      .catch(console.error);
  }

  private loadUsername() {
    localforage.getItem(LF_KEY_USERNAME).then((v) => {
      if (v) {
        this.updateUIState({ username: v as string });
      }
    });
  }
}

const UIContext = createContext<UIStateStore>({} as UIStateStore);

export const UIStateProvider: React.FC<{ value: UIStateStore, children: React.ReactNode }> = ({ value, children }) => (
  <UIContext.Provider value={value}>{children}</UIContext.Provider>
);

export const DefaultUIStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const uiState = useMemo(() => new UIStateStore(), []);
  useEffect(() => {
    uiState.startUp();
    return () => uiState.shutDown();
  });
  return (
    <UIStateProvider value={uiState}>{children}</UIStateProvider>
  );
};

export const useUIState = () => useContext(UIContext);
