import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import { makeAutoObservable } from 'mobx';
import { CompareXAxis, CompareYAxis } from '@/lib/Comparator';
import { MonsterStore } from '@/state/MonsterStore';

/**
 * UI-specific toggled behaviour and state.
 * If it needs to be persisted across page reloads, put it in Preferences instead.
 */
export interface UIState {
  showPreferencesModal: boolean;
  isDefensiveReductionsExpanded: boolean;
  debug: boolean;
  compareXAxis: CompareXAxis;
  compareYAxis: CompareYAxis;
}

const PLAYER_Y_AXES = [
  CompareYAxis.PLAYER_DPS, CompareYAxis.PLAYER_EXPECTED_HIT, CompareYAxis.PLAYER_TTK, CompareYAxis.PLAYER_MAX_HIT,
];

const MONSTER_Y_AXES = [CompareYAxis.MONSTER_DPS, CompareYAxis.DAMAGE_TAKEN];

export class UIStore implements UIState {
  showPreferencesModal = false;

  isDefensiveReductionsExpanded = false;

  debug = false;

  compareXAxis = CompareXAxis.MONSTER_DEF;

  compareYAxis = CompareYAxis.PLAYER_DPS;

  readonly #monster: Pick<MonsterStore, 'isNonStandard'>;

  constructor(monster: Pick<MonsterStore, 'isNonStandard'>) {
    this.#monster = monster;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get compareYAxisOptions(): CompareYAxis[] {
    return this.#monster.isNonStandard ? PLAYER_Y_AXES : [...PLAYER_Y_AXES, ...MONSTER_Y_AXES];
  }

  get compareY(): CompareYAxis {
    const options = this.compareYAxisOptions;
    return options.includes(this.compareYAxis) ? this.compareYAxis : options[0];
  }

  update(ui: Partial<UIState>) {
    Object.assign(this, ui);
  }
}

export const UIContext = createContext<UIStore | null>(null);

export const useUI = () => useRequiredContext(UIContext, 'useUI');
