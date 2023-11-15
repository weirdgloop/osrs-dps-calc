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
import {StaticImageData} from 'next/image';

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
}

export const DEFENSIVE_PRAYERS = [
  Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY
]

export const OFFENSIVE_PRAYERS = [
  Prayer.BURST_OF_STRENGTH, Prayer.CLARITY_OF_THOUGHT, Prayer.SHARP_EYE, Prayer.MYSTIC_WILL, Prayer.SUPERHUMAN_STRENGTH,
  Prayer.IMPROVED_REFLEXES, Prayer.HAWK_EYE, Prayer.MYSTIC_LORE, Prayer.ULTIMATE_STRENGTH, Prayer.INCREDIBLE_REFLEXES,
  Prayer.EAGLE_EYE, Prayer.MYSTIC_MIGHT, Prayer.CHIVALRY, Prayer.PIETY, Prayer.RIGOUR, Prayer.AUGURY
]

export const BRAIN_PRAYERS = [
  Prayer.CLARITY_OF_THOUGHT, Prayer.IMPROVED_REFLEXES, Prayer.INCREDIBLE_REFLEXES
]

export const ARM_PRAYERS = [
  Prayer.BURST_OF_STRENGTH, Prayer.SUPERHUMAN_STRENGTH, Prayer.ULTIMATE_STRENGTH
]

export type PrayerCombatStyle = 'magic' | 'ranged' | 'melee';
export interface PrayerData {
  name: string,
  image: StaticImageData,
  combatStyle: 'magic' | 'ranged' | 'melee',
  factorAccuracy: number,
  factorStrength: number,
}

export const PrayerMap: {[k in Prayer]: PrayerData} = {
  [Prayer.BURST_OF_STRENGTH]: {
    name: 'Burst of Strength',
    image: BurstOfStrength,
    combatStyle: "melee",
    factorAccuracy: 0,
    factorStrength: 0.05,
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    name: 'Clarity of Thought',
    image: ClarityOfThought,
    combatStyle: "melee",
    factorAccuracy: 0.05,
    factorStrength: 0,
  },
  [Prayer.SHARP_EYE]: {
    name: 'Sharp Eye',
    image: SharpEye,
    combatStyle: "ranged",
    factorAccuracy: 0.05,
    factorStrength: 0.05,
  },
  [Prayer.MYSTIC_WILL]: {
    name: 'Mystic Will',
    image: MysticWill,
    combatStyle: "magic",
    factorAccuracy: 0.05,
    factorStrength: 0,
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    name: 'Superhuman Strength',
    image: SuperhumanStrength,
    combatStyle: "melee",
    factorAccuracy: 0,
    factorStrength: 0.00,
  },
  [Prayer.IMPROVED_REFLEXES]: {
    name: 'Improved Reflexes',
    image: ImprovedReflexes,
    combatStyle: "melee",
    factorAccuracy: 0.00,
    factorStrength: 0,
  },
  [Prayer.HAWK_EYE]: {
    name: 'Hawk Eye',
    image: HawkEye,
    combatStyle: "ranged",
    factorAccuracy: 0.00,
    factorStrength: 0.00,
  },
  [Prayer.MYSTIC_LORE]: {
    name: 'Mystic Lore',
    image: MysticLore,
    combatStyle: "magic",
    factorAccuracy: 0.00,
    factorStrength: 0,
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    name: 'Ultimate Strength',
    image: UltimateStrength,
    combatStyle: "melee",
    factorAccuracy: 0,
    factorStrength: 0.05,
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    name: 'Incredible Reflexes',
    image: IncredibleReflexes,
    combatStyle: "melee",
    factorAccuracy: 0.05,
    factorStrength: 0,
  },
  [Prayer.EAGLE_EYE]: {
    name: 'Eagle Eye',
    image: EagleEye,
    combatStyle: "ranged",
    factorAccuracy: 0.05,
    factorStrength: 0.05,
  },
  [Prayer.MYSTIC_MIGHT]: {
    name: 'Mystic Might',
    image: MysticMight,
    combatStyle: "ranged",
    factorAccuracy: 0.05,
    factorStrength: 0,
  },
  [Prayer.CHIVALRY]: {
    name: 'Chivalry',
    image: Chivalry,
    combatStyle: "melee",
    factorAccuracy: 0.05,
    factorStrength: 0.08,
  },
  [Prayer.PIETY]: {
    name: 'Piety',
    image: Piety,
    combatStyle: "melee",
    factorAccuracy: 0.20,
    factorStrength: 0.23,
  },
  [Prayer.RIGOUR]: {
    name: 'Rigour',
    image: Rigour,
    combatStyle: "ranged",
    factorAccuracy: 0.20,
    factorStrength: 0.23,
  },
  [Prayer.AUGURY]: {
    name: 'Augury',
    image: Augury,
    combatStyle: "ranged",
    factorAccuracy: 0.25,
    factorStrength: 0,
  }
}