import ThickSkin from '@/img/prayers/Thick_Skin.png';
import BurstOfStrength from '@/img/prayers/Burst_of_Strength.png';
import ClarityOfThought from '@/img/prayers/Clarity_of_Thought.png';
import SharpEye from '@/img/prayers/Sharp_Eye.png';
import MysticWill from '@/img/prayers/Mystic_Will.png';
import RockSkin from '@/img/prayers/Rock_Skin.png';
import SuperhumanStrength from '@/img/prayers/Superhuman_Strength.png';
import ImprovedReflexes from '@/img/prayers/Improved_Reflexes.png';
import RapidRestore from '@/img/prayers/Rapid_Restore.png';
import RapidHeal from '@/img/prayers/Rapid_Heal.png';
import ProtectItem from '@/img/prayers/Protect_Item.png';
import HawkEye from '@/img/prayers/Hawk_Eye.png';
import MysticLore from '@/img/prayers/Mystic_Lore.png';
import SteelSkin from '@/img/prayers/Steel_Skin.png';
import UltimateStrength from '@/img/prayers/Ultimate_Strength.png';
import IncredibleReflexes from '@/img/prayers/Incredible_Reflexes.png';
import ProtectMagic from '@/img/prayers/Protect_from_Magic.png';
import ProtectMissiles from '@/img/prayers/Protect_from_Missiles.png';
import ProtectMelee from '@/img/prayers/Protect_from_Melee.png';
import EagleEye from '@/img/prayers/Eagle_Eye.png';
import MysticMight from '@/img/prayers/Mystic_Might.png';
import Retribution from '@/img/prayers/Retribution.png';
import Redemption from '@/img/prayers/Redemption.png';
import Smite from '@/img/prayers/Smite.png';
import Preserve from '@/img/prayers/Preserve.png';
import Chivalry from '@/img/prayers/Chivalry.png';
import Piety from '@/img/prayers/Piety.png';
import Rigour from '@/img/prayers/Rigour.png';
import Augury from '@/img/prayers/Augury.png';
import {StaticImageData} from 'next/image';

export enum Prayer {
  THICK_SKIN,
  BURST_OF_STRENGTH,
  CLARITY_OF_THOUGHT,
  SHARP_EYE,
  MYSTIC_WILL,
  ROCK_SKIN,
  SUPERHUMAN_STRENGTH,
  IMPROVED_REFLEXES,
  RAPID_RESTORE,
  RAPID_HEAL,
  PROTECT_ITEM,
  HAWK_EYE,
  MYSTIC_LORE,
  STEEL_SKIN,
  ULTIMATE_STRENGTH,
  INCREDIBLE_REFLEXES,
  PROTECT_FROM_MAGIC,
  PROTECT_FROM_MISSILES,
  PROTECT_FROM_MELEE,
  EAGLE_EYE,
  MYSTIC_MIGHT,
  RETRIBUTION,
  REDEMPTION,
  SMITE,
  PRESERVE,
  CHIVALRY,
  PIETY,
  RIGOUR,
  AUGURY,
}

export const PrayerMap: {[k in Prayer]: {name: string, image: StaticImageData}} = {
  [Prayer.THICK_SKIN]: {
    name: 'Thick Skin',
    image: ThickSkin
  },
  [Prayer.BURST_OF_STRENGTH]: {
    name: 'Burst of Strength',
    image: BurstOfStrength
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    name: 'Clarity of Thought',
    image: ClarityOfThought
  },
  [Prayer.SHARP_EYE]: {
    name: 'Sharp Eye',
    image: SharpEye
  },
  [Prayer.MYSTIC_WILL]: {
    name: 'Mystic Will',
    image: MysticWill
  },
  [Prayer.ROCK_SKIN]: {
    name: 'Rock Skin',
    image: RockSkin
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    name: 'Superhuman Strength',
    image: SuperhumanStrength
  },
  [Prayer.IMPROVED_REFLEXES]: {
    name: 'Improved Reflexes',
    image: ImprovedReflexes
  },
  [Prayer.RAPID_RESTORE]: {
    name: 'Rapid Restore',
    image: RapidRestore
  },
  [Prayer.RAPID_HEAL]: {
    name: 'Rapid Heal',
    image: RapidHeal
  },
  [Prayer.PROTECT_ITEM]: {
    name: 'Protect Item',
    image: ProtectItem
  },
  [Prayer.HAWK_EYE]: {
    name: 'Hawk Eye',
    image: HawkEye
  },
  [Prayer.MYSTIC_LORE]: {
    name: 'Mystic Lore',
    image: MysticLore
  },
  [Prayer.STEEL_SKIN]: {
    name: 'Steel Skin',
    image: SteelSkin
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    name: 'Ultimate Strength',
    image: UltimateStrength
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    name: 'Incredible Reflexes',
    image: IncredibleReflexes
  },
  [Prayer.PROTECT_FROM_MAGIC]: {
    name: 'Protect from Magic',
    image: ProtectMagic
  },
  [Prayer.PROTECT_FROM_MISSILES]: {
    name: 'Protect from Missiles',
    image: ProtectMissiles
  },
  [Prayer.PROTECT_FROM_MELEE]: {
    name: 'Protect from Melee',
    image: ProtectMelee
  },
  [Prayer.EAGLE_EYE]: {
    name: 'Eagle Eye',
    image: EagleEye
  },
  [Prayer.MYSTIC_MIGHT]: {
    name: 'Mystic Might',
    image: MysticMight
  },
  [Prayer.RETRIBUTION]: {
    name: 'Retribution',
    image: Retribution
  },
  [Prayer.REDEMPTION]: {
    name: 'Redemption',
    image: Redemption
  },
  [Prayer.SMITE]: {
    name: 'Smite',
    image: Smite
  },
  [Prayer.PRESERVE]: {
    name: 'Preserve',
    image: Preserve
  },
  [Prayer.CHIVALRY]: {
    name: 'Chivalry',
    image: Chivalry
  },
  [Prayer.PIETY]: {
    name: 'Piety',
    image: Piety
  },
  [Prayer.RIGOUR]: {
    name: 'Rigour',
    image: Rigour
  },
  [Prayer.AUGURY]: {
    name: 'Augury',
    image: Augury
  }
}