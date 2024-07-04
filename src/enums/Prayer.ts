import BurstOfStrength from '@/public/img/prayers/Burst_of_Strength.png';
import ClarityOfThought from '@/public/img/prayers/Clarity_of_Thought.png';
import SharpEye from '@/public/img/prayers/Sharp_Eye.png';
import MysticWill from '@/public/img/prayers/Mystic_Will.png';
import SuperhumanStrength from '@/public/img/prayers/Superhuman_Strength.png';
import ImprovedReflexes from '@/public/img/prayers/Improved_Reflexes.png';
import HawkEye from '@/public/img/prayers/Hawk_Eye.png';
import MysticLore from '@/public/img/prayers/Mystic_Lore.png';
import UltimateStrength from '@/public/img/prayers/Ultimate_Strength.png';
import IncredibleReflexes from '@/public/img/prayers/Incredible_Reflexes.png';
import EagleEye from '@/public/img/prayers/Eagle_Eye.png';
import MysticMight from '@/public/img/prayers/Mystic_Might.png';
import Chivalry from '@/public/img/prayers/Chivalry.png';
import Piety from '@/public/img/prayers/Piety.png';
import Rigour from '@/public/img/prayers/Rigour.png';
import Augury from '@/public/img/prayers/Augury.png';
import ThickSkin from '@/public/img/prayers/Thick Skin.png';
import RockSkin from '@/public/img/prayers/Rock Skin.png';
import SteelSkin from '@/public/img/prayers/Steel Skin.png';
// import ProtectMagic from '@/public/img/prayers/Protect_from_Magic.png';
// import ProtectMelee from '@/public/img/prayers/Protect_from_Melee.png';
// import ProtectRanged from '@/public/img/prayers/Protect_from_Missiles.png';
// import Redemption from '@/public/img/prayers/Redemption.png';
// import Retribution from '@/public/img/prayers/Retribution.png';
// import Smite from '@/public/img/prayers/Smite.png';
import { StaticImageData } from 'next/image';
import { Factor } from '@/lib/Math';

// The values of this enum is used in the calc state and shortlinks. Do not re-order.
export enum Prayer {
  BURST_OF_STRENGTH,
  CLARITY_OF_THOUGHT,
  SHARP_EYE,
  MYSTIC_WILL,
  SUPERHUMAN_STRENGTH,
  IMPROVED_REFLEXES,
  HAWK_EYE,
  MYSTIC_LORE,
  ULTIMATE_STRENGTH,
  INCREDIBLE_REFLEXES,
  EAGLE_EYE,
  MYSTIC_MIGHT,
  CHIVALRY,
  PIETY,
  RIGOUR,
  AUGURY,
  THICK_SKIN,
  ROCK_SKIN,
  STEEL_SKIN,
  // PROTECT_MAGIC,
  // PROTECT_RANGED,
  // PROTECT_MELEE,
  // RETRIBUTION,
  // REDEMPTION,
  // SMITE,
}

export const DEFENSIVE_PRAYERS: Prayer[] = [
  Prayer.THICK_SKIN, Prayer.ROCK_SKIN, Prayer.STEEL_SKIN,
  Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY,
];

export const OFFENSIVE_PRAYERS: Prayer[] = [
  Prayer.BURST_OF_STRENGTH, Prayer.CLARITY_OF_THOUGHT, Prayer.SHARP_EYE, Prayer.MYSTIC_WILL, Prayer.SUPERHUMAN_STRENGTH,
  Prayer.IMPROVED_REFLEXES, Prayer.HAWK_EYE, Prayer.MYSTIC_LORE, Prayer.ULTIMATE_STRENGTH, Prayer.INCREDIBLE_REFLEXES,
  Prayer.EAGLE_EYE, Prayer.MYSTIC_MIGHT, Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY,
];

export const BRAIN_PRAYERS: Prayer[] = [
  Prayer.CLARITY_OF_THOUGHT, Prayer.IMPROVED_REFLEXES, Prayer.INCREDIBLE_REFLEXES,
];

export const ARM_PRAYERS: Prayer[] = [
  Prayer.BURST_OF_STRENGTH, Prayer.SUPERHUMAN_STRENGTH, Prayer.ULTIMATE_STRENGTH,
];

export const OVERHEAD_PRAYERS: Prayer[] = [
  // Prayer.PROTECT_MAGIC, Prayer.PROTECT_RANGED, Prayer.PROTECT_MELEE,
  // Prayer.RETRIBUTION, Prayer.REDEMPTION, Prayer.SMITE,
];

export type PrayerCombatStyle = 'magic' | 'ranged' | 'melee';
export interface PrayerData {
  name: string,
  image: StaticImageData,
  drainRate: number;
  combatStyle?: PrayerCombatStyle,
  magicDamageBonus?: number,
  factorAccuracy?: Factor,
  factorStrength?: Factor,
  factorDefence?: Factor,
  // there aren't currently any prayers that have distinct factorDefence and factorDefenceMagic,
  // but it could happen in the future, and we have no actual idea how that would work
  factorDefenceMagic?: Factor,
}

export const PrayerMap: { [k in Prayer]: PrayerData } = {
  [Prayer.BURST_OF_STRENGTH]: {
    name: 'Burst of Strength',
    image: BurstOfStrength,
    drainRate: 1,
    combatStyle: 'melee',
    factorStrength: [21, 20],
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    name: 'Clarity of Thought',
    image: ClarityOfThought,
    drainRate: 1,
    combatStyle: 'melee',
    factorAccuracy: [21, 20],
  },
  [Prayer.SHARP_EYE]: {
    name: 'Sharp Eye',
    image: SharpEye,
    drainRate: 1,
    combatStyle: 'ranged',
    factorAccuracy: [21, 20],
    factorStrength: [21, 20],
  },
  [Prayer.MYSTIC_WILL]: {
    name: 'Mystic Will',
    image: MysticWill,
    drainRate: 1,
    combatStyle: 'magic',
    factorAccuracy: [21, 20],
    factorDefenceMagic: [21, 20],
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    name: 'Superhuman Strength',
    image: SuperhumanStrength,
    drainRate: 6,
    combatStyle: 'melee',
    factorStrength: [11, 10],
  },
  [Prayer.IMPROVED_REFLEXES]: {
    name: 'Improved Reflexes',
    image: ImprovedReflexes,
    drainRate: 6,
    combatStyle: 'melee',
    factorAccuracy: [11, 10],
  },
  [Prayer.HAWK_EYE]: {
    name: 'Hawk Eye',
    image: HawkEye,
    drainRate: 6,
    combatStyle: 'ranged',
    factorAccuracy: [11, 10],
    factorStrength: [11, 10],
  },
  [Prayer.MYSTIC_LORE]: {
    name: 'Mystic Lore',
    image: MysticLore,
    drainRate: 6,
    combatStyle: 'magic',
    magicDamageBonus: 10,
    factorAccuracy: [11, 10],
    factorDefenceMagic: [11, 10],
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    name: 'Ultimate Strength',
    image: UltimateStrength,
    drainRate: 12,
    combatStyle: 'melee',
    factorStrength: [23, 20],
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    name: 'Incredible Reflexes',
    image: IncredibleReflexes,
    drainRate: 12,
    combatStyle: 'melee',
    factorAccuracy: [23, 20],
  },
  [Prayer.EAGLE_EYE]: {
    name: 'Eagle Eye',
    image: EagleEye,
    drainRate: 12,
    combatStyle: 'ranged',
    factorAccuracy: [23, 20],
    factorStrength: [23, 20],
  },
  [Prayer.MYSTIC_MIGHT]: {
    name: 'Mystic Might',
    image: MysticMight,
    drainRate: 12,
    combatStyle: 'magic',
    magicDamageBonus: 20,
    factorAccuracy: [23, 20],
    factorDefenceMagic: [23, 20],
  },
  [Prayer.CHIVALRY]: {
    name: 'Chivalry',
    image: Chivalry,
    drainRate: 24,
    combatStyle: 'melee',
    factorAccuracy: [23, 20],
    factorStrength: [118, 100],
    factorDefence: [6, 5],
  },
  [Prayer.PIETY]: {
    name: 'Piety',
    image: Piety,
    drainRate: 24,
    combatStyle: 'melee',
    factorAccuracy: [6, 5],
    factorStrength: [123, 100],
    factorDefence: [5, 4],
  },
  [Prayer.RIGOUR]: {
    name: 'Rigour',
    image: Rigour,
    drainRate: 24,
    combatStyle: 'ranged',
    factorAccuracy: [6, 5],
    factorStrength: [123, 100],
    factorDefence: [5, 4],
  },
  [Prayer.AUGURY]: {
    name: 'Augury',
    image: Augury,
    drainRate: 24,
    combatStyle: 'magic',
    magicDamageBonus: 40,
    factorAccuracy: [5, 4],
    factorDefence: [5, 4],
    factorDefenceMagic: [5, 4],
  },
  [Prayer.THICK_SKIN]: {
    name: 'Thick Skin',
    image: ThickSkin,
    drainRate: 1,
    factorDefence: [21, 20],
  },
  [Prayer.ROCK_SKIN]: {
    name: 'Rock Skin',
    image: RockSkin,
    drainRate: 6,
    factorDefence: [11, 10],
  },
  [Prayer.STEEL_SKIN]: {
    name: 'Steel Skin',
    image: SteelSkin,
    drainRate: 12,
    factorDefence: [23, 20],
  },
  // [Prayer.PROTECT_MAGIC]: {
  //   name: 'Protect from Magic',
  //   image: ProtectMagic,
  //   drainRate: 12,
  // },
  // [Prayer.PROTECT_MELEE]: {
  //   name: 'Protect from Melee',
  //   image: ProtectMelee,
  //   drainRate: 12,
  // },
  // [Prayer.PROTECT_RANGED]: {
  //   name: 'Protect from Missiles',
  //   image: ProtectRanged,
  //   drainRate: 12,
  // },
  // [Prayer.RETRIBUTION]: {
  //   name: 'Retribution',
  //   image: Retribution,
  //   drainRate: 3,
  // },
  // [Prayer.REDEMPTION]: {
  //   name: 'Redemption',
  //   image: Redemption,
  //   drainRate: 6,
  // },
  // [Prayer.SMITE]: {
  //   name: 'Smite',
  //   image: Smite,
  //   drainRate: 18,
  // },
};
