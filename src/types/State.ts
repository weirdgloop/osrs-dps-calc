import {Player} from '@/types/Player';
import {Monster} from '@/types/Monster';

export interface UI {
  showPreferencesModal: boolean;
  potionsScrollPosition: number;
  username: string;

  /**
   * This is used to indicate when the calculator has not changed since creating a share link, so another one
   * should not be creatable yet.
   */

  blockSharing: boolean;
}

export interface Preferences {
  allowEditingPlayerStats: boolean;
  allowEditingMonsterStats: boolean;
  rememberUsername: boolean;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
}

export interface CalculatedLoadout {
  npcDefRoll: number,
  maxHit: number,
  maxAttackRoll: number
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