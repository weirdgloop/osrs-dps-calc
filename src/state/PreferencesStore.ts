import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import localforage from 'localforage';
import { makeAutoObservable, reaction } from 'mobx';
import { keys } from '@/utils';

const PREFERENCES_KEY = 'dps-calc-prefs';

/**
 * User preferences that we store in the user's localStorage. You should not add any keys here that shouldn't be
 * saved locally and persist between sessions.
 */
export interface Preferences {
  manualMode: boolean;
  username: string;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
  showTtkComparison: boolean;
  showNPCVersusPlayerResults: boolean;
  hitDistsHideZeros: boolean; // legacy name
  hitDistShowSpec: boolean;
  resultsExpanded: boolean;
}

export const DEFAULT_PREFERENCES: Readonly<Preferences> = {
  manualMode: false,
  username: '',
  showHitDistribution: false,
  showLoadoutComparison: false,
  showTtkComparison: false,
  showNPCVersusPlayerResults: false,
  hitDistsHideZeros: false,
  hitDistShowSpec: false,
  resultsExpanded: false,
};

/**
 * Preferences persisted in browser storage.
 */
export class PreferencesStore implements Preferences {
  manualMode = DEFAULT_PREFERENCES.manualMode;

  username = DEFAULT_PREFERENCES.username;

  showHitDistribution = DEFAULT_PREFERENCES.showHitDistribution;

  showLoadoutComparison = DEFAULT_PREFERENCES.showLoadoutComparison;

  showTtkComparison = DEFAULT_PREFERENCES.showTtkComparison;

  showNPCVersusPlayerResults = DEFAULT_PREFERENCES.showNPCVersusPlayerResults;

  hitDistsHideZeros = DEFAULT_PREFERENCES.hitDistsHideZeros;

  hitDistShowSpec = DEFAULT_PREFERENCES.hitDistShowSpec;

  resultsExpanded = DEFAULT_PREFERENCES.resultsExpanded;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  start(): () => void {
    return reaction(() => this.snapshot, (preferences) => {
      localforage.setItem(PREFERENCES_KEY, preferences).catch((e) => {
        console.error(e);
        // eslint-disable-next-line no-alert
        alert('Could not persist preferences to browser. Make sure our site has permission to do this.');
      });
    });
  }

  get snapshot(): Preferences {
    return {
      ...DEFAULT_PREFERENCES,
      ...Object.fromEntries(keys(DEFAULT_PREFERENCES).map((key) => [key, this[key]])),
    };
  }

  update(prefs: Partial<Preferences>) {
    Object.assign(this, prefs);
  }

  /**
   * Restore preferences from local storage
   */
  async load() {
    this.update(await localforage.getItem<Partial<Preferences>>(PREFERENCES_KEY) ?? {});
  }
}

export const PreferencesContext = createContext<PreferencesStore | null>(null);

export const usePreferences = () => useRequiredContext(PreferencesContext, 'usePreferences');
