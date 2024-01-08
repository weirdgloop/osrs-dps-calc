import {Player} from '@/types/Player';
import {Monster} from '@/types/Monster';

/**
 * UI-specific toggled behaviour and state.
 */
export interface UI {
  showPreferencesModal: boolean;
  showShareModal: boolean;
  username: string;
}

/**
 * User preferences that we store in the user's localStorage. You should not add any keys here that shouldn't be
 * saved locally and persist between sessions.
 */
export interface Preferences {
  advancedMode: boolean;
  rememberUsername: boolean;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
  showTtkComparison: boolean;
  hitDistsHideZeros: boolean;
}

export interface HistogramEntry {
  name: any,
  chance: number,
}

/**
 * The result of running the calculator on a specific Player loadout.
 * @see CombatCalc
 */
export interface CalculatedLoadout {
  npcDefRoll: number,
  maxHit: number,
  maxAttackRoll: number,
  accuracy: number,
  dps: number,
  ttk: number,
  hitDist: HistogramEntry[],
  ttkDist?: Map<number, number>,
}

export interface Calculator {
  loadouts: CalculatedLoadout[]
}

/**
 * This is the state that can be exported and imported (through shortlinks).
 * If you change the schema here without taking precautions, you **will** break existing shortlinks.
 */
export interface ImportableData {
  loadouts: Player[];
  selectedLoadout: number;

  monster: Monster;
}

/**
 * The interface for the global app state, which includes not only the import(ed|able) data, but also the UI state,
 * and the user's preferences.
 */
export interface State extends ImportableData {
  ui: UI;
  prefs: Preferences;
}
