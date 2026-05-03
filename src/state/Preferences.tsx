import React, { createContext, PropsWithChildren, useContext } from 'react';
import { makeAutoObservable, toJS } from 'mobx';
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

export class PreferencesStore {
  preferences: Preferences = {
    manualMode: false,
    rememberUsername: true,
    showHitDistribution: false,
    showLoadoutComparison: false,
    showTtkComparison: false,
    showNPCVersusPlayerResults: false,
    hitDistsHideZeros: false,
    hitDistShowSpec: false,
    resultsExpanded: false,
  };

  #storageName: string;

  constructor(storageName: string) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.#storageName = storageName;
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    localforage.getItem(this.#storageName).then((v) => {
      const loadedPrefs = v as PartialDeep<Preferences>;
      this.updatePreferences(loadedPrefs, { persist: false });
    }).catch((e) => {
      console.error(e);
      // TODO maybe some handling here
    });
  }

  private saveToLocalStorage() {
    const persistedPrefs: Preferences = toJS(this.preferences); // convert out of mobx observable
    localforage.setItem(this.#storageName, persistedPrefs).catch((e) => {
      console.error(e);
      // TODO something that isn't this
      // eslint-disable-next-line no-alert
      alert('Could not persist preferences to browser. Make sure our site has permission to do this.');
    });
  }

  public updatePreferences(newValues: PartialDeep<Preferences>, options?: { persist?: boolean }) {
    this.preferences = merge(this.preferences, newValues);

    if (options?.persist !== false) {
      this.saveToLocalStorage();
    }
  }
}

const PreferencesContext = createContext<PreferencesStore>({} as PreferencesStore);

export const PreferencesProvider: React.FC<PropsWithChildren<{ preferences: PreferencesStore }>> = ({ preferences, children }) => (
  <PreferencesContext.Provider value={preferences}>{children}</PreferencesContext.Provider>
);

export const DefaultPreferencesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const preferences = new PreferencesStore('dps-calc-prefs');
  return (
    <PreferencesProvider preferences={preferences}>{children}</PreferencesProvider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
