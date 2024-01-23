export enum DetailKey {
  DEFENCE_ROLL_LEVEL = 'Defence level',
  DEFENCE_ROLL_EFFECTIVE_LEVEL = 'Defence effective level',
  DEFENCE_ROLL_BASE = 'Defence base roll',
  DEFENCE_ROLL_TOA = 'Defence ToA roll',
  DEFENCE_ROLL_FINAL = 'Defence roll',
  ACCURACY_LEVEL = 'Accuracy level',
  ACCURACY_PRAYER_BONUS = 'Accuracy prayer bonus',
  ACCURACY_STANCE_BONUS = 'Accuracy stance bonus',
  ACCURACY_EFFECTIVE_LEVEL = 'Accuracy effective level',
  ACCURACY_EFFECTIVE_LEVEL_VOID = 'Accuracy void effective level',
  ACCURACY_GEAR_BONUS = 'Accuracy gear bonus',
  ACCURACY_ROLL_BASE = 'Accuracy base roll',
  ACCURACY_OBSIDIAN_BONUS = 'Accuracy obsidian bonus',
  ACCURACY_FORINTHRY_SURGE_BONUS = 'Accuracy forinthry surge bonus',
  ACCURACY_SALVE_BONUS = 'Accuracy salve amulet bonus',
  ACCURACY_BLACK_MASK_BONUS = 'Accuracy black mask bonus',
  ACCURACY_REV_WEAPON_BONUS = 'Accuracy revenant weapon bonus',
  ACCURACY_DEMONBANE_BONUS = 'Accuracy demonbane bonus',
  ACCURACY_DRAGONHUNTER_BONUS = 'Accuracy dragonhunter bonus',
  ACCURACY_KERIS_BONUS = 'Accuracy keris bonus',
  ACCURACY_VAMPYREBANE_BONUS = 'Accuracy vampyrebane bonus',
  ACCURACY_INQ_BONUS = 'Accuracy inquisitor\'s bonus',
  ACCURACY_ROLL_FINAL = 'Accuracy roll',
  DAMAGE_LEVEL = 'Damage level',
  DAMAGE_PRAYER_BONUS = 'Damage prayer bonus',
  DAMAGE_STANCE_BONUS = 'Damage stance bonus',
  DAMAGE_EFFECTIVE_LEVEL = 'Damage effective level',
  DAMAGE_EFFECTIVE_LEVEL_VOID = 'Damage void effective level',
  DAMAGE_GEAR_BONUS = 'Damage gear bonus',
  MAX_HIT_BASE = 'Base max hit',
  MAX_HIT_FORINTHRY_SURGE_BONUS = 'Max hit forinthry surge bonus',
  MAX_HIT_SALVE_BONUS = 'Max hit salve amulet bonus',
  MAX_HIT_BLACK_MASK_BONUS = 'Max hit black mask bonus',
  MAX_HIT_DEMONBANE_BONUS = 'Max hit demonbane bonus',
  MAX_HIT_OBSIDIAN_BONUS = 'Max hit obsidian bonus',
  MAX_HIT_OBSIDIAN = 'Obsidian max hit',
  MAX_HIT_BERSERKER_BONUS = 'Max hit berserker necklace bonus',
  MAX_HIT_DRAGONHUNTER_BONUS = 'Max hit dragonhunter bonus',
  MAX_HIT_KERIS_BONUS = 'Max hit keris bonus',
  MAX_HIT_GOLEMBANE_BONUS = 'Max hit golembane bonus',
  MAX_HIT_REV_WEAPON_BONUS = 'Max hit revenant weapon bonus',
  MAX_HIT_VAMPYREBANE_BONUS = 'Max hit vampyrebane bonus',
  MAX_HIT_EFARITAY_BONUS = 'Max hit efaritay\'s aid bonus',
  MAX_HIT_LEAFY_BONUS = 'Max hit leafy bonus',
  MAX_HIT_COLOSSALBLADE_BONUS = 'Max hit colossal blade bonus',
  MAX_HIT_INQ_BONUS = 'Max hit inquisitor\'s bonus',
  MAX_HIT_FINAL = 'Max hit',
  ACCURACY_DAWNBRINGER = 'Accuracy override dawnbringer',
  ACCURACY_BASE = 'Accuracy base',
  ACCURACY_BRIMSTONE = 'Accuracy brimstone ring',
  ACCURACY_FANG_TOA = 'Accuracy fang toa',
  ACCURACY_FANG = 'Accuracy fang',
  ACCURACY_FINAL = 'Accuracy',
  GUARDIANS_DMG_BONUS = 'Guardians hit multiplier',
}

export interface DetailEntry {
  label: DetailKey,
  value: string,
  highlight: boolean,
}

const HIGHLIGHTS: DetailKey[] = [
  DetailKey.DEFENCE_ROLL_FINAL,
  DetailKey.ACCURACY_ROLL_FINAL,
  DetailKey.MAX_HIT_BASE,
  DetailKey.MAX_HIT_FINAL,
  DetailKey.ACCURACY_FINAL,
];

export class CalcDetails {
  private readonly entries: Map<DetailKey, DetailEntry> = new Map();

  private _lines: DetailEntry[] = [];

  private dirty: boolean = true;

  public track(label: DetailKey, value: number | string) {
    // preserve the order of insertion, in case we run over something multiple times
    if (this.entries.get(label) !== undefined) {
      return;
    }

    let stringValue: string;
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        stringValue = value.toString();
      } else {
        stringValue = value.toFixed(4);
      }
    } else {
      stringValue = value;
    }

    this.dirty = true;
    this.entries.set(label, {
      label,
      value: stringValue,
      highlight: HIGHLIGHTS.includes(label),
    });
  }

  public get lines(): DetailEntry[] {
    if (this.dirty) {
      this._lines = [...this.entries.values()];
      this.dirty = false;
    }

    return this._lines;
  }
}
