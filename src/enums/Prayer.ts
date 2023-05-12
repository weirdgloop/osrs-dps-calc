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

export const PrayerMap: {[k in Prayer]: {name: string, image: StaticImageData, incompatibleWith: Prayer[]}} = {
  [Prayer.BURST_OF_STRENGTH]: {
    name: 'Burst of Strength',
    image: BurstOfStrength,
    incompatibleWith: [
      Prayer.SUPERHUMAN_STRENGTH,
      Prayer.ULTIMATE_STRENGTH,
      Prayer.CHIVALRY,
      Prayer.PIETY
    ]
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    name: 'Clarity of Thought',
    image: ClarityOfThought,
    incompatibleWith: [
      Prayer.IMPROVED_REFLEXES,
      Prayer.INCREDIBLE_REFLEXES,
      Prayer.CHIVALRY,
      Prayer.PIETY
    ]
  },
  [Prayer.SHARP_EYE]: {
    name: 'Sharp Eye',
    image: SharpEye,
    incompatibleWith: [
      Prayer.HAWK_EYE,
      Prayer.EAGLE_EYE,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.MYSTIC_WILL]: {
    name: 'Mystic Will',
    image: MysticWill,
    incompatibleWith: [
      Prayer.MYSTIC_LORE,
      Prayer.MYSTIC_MIGHT,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    name: 'Superhuman Strength',
    image: SuperhumanStrength,
    incompatibleWith: [
      Prayer.BURST_OF_STRENGTH,
      Prayer.ULTIMATE_STRENGTH,
      Prayer.CHIVALRY,
      Prayer.PIETY
    ]
  },
  [Prayer.IMPROVED_REFLEXES]: {
    name: 'Improved Reflexes',
    image: ImprovedReflexes,
    incompatibleWith: [
      Prayer.CLARITY_OF_THOUGHT,
      Prayer.INCREDIBLE_REFLEXES,
      Prayer.CHIVALRY,
      Prayer.PIETY
    ]
  },
  [Prayer.HAWK_EYE]: {
    name: 'Hawk Eye',
    image: HawkEye,
    incompatibleWith: [
      Prayer.SHARP_EYE,
      Prayer.EAGLE_EYE,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.MYSTIC_LORE]: {
    name: 'Mystic Lore',
    image: MysticLore,
    incompatibleWith: [
      Prayer.MYSTIC_WILL,
      Prayer.MYSTIC_MIGHT,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    name: 'Ultimate Strength',
    image: UltimateStrength,
    incompatibleWith: [
      Prayer.BURST_OF_STRENGTH,
      Prayer.SUPERHUMAN_STRENGTH,
      Prayer.CHIVALRY,
      Prayer.PIETY
    ]
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    name: 'Incredible Reflexes',
    image: IncredibleReflexes,
    incompatibleWith: [
      Prayer.CLARITY_OF_THOUGHT,
      Prayer.IMPROVED_REFLEXES,
      Prayer.CHIVALRY,
      Prayer.PIETY
    ]
  },
  [Prayer.EAGLE_EYE]: {
    name: 'Eagle Eye',
    image: EagleEye,
    incompatibleWith: [
      Prayer.SHARP_EYE,
      Prayer.HAWK_EYE,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.MYSTIC_MIGHT]: {
    name: 'Mystic Might',
    image: MysticMight,
    incompatibleWith: [
      Prayer.MYSTIC_WILL,
      Prayer.MYSTIC_LORE,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.CHIVALRY]: {
    name: 'Chivalry',
    image: Chivalry,
    incompatibleWith: [
      Prayer.BURST_OF_STRENGTH,
      Prayer.SUPERHUMAN_STRENGTH,
      Prayer.ULTIMATE_STRENGTH,
      Prayer.CLARITY_OF_THOUGHT,
      Prayer.IMPROVED_REFLEXES,
      Prayer.INCREDIBLE_REFLEXES,
      Prayer.PIETY,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.PIETY]: {
    name: 'Piety',
    image: Piety,
    incompatibleWith: [
      Prayer.BURST_OF_STRENGTH,
      Prayer.SUPERHUMAN_STRENGTH,
      Prayer.ULTIMATE_STRENGTH,
      Prayer.CLARITY_OF_THOUGHT,
      Prayer.IMPROVED_REFLEXES,
      Prayer.INCREDIBLE_REFLEXES,
      Prayer.CHIVALRY,
      Prayer.RIGOUR,
      Prayer.AUGURY,
    ]
  },
  [Prayer.RIGOUR]: {
    name: 'Rigour',
    image: Rigour,
    incompatibleWith: [
      Prayer.BURST_OF_STRENGTH,
      Prayer.SUPERHUMAN_STRENGTH,
      Prayer.ULTIMATE_STRENGTH,
      Prayer.CLARITY_OF_THOUGHT,
      Prayer.IMPROVED_REFLEXES,
      Prayer.INCREDIBLE_REFLEXES,
      Prayer.PIETY,
      Prayer.CHIVALRY,
      Prayer.SHARP_EYE,
      Prayer.HAWK_EYE,
      Prayer.EAGLE_EYE,
      Prayer.MYSTIC_WILL,
      Prayer.MYSTIC_MIGHT,
      Prayer.MYSTIC_LORE,
      Prayer.AUGURY,
    ]
  },
  [Prayer.AUGURY]: {
    name: 'Augury',
    image: Augury,
    incompatibleWith: [
      Prayer.BURST_OF_STRENGTH,
      Prayer.SUPERHUMAN_STRENGTH,
      Prayer.ULTIMATE_STRENGTH,
      Prayer.CLARITY_OF_THOUGHT,
      Prayer.IMPROVED_REFLEXES,
      Prayer.INCREDIBLE_REFLEXES,
      Prayer.PIETY,
      Prayer.CHIVALRY,
      Prayer.SHARP_EYE,
      Prayer.HAWK_EYE,
      Prayer.EAGLE_EYE,
      Prayer.MYSTIC_WILL,
      Prayer.MYSTIC_MIGHT,
      Prayer.MYSTIC_LORE,
      Prayer.RIGOUR,
    ]
  }
}