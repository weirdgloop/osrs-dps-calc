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
}

export interface Calculator {
  npcDefRoll: number,
  playerMagicHit: number,
  playerMagicAttack: number,
  playerMeleeHit: number,
  playerMeleeAttack: number,
  playerRangedHit: number,
  playerRangedAttack: number
}

export interface State {
  loadouts: Player[];
  selectedLoadout: number;

  monster: Monster;
  ui: UI;
  prefs: Preferences;
}