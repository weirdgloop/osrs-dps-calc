import { Factor } from '@/lib/Math';

export enum DetailKey {
  NPC_DEFENCE_ROLL_LEVEL = 'NPC defence level',
  NPC_DEFENCE_ROLL_EFFECTIVE_LEVEL = 'NPC defence effective level',
  NPC_DEFENCE_STAT_BONUS = 'NPC defence stat bonus',
  NPC_DEFENCE_ROLL_BASE = 'NPC defence base roll',
  NPC_DEFENCE_ROLL_TOA = 'NPC defence ToA roll',
  NPC_DEFENCE_ROLL_FINAL = 'NPC defence roll',
  ACCURACY_LEVEL = 'Accuracy level',
  ACCURACY_LEVEL_PRAYER = 'Accuracy level prayer',
  ACCURACY_EFFECTIVE_LEVEL = 'Accuracy effective level',
  ACCURACY_EFFECTIVE_LEVEL_VOID = 'Accuracy void effective level',
  ACCURACY_GEAR_BONUS = 'Accuracy gear bonus',
  ACCURACY_ROLL_BASE = 'Accuracy base roll',
  ACCURACY_OBSIDIAN_BONUS = 'Accuracy obsidian bonus',
  ACCURACY_OBSIDIAN = 'Accuracy obsidian',
  ACCURACY_FORINTHRY_SURGE = 'Accuracy forinthry surge',
  ACCURACY_SALVE = 'Accuracy salve amulet',
  ACCURACY_BLACK_MASK = 'Accuracy black mask',
  ACCURACY_REV_WEAPON = 'Accuracy revenant weapon',
  ACCURACY_DEMONBANE = 'Accuracy demonbane',
  ACCURACY_DRAGONHUNTER = 'Accuracy dragonhunter',
  ACCURACY_KERIS = 'Accuracy keris',
  ACCURACY_VAMPYREBANE = 'Accuracy vampyrebane',
  ACCURACY_INQ = 'Accuracy inquisitor\'s',
  ACCURACY_ROLL_FINAL = 'Accuracy roll',
  DAMAGE_LEVEL = 'Damage level',
  DAMAGE_LEVEL_PRAYER = 'Damage level prayer',
  DAMAGE_LEVEL_SOULREAPER_BONUS = 'Damage level soulreaper axe bonus',
  DAMAGE_LEVEL_SOULREAPER = 'Damage level soulreaper axe',
  DAMAGE_EFFECTIVE_LEVEL = 'Damage effective level',
  DAMAGE_EFFECTIVE_LEVEL_VOID = 'Damage void effective level',
  DAMAGE_GEAR_BONUS = 'Damage gear bonus',
  MAX_HIT_BASE = 'Base max hit',
  MAX_HIT_FORINTHRY_SURGE = 'Max hit forinthry surge',
  MAX_HIT_SALVE = 'Max hit salve amulet',
  MAX_HIT_BLACK_MASK = 'Max hit black mask',
  MAX_HIT_DEMONBANE = 'Max hit demonbane',
  MAX_HIT_OBSIDIAN_BONUS = 'Max hit obsidian bonus',
  MAX_HIT_OBSIDIAN = 'Max hit obsidian',
  MAX_HIT_BERSERKER = 'Max hit berserker necklace',
  MAX_HIT_DRAGONHUNTER = 'Max hit dragonhunter',
  MAX_HIT_KERIS = 'Max hit keris',
  MAX_HIT_GOLEMBANE = 'Max hit golembane',
  MAX_HIT_REV_WEAPON = 'Max hit revenant weapon',
  MAX_HIT_VAMPYREBANE = 'Max hit vampyrebane',
  MAX_HIT_EFARITAY = 'Max hit efaritay\'s aid',
  MAX_HIT_LEAFY = 'Max hit leafy',
  MAX_HIT_COLOSSALBLADE = 'Max hit colossal blade',
  MAX_HIT_INQ = 'Max hit inquisitor\'s',
  MAX_HIT_RATBANE = 'Max hit ratbane',
  MAX_HIT_FINAL = 'Max hit',
  ACCURACY_DAWNBRINGER = 'Accuracy override dawnbringer',
  ACCURACY_SCURRIUS_RAT = 'Accuracy override giant rat',
  ACCURACY_BASE = 'Accuracy base',
  ACCURACY_BRIMSTONE = 'Accuracy brimstone ring',
  ACCURACY_FANG_TOA = 'Accuracy fang toa',
  ACCURACY_FANG = 'Accuracy fang',
  ACCURACY_FINAL = 'Accuracy',
  GUARDIANS_DMG_BONUS = 'Guardians hit multiplier',
  PLAYER_DEFENCE_ROLL_LEVEL = 'Player defence level',
  PLAYER_DEFENCE_ROLL_LEVEL_PRAYER = 'Player defence level prayer',
  PLAYER_DEFENCE_ROLL_MAGIC_LEVEL = 'Player defence magic level',
  PLAYER_DEFENCE_ROLL_MAGIC_LEVEL_PRAYER = 'Player defence magic level prayer',
  PLAYER_DEFENCE_ROLL_EFFECTIVE_LEVEL = 'Player defence effective level',
  PLAYER_DEFENCE_ROLL_GEAR_BONUS = 'Player defence gear bonus',
  PLAYER_DEFENCE_ROLL_FINAL = 'Player defence roll',
}

export interface DetailEntry {
  label: string,
  value: unknown,
  displayValue: string,
  highlight: boolean,
}

const HIGHLIGHTS: string[] = [
  DetailKey.PLAYER_DEFENCE_ROLL_FINAL,
  DetailKey.NPC_DEFENCE_ROLL_FINAL,
  DetailKey.ACCURACY_ROLL_FINAL,
  DetailKey.MAX_HIT_FINAL,
  DetailKey.ACCURACY_FINAL,
];

export class CalcDetails {
  private readonly entries: Map<string, DetailEntry> = new Map();

  private _lines: DetailEntry[] = [];

  private dirty: boolean = true;

  public track(label: DetailKey | string, value: number | string | Factor, textOverride?: string) {
    // preserve the order of insertion, in case we run over something multiple times
    if (this.entries.get(label) !== undefined) {
      return;
    }

    let stringValue: string;
    if (textOverride) {
      stringValue = textOverride;
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        stringValue = value.toString();
      } else {
        stringValue = value.toFixed(4);
      }
    } else if (typeof value === 'string') {
      stringValue = value;
    } else {
      stringValue = `${value[0]} / ${value[1]}`;
    }

    this.dirty = true;
    this.entries.set(label, {
      label,
      value,
      displayValue: stringValue,
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
