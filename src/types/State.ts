import {Player} from '@/types/Player';
import {Monster} from '@/types/Monster';

export interface UI {
  showPreferencesModal: boolean;
  potionsScrollPosition: number;
}

export interface Preferences {
  allowEditingPlayerStats: boolean;
  allowEditingMonsterStats: boolean;
  rememberUsername: boolean;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
}

export interface Calculator {
  npcDefRoll: number,
  maxHit: number,
  maxAttackRoll: number
}

export interface State {
  loadouts: Player[];
  selectedLoadout: number;

  monster: Monster;
  ui: UI;
  prefs: Preferences;
}