import React, {
  createContext, PropsWithChildren, useContext, useEffect, useMemo,
} from 'react';
import {
  autorun, IReactionDisposer, makeAutoObservable, toJS,
} from 'mobx';
import { PartialDeep } from 'type-fest';
import localforage from 'localforage';
import merge from 'lodash.mergewith';

export interface Preferences {
  manualMode: boolean;
  rememberUsername: boolean;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
  showTtkComparison: boolean;
  showNPCVersusPlayerResults: boolean;
  hitDistsHideZeros: boolean; // matches to CalcOpts#hitDistHideMisses but legacy name is unchanged here for storage-sake
  hitDistShowSpec: boolean;
  resultsExpanded: boolean;
}

export class PreferencesStore implements Preferences {
  manualMode: boolean = false;

  rememberUsername: boolean = true;

  showHitDistribution: boolean = false;

  showLoadoutComparison: boolean = false;

  showTtkComparison: boolean = false;

  showNPCVersusPlayerResults: boolean = false;

  hitDistsHideZeros: boolean = false;

  hitDistShowSpec: boolean = false;

  resultsExpanded: boolean = false;

  #reactionDisposers: IReactionDisposer[] = [];

  constructor(
    private readonly storageName: string,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  startUp() {
    this.loadFromLocalStorage();

    this.#reactionDisposers.push(autorun(() => {
      const persisted: Preferences = toJS({
        manualMode: this.manualMode,
        rememberUsername: this.rememberUsername,
        showHitDistribution: this.showHitDistribution,
        showLoadoutComparison: this.showLoadoutComparison,
        showTtkComparison: this.showTtkComparison,
        showNPCVersusPlayerResults: this.showNPCVersusPlayerResults,
        hitDistsHideZeros: this.hitDistsHideZeros,
        hitDistShowSpec: this.hitDistShowSpec,
        resultsExpanded: this.resultsExpanded,
      });

      localforage.setItem(this.storageName, persisted).catch((e) => {
        console.error(e);
      });
    }));
  }

  shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  private loadFromLocalStorage() {
    localforage.getItem(this.storageName).then((v) => {
      const loadedPrefs = v as PartialDeep<Preferences>;
      this.updatePreferences(loadedPrefs);
    }).catch((e) => {
      console.error(e);
      // TODO maybe some handling here
    });
  }

  public updatePreferences(newValues: PartialDeep<Preferences>) {
    merge(this, newValues);
  }
}

const PreferencesContext = createContext<PreferencesStore>({} as PreferencesStore);

export const PreferencesProvider: React.FC<PropsWithChildren<{ preferences: PreferencesStore }>> = ({ preferences, children }) => (
  <PreferencesContext.Provider value={preferences}>{children}</PreferencesContext.Provider>
);

export const DefaultPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const preferencesStore = useMemo(() => new PreferencesStore('dps-calc-prefs'), []);
  useEffect(() => {
    preferencesStore.startUp();
    return () => preferencesStore.shutDown();
  }, [preferencesStore]);
  return (
    <PreferencesProvider preferences={preferencesStore}>{children}</PreferencesProvider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
