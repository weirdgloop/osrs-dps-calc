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
import Deadeye from '@/public/img/prayers/Deadeye.png';
import MysticVigour from '@/public/img/prayers/Mystic_Vigour.png';
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
  BURST_OF_STRENGTH = 0,
  CLARITY_OF_THOUGHT = 1,
  SHARP_EYE = 2,
  MYSTIC_WILL = 3,
  SUPERHUMAN_STRENGTH = 4,
  IMPROVED_REFLEXES = 5,
  HAWK_EYE = 6,
  MYSTIC_LORE = 7,
  ULTIMATE_STRENGTH = 8,
  INCREDIBLE_REFLEXES = 9,
  EAGLE_EYE = 10,
  MYSTIC_MIGHT = 11,
  CHIVALRY = 12,
  PIETY = 13,
  RIGOUR = 14,
  AUGURY = 15,
  THICK_SKIN = 16,
  ROCK_SKIN = 17,
  STEEL_SKIN = 18,
  DEADEYE = 19,
  MYSTIC_VIGOUR = 20,
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
  Prayer.EAGLE_EYE, Prayer.MYSTIC_MIGHT, Prayer.DEADEYE, Prayer.MYSTIC_VIGOUR, Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY,
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
  renderOrder?: number,
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
    renderOrder: 1,
    name: 'Burst of Strength',
    image: BurstOfStrength,
    drainRate: 1,
    combatStyle: 'melee',
    factorStrength: [21, 20],
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    renderOrder: 2,
    name: 'Clarity of Thought',
    image: ClarityOfThought,
    drainRate: 1,
    combatStyle: 'melee',
    factorAccuracy: [21, 20],
  },
  [Prayer.SHARP_EYE]: {
    renderOrder: 3,
    name: 'Sharp Eye',
    image: SharpEye,
    drainRate: 1,
    combatStyle: 'ranged',
    factorAccuracy: [21, 20],
    factorStrength: [21, 20],
  },
  [Prayer.MYSTIC_WILL]: {
    renderOrder: 4,
    name: 'Mystic Will',
    image: MysticWill,
    drainRate: 1,
    combatStyle: 'magic',
    factorAccuracy: [21, 20],
    factorDefenceMagic: [21, 20],
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    renderOrder: 5,
    name: 'Superhuman Strength',
    image: SuperhumanStrength,
    drainRate: 6,
    combatStyle: 'melee',
    factorStrength: [11, 10],
  },
  [Prayer.IMPROVED_REFLEXES]: {
    renderOrder: 6,
    name: 'Improved Reflexes',
    image: ImprovedReflexes,
    drainRate: 6,
    combatStyle: 'melee',
    factorAccuracy: [11, 10],
  },
  [Prayer.HAWK_EYE]: {
    renderOrder: 7,
    name: 'Hawk Eye',
    image: HawkEye,
    drainRate: 6,
    combatStyle: 'ranged',
    factorAccuracy: [11, 10],
    factorStrength: [11, 10],
  },
  [Prayer.MYSTIC_LORE]: {
    renderOrder: 8,
    name: 'Mystic Lore',
    image: MysticLore,
    drainRate: 6,
    combatStyle: 'magic',
    magicDamageBonus: 10,
    factorAccuracy: [11, 10],
    factorDefenceMagic: [11, 10],
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    renderOrder: 9,
    name: 'Ultimate Strength',
    image: UltimateStrength,
    drainRate: 12,
    combatStyle: 'melee',
    factorStrength: [23, 20],
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    renderOrder: 10,
    name: 'Incredible Reflexes',
    image: IncredibleReflexes,
    drainRate: 12,
    combatStyle: 'melee',
    factorAccuracy: [23, 20],
  },
  [Prayer.EAGLE_EYE]: {
    renderOrder: 11,
    name: 'Eagle Eye',
    image: EagleEye,
    drainRate: 12,
    combatStyle: 'ranged',
    factorAccuracy: [23, 20],
    factorStrength: [23, 20],
  },
  [Prayer.MYSTIC_MIGHT]: {
    renderOrder: 12,
    name: 'Mystic Might',
    image: MysticMight,
    drainRate: 12,
    combatStyle: 'magic',
    magicDamageBonus: 20,
    factorAccuracy: [23, 20],
    factorDefenceMagic: [23, 20],
  },
  [Prayer.CHIVALRY]: {
    renderOrder: 14,
    name: 'Chivalry',
    image: Chivalry,
    drainRate: 24,
    combatStyle: 'melee',
    factorAccuracy: [23, 20],
    factorStrength: [118, 100],
    factorDefence: [6, 5],
  },
  [Prayer.PIETY]: {
    renderOrder: 18,
    name: 'Piety',
    image: Piety,
    drainRate: 24,
    combatStyle: 'melee',
    factorAccuracy: [6, 5],
    factorStrength: [123, 100],
    factorDefence: [5, 4],
  },
  [Prayer.RIGOUR]: {
    renderOrder: 19,
    name: 'Rigour',
    image: Rigour,
    drainRate: 24,
    combatStyle: 'ranged',
    factorAccuracy: [6, 5],
    factorStrength: [123, 100],
    factorDefence: [5, 4],
  },
  [Prayer.AUGURY]: {
    renderOrder: 20,
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
    renderOrder: 13,
    name: 'Thick Skin',
    image: ThickSkin,
    drainRate: 1,
    factorDefence: [21, 20],
  },
  [Prayer.ROCK_SKIN]: {
    renderOrder: 17,
    name: 'Rock Skin',
    image: RockSkin,
    drainRate: 6,
    factorDefence: [11, 10],
  },
  [Prayer.STEEL_SKIN]: {
    renderOrder: 21,
    name: 'Steel Skin',
    image: SteelSkin,
    drainRate: 12,
    factorDefence: [23, 20],
  },
  [Prayer.DEADEYE]: {
    renderOrder: 15,
    name: 'Deadeye',
    image: Deadeye,
    drainRate: 12,
    combatStyle: 'ranged',
    factorAccuracy: [59, 50],
    factorDefence: [21, 20],
  },
  [Prayer.MYSTIC_VIGOUR]: {
    renderOrder: 16,
    name: 'Mystic Vigour',
    image: MysticVigour,
    drainRate: 12,
    combatStyle: 'magic',
    factorAccuracy: [59, 50],
    factorDefenceMagic: [21, 20],
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
