import { Factor } from '@/lib/Math';

export enum DetailKey {
  NPC_DEFENCE_ROLL_LEVEL = 'NPC defence level',
  NPC_DEFENCE_ROLL_EFFECTIVE_LEVEL = 'NPC defence effective level',
  NPC_DEFENCE_STAT_BONUS = 'NPC defence stat bonus',
  NPC_DEFENCE_ROLL_BASE = 'NPC defence base roll',
  NPC_DEFENCE_ROLL_TOA = 'NPC defence ToA roll',
  NPC_DEFENCE_BRIMSTONE = 'NPC defence brimstone ring',
  NPC_DEFENCE_ROLL_FINAL = 'NPC defence roll',
  PLAYER_ACCURACY_LEVEL = 'Player accuracy level',
  PLAYER_ACCURACY_LEVEL_PRAYER = 'Player accuracy level prayer',
  PLAYER_ACCURACY_EFFECTIVE_LEVEL = 'Player accuracy effective level',
  PLAYER_ACCURACY_EFFECTIVE_LEVEL_VOID = 'Player accuracy void effective level',
  PLAYER_ACCURACY_GEAR_BONUS = 'Player accuracy gear bonus',
  PLAYER_ACCURACY_ROLL_BASE = 'Player accuracy base roll',
  PLAYER_ACCURACY_ROLL_MAGIC_PERCENT = 'Player accuracy magic %',
  PLAYER_ACCURACY_OBSIDIAN_BONUS = 'Player accuracy obsidian bonus',
  PLAYER_ACCURACY_OBSIDIAN = 'Player accuracy obsidian',
  PLAYER_ACCURACY_FORINTHRY_SURGE = 'Player accuracy forinthry surge',
  PLAYER_ACCURACY_SALVE = 'Player accuracy salve amulet',
  PLAYER_ACCURACY_BLACK_MASK = 'Player accuracy black mask',
  PLAYER_ACCURACY_REV_WEAPON = 'Player accuracy revenant weapon',
  PLAYER_DEMONBANE_FACTOR = 'Demonbane factor',
  PLAYER_ACCURACY_DEMONBANE = 'Player accuracy demonbane',
  PLAYER_ACCURACY_DRAGONHUNTER = 'Player accuracy dragonhunter',
  PLAYER_ACCURACY_CHINCHOMPA = 'Player accuracy chinchompa distance',
  PLAYER_ACCURACY_KERIS = 'Player accuracy keris',
  PLAYER_ACCURACY_VAMPYREBANE = 'Player accuracy vampyrebane',
  PLAYER_ACCURACY_EFARITAY = 'Player accuracy efaritay\'s aid',
  PLAYER_ACCURACY_GOLEMBANE = 'Player accuracy golembane',
  PLAYER_ACCURACY_SMOKE_BATTLESTAFF = 'Player accuracy smoke battlestaff',
  PLAYER_ACCURACY_TOME = 'Player accuracy tome',
  PLAYER_ACCURACY_TITANS_RANGED = 'Player accuracy Royal Titans ranged',
  PLAYER_ACCURACY_SPELLEMENT_BONUS = 'Player accuracy spellement weakness bonus',
  PLAYER_ACCURACY_SPELLEMENT = 'Player accuracy spellement weakness',
  PLAYER_ACCURACY_INQ = 'Player accuracy inquisitor\'s',
  PLAYER_ACCURACY_BRIMSTONE = 'Player accuracy brimstone ring',
  PLAYER_ACCURACY_SPEC = 'Player accuracy spec',
  PLAYER_ACCURACY_ROLL_FINAL = 'Player accuracy roll',
  DAMAGE_LEVEL = 'Damage level',
  DAMAGE_LEVEL_PRAYER = 'Damage level prayer',
  DAMAGE_LEVEL_SOULREAPER_BONUS = 'Damage level soulreaper axe bonus',
  DAMAGE_LEVEL_SOULREAPER = 'Damage level soulreaper axe',
  DAMAGE_EFFECTIVE_LEVEL = 'Damage effective level',
  DAMAGE_EFFECTIVE_LEVEL_HOLY_WATER = 'Damage effective level holy water',
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
  MAX_HIT_TOME = 'Max hit tome',
  MAX_HIT_FANG = 'Max hit fang',
  MAX_HIT_TONALZTICS = 'Max hit tonalztics',
  MAX_HIT_GODSWORD_SPEC = 'Max hit godsword spec',
  MAX_HIT_SPEC = 'Max hit spec',
  MAX_HIT_MAGIC_DMG = 'Max hit magic damage bonus',
  MAX_HIT_NEZIKCHENED = 'Max hit Nezikchened',
  MAX_HIT_WARDENS = 'Max hit wardens',
  MAX_HIT_FINAL = 'Max hit',
  MIN_HIT_SUNFIRE = 'Min hit sunfire runes',
  MIN_HIT_FANG = 'Min hit fang',
  MIN_HIT_SPEC = 'Min hit spec',
  MIN_HIT_WARDENS = 'Min hit wardens',
  MIN_HIT_FINAL = 'Min hit',
  PLAYER_ACCURACY_DAWNBRINGER = 'Player accuracy override dawnbringer',
  PLAYER_ACCURACY_SCURRIUS_RAT = 'Player accuracy override giant rat',
  PLAYER_ACCURACY_TD = 'Player accuracy override tormented demon',
  PLAYER_ACCURACY_BASE = 'Player accuracy base',
  PLAYER_ACCURACY_FANG_TOA = 'Player accuracy fang toa',
  PLAYER_ACCURACY_FANG = 'Player accuracy fang',
  PLAYER_ACCURACY_CONFLICTION_GAUNTLETS = 'Player accuracy confliction gauntlets',
  PLAYER_ACCURACY_ROYAL_TITAN_ELEMENTAL = 'Player accuracy override titan elemental',
  PLAYER_ACCURACY_FINAL = 'Player accuracy',
  HIT_DIST_FINAL_MIN = 'Hit dist min',
  HIT_DIST_FINAL_MAX = 'Hit dist max',
  HIT_DIST_FINAL_EXPECTED = 'Hit dist expected',
  DOT_EXPECTED = 'Damage over time expected',
  DOT_MAX = 'Damage over time max',
  GUARDIANS_DMG_BONUS = 'Guardians hit multiplier',
  PLAYER_DEFENCE_ROLL_LEVEL = 'Player defence level',
  PLAYER_DEFENCE_ROLL_LEVEL_PRAYER = 'Player defence level prayer',
  PLAYER_DEFENCE_ROLL_LEVEL_TORAGS = 'Player defence level torags',
  PLAYER_DEFENCE_ROLL_MAGIC_LEVEL = 'Player defence magic level',
  PLAYER_DEFENCE_ROLL_MAGIC_LEVEL_PRAYER = 'Player defence magic level prayer',
  PLAYER_DEFENCE_ROLL_EFFECTIVE_LEVEL = 'Player defence effective level',
  PLAYER_DEFENCE_ROLL_GEAR_BONUS = 'Player defence gear bonus',
  PLAYER_DEFENCE_ROLL_FINAL = 'Player defence roll',
  WARDENS_ACCURACY_DELTA = 'Wardens accuracy delta',
  WARDENS_DMG_MODIFIER = 'Wardens damage modifier',
  NPC_ACCURACY_ROLL_BASE = 'NPC accuracy base roll',
  NPC_ACCURACY_ROLL_BONUS = 'NPC accuracy bonus',
  NPC_ACCURACY_ROLL_FINAL = 'NPC accuracy roll',
  REPIRATORY_SYSTEM_MIN_HIT = 'Respiratory system minimum hit',
}

export interface DetailEntry {
  label: DetailKey,
  value: unknown,
  displayValue: string,
  highlight: boolean,
}

const HIGHLIGHTS: string[] = [
  DetailKey.PLAYER_DEFENCE_ROLL_FINAL,
  DetailKey.NPC_DEFENCE_ROLL_FINAL,
  DetailKey.PLAYER_ACCURACY_ROLL_FINAL,
  DetailKey.MAX_HIT_FINAL,
  DetailKey.PLAYER_ACCURACY_FINAL,
  DetailKey.NPC_ACCURACY_ROLL_FINAL,
  DetailKey.HIT_DIST_FINAL_MIN,
  DetailKey.HIT_DIST_FINAL_MAX,
  DetailKey.HIT_DIST_FINAL_EXPECTED,
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
      label: label as DetailKey,
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
