import { PartialDeep } from 'type-fest';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import UserIssueType from '@/enums/UserIssueType';
import { DetailEntry } from '@/lib/CalcDetails';

export interface UserIssue {
  type: UserIssueType;
  severity: 'warn' | 'fatal';
  message: string;
  loadout?: string;
}

/**
 * UI-specific toggled behaviour and state.
 */
export interface UI {
  showPreferencesModal: boolean;
  showShareModal: boolean;
  username: string;
  isDefensiveReductionsExpanded: boolean;
}

/**
 * User preferences that we store in the user's localStorage. You should not add any keys here that shouldn't be
 * saved locally and persist between sessions.
 */
export interface Preferences {
  manualMode: boolean;
  rememberUsername: boolean;
  showHitDistribution: boolean;
  showLoadoutComparison: boolean;
  showTtkComparison: boolean;
  showNPCVersusPlayerResults: boolean;
  hitDistsHideZeros: boolean; // legacy name
  hitDistShowSpec: boolean;
  resultsExpanded: boolean;
}

export interface ChartEntry {
  name: string | number,
  [k: string]: string | number,
}

export interface ChartAnnotation {
  value: number,
  label: string
}

/**
 * The result of running the calculator on a specific player loadout.
 */
export interface CalculatedLoadout {
  userIssues?: UserIssue[],
}

export interface PlayerVsNPCCalculatedLoadout extends CalculatedLoadout {
  details?: DetailEntry[],

  // Player vs NPC metrics
  npcDefRoll?: number,
  maxHit?: number,
  expectedHit?: number,
  maxAttackRoll?: number,
  accuracy?: number,
  dps?: number,
  ttk?: number,
  hitDist?: ChartEntry[],
  ttkDist?: Map<number, number>,

  specAccuracy?: number,
  specMaxHit?: number,
  specExpected?: number,
  specMomentDps?: number,
  specFullDps?: number,
  specHitDist?: ChartEntry[],
}

// NPC vs Player metrics
export interface NPCVsPlayerCalculatedLoadout extends CalculatedLoadout {
  npcDetails?: DetailEntry[],

  playerDefRoll?: number,
  npcMaxAttackRoll?: number,
  npcMaxHit?: number,
  npcDps?: number,
  npcAccuracy?: number,
  avgDmgTaken?: number,
}

export interface Calculator {
  loadouts: (PlayerVsNPCCalculatedLoadout & NPCVsPlayerCalculatedLoadout)[]
}

/**
 * This is the state that can be exported and imported (through shortlinks).
 * If you change the schema here without taking precautions, you **will** break existing shortlinks.
 */
export interface ImportableData {
  loadouts: PartialDeep<Player>[];
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
  calc: Calculator;

  /**
   * All monsters that a player can fight.
   */
  availableMonsters: Omit<Monster, 'inputs'>[];
}
