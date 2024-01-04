import {Player} from '@/types/Player';
import {Monster} from '@/types/Monster';

export interface UI {
  showPreferencesModal: boolean;
  username: string;
}

export interface Preferences {
  allowEditingPlayerStats: boolean;
  allowEditingMonsterStats: boolean;
  rememberUsername: boolean;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
  showTtkComparison: boolean;
}

export interface HistogramEntry {
  name: any,
  chance: number,
}

export interface CalculatedLoadout {
  npcDefRoll: number,
  maxHit: number,
  maxAttackRoll: number,
  accuracy: number,
  dps: number,
  ttk: number,
  dist: HistogramEntry[],
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

export interface State extends ImportableData {
  ui: UI;
  prefs: Preferences;
}
