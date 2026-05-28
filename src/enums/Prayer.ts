import { Factor } from '@/lib/Math';

export enum Prayer {
  BURST_OF_STRENGTH = 'Burst of Strength',
  CLARITY_OF_THOUGHT = 'Clarity of Thought',
  SHARP_EYE = 'Sharp Eye',
  MYSTIC_WILL = 'Mystic Will',
  SUPERHUMAN_STRENGTH = 'Superhuman Strength',
  IMPROVED_REFLEXES = 'Improved Reflexes',
  HAWK_EYE = 'Hawk Eye',
  MYSTIC_LORE = 'Mystic Lore',
  ULTIMATE_STRENGTH = 'Ultimate Strength',
  INCREDIBLE_REFLEXES = 'Incredible Reflexes',
  EAGLE_EYE = 'Eagle Eye',
  MYSTIC_MIGHT = 'Mystic Might',
  CHIVALRY = 'Chivalry',
  PIETY = 'Piety',
  RIGOUR = 'Rigour',
  AUGURY = 'Augury',
  THICK_SKIN = 'Thick Skin',
  ROCK_SKIN = 'Rock Skin',
  STEEL_SKIN = 'Steel Skin',
  DEADEYE = 'Deadeye',
  MYSTIC_VIGOUR = 'Mystic Vigour',
  PROTECT_MAGIC = 'Protect from Magic',
  PROTECT_RANGED = 'Protect from Missiles',
  PROTECT_MELEE = 'Protect from Melee',
  RETRIBUTION = 'Retribution',
  REDEMPTION = 'Redemption',
  SMITE = 'Smite',
  RAPID_RESTORE = 'Rapid Restore',
  RAPID_HEAL = 'Rapid Heal',
  PROTECT_ITEM = 'Protect Item',
  PRESERVE = 'Preserve',
}

// prior to the big mobx overhaul, prayers were numbers
// so this is needed in the share link migration stuff
const PrayerMigrationMapping: Record<number, Prayer> = {
  0: Prayer.BURST_OF_STRENGTH,
  1: Prayer.CLARITY_OF_THOUGHT,
  2: Prayer.SHARP_EYE,
  3: Prayer.MYSTIC_WILL,
  4: Prayer.SUPERHUMAN_STRENGTH,
  5: Prayer.IMPROVED_REFLEXES,
  6: Prayer.HAWK_EYE,
  7: Prayer.MYSTIC_LORE,
  8: Prayer.ULTIMATE_STRENGTH,
  9: Prayer.INCREDIBLE_REFLEXES,
  10: Prayer.EAGLE_EYE,
  11: Prayer.MYSTIC_MIGHT,
  12: Prayer.CHIVALRY,
  13: Prayer.PIETY,
  14: Prayer.RIGOUR,
  15: Prayer.AUGURY,
  16: Prayer.THICK_SKIN,
  17: Prayer.ROCK_SKIN,
  18: Prayer.STEEL_SKIN,
  19: Prayer.DEADEYE,
  20: Prayer.MYSTIC_VIGOUR,
  21: Prayer.PROTECT_MAGIC,
  22: Prayer.PROTECT_RANGED,
  23: Prayer.PROTECT_MELEE,
  24: Prayer.RETRIBUTION,
  25: Prayer.REDEMPTION,
  26: Prayer.SMITE,
  27: Prayer.RAPID_RESTORE,
  28: Prayer.RAPID_HEAL,
  29: Prayer.PROTECT_ITEM,
  30: Prayer.PRESERVE,
};

export const DEFENSIVE_PRAYERS: Prayer[] = [
  Prayer.THICK_SKIN, Prayer.ROCK_SKIN, Prayer.STEEL_SKIN,
  Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY,
];

export const OFFENSIVE_PRAYERS: Prayer[] = [
  Prayer.BURST_OF_STRENGTH, Prayer.CLARITY_OF_THOUGHT, Prayer.SHARP_EYE, Prayer.MYSTIC_WILL, Prayer.SUPERHUMAN_STRENGTH,
  Prayer.IMPROVED_REFLEXES, Prayer.HAWK_EYE, Prayer.MYSTIC_LORE, Prayer.ULTIMATE_STRENGTH, Prayer.INCREDIBLE_REFLEXES,
  Prayer.EAGLE_EYE, Prayer.MYSTIC_MIGHT, Prayer.DEADEYE, Prayer.MYSTIC_VIGOUR, Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY,
];

export const BRAIN_PRAYERS: Prayer[] = [
  Prayer.CLARITY_OF_THOUGHT, Prayer.IMPROVED_REFLEXES, Prayer.INCREDIBLE_REFLEXES,
];

export const ARM_PRAYERS: Prayer[] = [
  Prayer.BURST_OF_STRENGTH, Prayer.SUPERHUMAN_STRENGTH, Prayer.ULTIMATE_STRENGTH,
];

export const OVERHEAD_PRAYERS: Prayer[] = [
  Prayer.PROTECT_MAGIC, Prayer.PROTECT_RANGED, Prayer.PROTECT_MELEE,
  Prayer.RETRIBUTION, Prayer.REDEMPTION, Prayer.SMITE,
];

export type PrayerCombatStyle = 'magic' | 'ranged' | 'melee';
export interface PrayerData {
  drainRate: number;
  combatStyle?: PrayerCombatStyle,
  magicDamageBonus?: number,
  factorAccuracy?: Factor,
  factorStrength?: Factor,
  factorDefence?: Factor,
  // there aren't currently any prayers that have distinct factorDefence and factorDefenceMagic,
  // but it could happen in the future, and we have no actual idea how that would work
  factorDefenceMagic?: Factor,
  // place this prayer in a separate group to combat prayers
  renderInOther?: boolean
}

// Factors must be given as a denominator of 100 such that additive prayers are calculated correctly
export const PrayerMap: { [k in Prayer]: PrayerData } = {
  [Prayer.BURST_OF_STRENGTH]: {
    drainRate: 1,
    combatStyle: 'melee',
    factorStrength: [105, 100],
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    drainRate: 1,
    combatStyle: 'melee',
    factorAccuracy: [105, 100],
  },
  [Prayer.SHARP_EYE]: {
    drainRate: 1,
    combatStyle: 'ranged',
    factorAccuracy: [105, 100],
    factorStrength: [105, 100],
  },
  [Prayer.MYSTIC_WILL]: {
    drainRate: 1,
    combatStyle: 'magic',
    factorAccuracy: [105, 100],
    factorDefenceMagic: [105, 100],
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    drainRate: 6,
    combatStyle: 'melee',
    factorStrength: [110, 100],
  },
  [Prayer.IMPROVED_REFLEXES]: {
    drainRate: 6,
    combatStyle: 'melee',
    factorAccuracy: [110, 100],
  },
  [Prayer.HAWK_EYE]: {
    drainRate: 6,
    combatStyle: 'ranged',
    factorAccuracy: [110, 100],
    factorStrength: [110, 100],
  },
  [Prayer.MYSTIC_LORE]: {
    drainRate: 6,
    combatStyle: 'magic',
    magicDamageBonus: 10,
    factorAccuracy: [110, 100],
    factorDefenceMagic: [110, 100],
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    drainRate: 12,
    combatStyle: 'melee',
    factorStrength: [115, 100],
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    drainRate: 12,
    combatStyle: 'melee',
    factorAccuracy: [115, 100],
  },
  [Prayer.EAGLE_EYE]: {
    drainRate: 12,
    combatStyle: 'ranged',
    factorAccuracy: [115, 100],
    factorStrength: [115, 100],
  },
  [Prayer.MYSTIC_MIGHT]: {
    drainRate: 12,
    combatStyle: 'magic',
    magicDamageBonus: 20,
    factorAccuracy: [115, 100],
    factorDefenceMagic: [115, 100],
  },
  [Prayer.CHIVALRY]: {
    drainRate: 24,
    combatStyle: 'melee',
    factorAccuracy: [115, 100],
    factorStrength: [118, 100],
    factorDefence: [120, 100],
  },
  [Prayer.PIETY]: {
    drainRate: 24,
    combatStyle: 'melee',
    factorAccuracy: [120, 100],
    factorStrength: [123, 100],
    factorDefence: [125, 100],
  },
  [Prayer.RIGOUR]: {
    drainRate: 24,
    combatStyle: 'ranged',
    factorAccuracy: [120, 100],
    factorStrength: [123, 100],
    factorDefence: [125, 100],
  },
  [Prayer.AUGURY]: {
    drainRate: 24,
    combatStyle: 'magic',
    magicDamageBonus: 40,
    factorAccuracy: [125, 100],
    factorDefence: [125, 100],
    factorDefenceMagic: [125, 100],
  },
  [Prayer.THICK_SKIN]: {
    drainRate: 1,
    factorDefence: [105, 100],
  },
  [Prayer.ROCK_SKIN]: {
    drainRate: 6,
    factorDefence: [110, 100],
  },
  [Prayer.STEEL_SKIN]: {
    drainRate: 12,
    factorDefence: [115, 100],
  },
  [Prayer.DEADEYE]: {
    drainRate: 12,
    combatStyle: 'ranged',
    factorAccuracy: [118, 100],
    factorStrength: [118, 100],
    factorDefence: [105, 100],
  },
  [Prayer.MYSTIC_VIGOUR]: {
    drainRate: 12,
    combatStyle: 'magic',
    magicDamageBonus: 30,
    factorAccuracy: [118, 100],
    factorDefenceMagic: [118, 100],
    factorDefence: [105, 100],
  },
  [Prayer.PROTECT_MAGIC]: {
    drainRate: 12,
    renderInOther: true,
  },
  [Prayer.PROTECT_MELEE]: {
    drainRate: 12,
    renderInOther: true,
  },
  [Prayer.PROTECT_RANGED]: {
    drainRate: 12,
    renderInOther: true,
  },
  [Prayer.RETRIBUTION]: {
    drainRate: 3,
    renderInOther: true,
  },
  [Prayer.REDEMPTION]: {
    drainRate: 6,
    renderInOther: true,
  },
  [Prayer.SMITE]: {
    drainRate: 18,
    renderInOther: true,
  },
  [Prayer.RAPID_RESTORE]: {
    drainRate: 1,
    renderInOther: true,
  },
  [Prayer.RAPID_HEAL]: {
    drainRate: 2,
    renderInOther: true,
  },
  [Prayer.PROTECT_ITEM]: {
    drainRate: 2,
    renderInOther: true,
  },
  [Prayer.PRESERVE]: {
    drainRate: 2,
    renderInOther: true,
  },
};
