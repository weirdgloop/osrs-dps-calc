const SECONDS_PER_TICK = 0.6;

export interface TtkXAxis {
  label: string;
  toLabel: (ticks: number) => string;
}

export const TTK_X_AXES: TtkXAxis[] = [
  { label: 'Ticks', toLabel: (ticks) => ticks.toString() },
  { label: 'Seconds', toLabel: (ticks) => (ticks * SECONDS_PER_TICK).toFixed(1) },
];
