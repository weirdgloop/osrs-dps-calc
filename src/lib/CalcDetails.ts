import { sort } from 'd3-array';

export enum DetailKey {
  DEFENCE_ROLL_LEVEL = 'Defence level',
  DEFENCE_ROLL_EFFECTIVE_LEVEL = 'Defence effective level',
  DEFENCE_ROLL_BASE = 'Base defence roll',
  DEFENCE_ROLL_TOA = 'ToA defence roll',
  DEFENCE_ROLL_FINAL = 'Defence roll',
}

export interface DetailEntry {
  label: DetailKey,
  value: number,
}

const OUTPUT_ORDER: DetailKey[] = [
  DetailKey.DEFENCE_ROLL_LEVEL,
  DetailKey.DEFENCE_ROLL_EFFECTIVE_LEVEL,
  DetailKey.DEFENCE_ROLL_BASE,
  DetailKey.DEFENCE_ROLL_TOA,
  DetailKey.DEFENCE_ROLL_FINAL,
];

export class CalcDetails {
  private readonly entries: Map<DetailKey, DetailEntry> = new Map();

  private _lines: DetailEntry[] = [];

  private dirty: boolean = true;

  public track(label: DetailKey, value: number) {
    this.dirty = true;
    this.entries.set(label, {
      label,
      value,
    });
  }

  public get lines(): DetailEntry[] {
    if (this.dirty) {
      this._lines = sort(this.entries.values(), (l) => OUTPUT_ORDER.indexOf(l.label));
      this.dirty = false;
    }

    return this._lines;
  }
}
