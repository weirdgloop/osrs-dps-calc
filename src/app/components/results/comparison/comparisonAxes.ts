import { CompareXAxis, CompareYAxis } from '@/lib/Comparator';

export interface AxisOption<T> {
  label: string;
  axisLabel: string;
  value: T;
}

export const X_AXIS_OPTIONS: AxisOption<CompareXAxis>[] = [
  { label: 'Monster defence level', axisLabel: 'Level', value: CompareXAxis.MONSTER_DEF },
  { label: 'Monster magic defence level', axisLabel: 'Level', value: CompareXAxis.MONSTER_MAGIC_DEF },
  { label: 'Monster magic level', axisLabel: 'Level', value: CompareXAxis.MONSTER_MAGIC },
  { label: 'Monster HP', axisLabel: 'Hitpoints', value: CompareXAxis.MONSTER_HP },
  { label: 'Player attack level', axisLabel: 'Level', value: CompareXAxis.PLAYER_ATTACK_LEVEL },
  { label: 'Player strength level', axisLabel: 'Level', value: CompareXAxis.PLAYER_STRENGTH_LEVEL },
  { label: 'Player defence level', axisLabel: 'Level', value: CompareXAxis.PLAYER_DEFENCE_LEVEL },
  { label: 'Player ranged level', axisLabel: 'Level', value: CompareXAxis.PLAYER_RANGED_LEVEL },
  { label: 'Player magic level', axisLabel: 'Level', value: CompareXAxis.PLAYER_MAGIC_LEVEL },
  { label: 'Player stat decay', axisLabel: 'Minutes after boost', value: CompareXAxis.STAT_DECAY_RESTORE },
  { label: 'Player melee strength bonus', axisLabel: 'Bonus', value: CompareXAxis.PLAYER_MELEE_STRENGTH_BONUS },
  { label: 'Player ranged strength bonus', axisLabel: 'Bonus', value: CompareXAxis.PLAYER_RANGED_STRENGTH_BONUS },
  { label: 'Player magic strength bonus', axisLabel: 'Bonus', value: CompareXAxis.PLAYER_MAGIC_STRENGTH_BONUS },
];

export const Y_AXIS_OPTIONS: Record<CompareYAxis, AxisOption<CompareYAxis>> = {
  [CompareYAxis.PLAYER_DPS]: { label: 'Player damage-per-second', axisLabel: 'DPS', value: CompareYAxis.PLAYER_DPS },
  [CompareYAxis.PLAYER_EXPECTED_HIT]: { label: 'Player expected hit', axisLabel: 'Hit', value: CompareYAxis.PLAYER_EXPECTED_HIT },
  [CompareYAxis.PLAYER_TTK]: { label: 'Time-to-kill', axisLabel: 'Seconds', value: CompareYAxis.PLAYER_TTK },
  [CompareYAxis.PLAYER_MAX_HIT]: { label: 'Player max hit', axisLabel: 'Max hit', value: CompareYAxis.PLAYER_MAX_HIT },
  [CompareYAxis.MONSTER_DPS]: { label: 'Player damage taken per sec', axisLabel: 'DPS', value: CompareYAxis.MONSTER_DPS },
  [CompareYAxis.DAMAGE_TAKEN]: { label: 'Player damage taken per kill', axisLabel: 'Damage', value: CompareYAxis.DAMAGE_TAKEN },
};
