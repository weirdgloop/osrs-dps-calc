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
import AncientStrength from '@/public/img/prayers/Ancient_Strength.webp';
import AncientSight from '@/public/img/prayers/Ancient_Sight.webp';
import AncientWill from '@/public/img/prayers/Ancient_Will.webp';
import Rebuke from '@/public/img/prayers/Rebuke.webp';
import Decimate from '@/public/img/prayers/Decimate.webp';
import Annihilate from '@/public/img/prayers/Annihilate.webp';
import Vaporise from '@/public/img/prayers/Vaporise.webp';
import FumusVow from '@/public/img/prayers/Fumus_Vow.webp';
import UmbrasVow from '@/public/img/prayers/Umbras_Vow.webp';
import CruorsVow from '@/public/img/prayers/Cruors_Vow.webp';
import GlaciesVow from '@/public/img/prayers/Glacies_Vow.webp';
import Intensify from '@/public/img/prayers/Intensify.webp';
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
  ANCIENT_STRENGTH,
  ANCIENT_SIGHT,
  ANCIENT_WILL,
  REBUKE,
  DECIMATE,
  ANNIHILATE,
  VAPORISE,
  FUMUS_VOW,
  UMBRAS_VOW,
  CRUORS_VOW,
  GLACIES_VOW,
  INTENSIFY
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

export const STANDARD_PRAYERS = [
  Prayer.BURST_OF_STRENGTH,
  Prayer.CLARITY_OF_THOUGHT,
  Prayer.SHARP_EYE,
  Prayer.MYSTIC_WILL,
  Prayer.SUPERHUMAN_STRENGTH,
  Prayer.IMPROVED_REFLEXES,
  Prayer.HAWK_EYE,
  Prayer.MYSTIC_LORE,
  Prayer.ULTIMATE_STRENGTH,
  Prayer.INCREDIBLE_REFLEXES,
  Prayer.EAGLE_EYE,
  Prayer.MYSTIC_MIGHT,
  Prayer.CHIVALRY,
  Prayer.PIETY,
  Prayer.RIGOUR,
  Prayer.AUGURY,
]

export const RUINOUS_PRAYERS = [
  Prayer.ANCIENT_STRENGTH,
  Prayer.ANCIENT_SIGHT,
  Prayer.ANCIENT_WILL,
  Prayer.REBUKE,
  Prayer.DECIMATE,
  Prayer.ANNIHILATE,
  Prayer.VAPORISE,
  Prayer.FUMUS_VOW,
  Prayer.UMBRAS_VOW,
  Prayer.CRUORS_VOW,
  Prayer.GLACIES_VOW,
  Prayer.INTENSIFY
]

export const PrayerMap: {[k in Prayer]: {name: string, image: StaticImageData}} = {
  [Prayer.BURST_OF_STRENGTH]: {
    name: 'Burst of Strength',
    image: BurstOfStrength,
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    name: 'Clarity of Thought',
    image: ClarityOfThought,
  },
  [Prayer.SHARP_EYE]: {
    name: 'Sharp Eye',
    image: SharpEye,
  },
  [Prayer.MYSTIC_WILL]: {
    name: 'Mystic Will',
    image: MysticWill,
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    name: 'Superhuman Strength',
    image: SuperhumanStrength,
  },
  [Prayer.IMPROVED_REFLEXES]: {
    name: 'Improved Reflexes',
    image: ImprovedReflexes,
  },
  [Prayer.HAWK_EYE]: {
    name: 'Hawk Eye',
    image: HawkEye,
  },
  [Prayer.MYSTIC_LORE]: {
    name: 'Mystic Lore',
    image: MysticLore,
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    name: 'Ultimate Strength',
    image: UltimateStrength,
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    name: 'Incredible Reflexes',
    image: IncredibleReflexes,
  },
  [Prayer.EAGLE_EYE]: {
    name: 'Eagle Eye',
    image: EagleEye,
  },
  [Prayer.MYSTIC_MIGHT]: {
    name: 'Mystic Might',
    image: MysticMight,
  },
  [Prayer.CHIVALRY]: {
    name: 'Chivalry',
    image: Chivalry,
  },
  [Prayer.PIETY]: {
    name: 'Piety',
    image: Piety,
  },
  [Prayer.RIGOUR]: {
    name: 'Rigour',
    image: Rigour,
  },
  [Prayer.AUGURY]: {
    name: 'Augury',
    image: Augury,
  },
  [Prayer.ANCIENT_STRENGTH]: {
    name: 'Ancient Strength',
    image: AncientStrength
  },
  [Prayer.ANCIENT_SIGHT]: {
    name: 'Ancient Sight',
    image: AncientSight
  },
  [Prayer.ANCIENT_WILL]: {
    name: 'Ancient Will',
    image: AncientWill
  },
  [Prayer.REBUKE]: {
    name: 'Rebuke',
    image: Rebuke
  },
  [Prayer.DECIMATE]: {
    name: 'Decimate',
    image: Decimate
  },
  [Prayer.ANNIHILATE]: {
    name: 'Annihilate',
    image: Annihilate
  },
  [Prayer.VAPORISE]: {
    name: 'Vaporise',
    image: Vaporise
  },
  [Prayer.FUMUS_VOW]: {
    name: 'Fumus\' Vow',
    image: FumusVow
  },
  [Prayer.UMBRAS_VOW]: {
    name: 'Umbra\'s Vow',
    image: UmbrasVow
  },
  [Prayer.CRUORS_VOW]: {
    name: 'Cruor\'s Vow',
    image: CruorsVow
  },
  [Prayer.GLACIES_VOW]: {
    name: 'Glacie\'s Vow',
    image: GlaciesVow
  },
  [Prayer.INTENSIFY]: {
    name: 'Intensify',
    image: Intensify
  }
}