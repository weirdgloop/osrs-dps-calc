import {StaticImageData} from 'next/image';
import Ancient from '@/public/img/potions/Ancient brew.png';
import Attack from '@/public/img/potions/Attack.png';
import Forgotten from '@/public/img/potions/Forgotten brew.png';
import Imbued from '@/public/img/potions/Imbued heart.png';
import Magic from '@/public/img/potions/Magic.png';
import Overload from '@/public/img/potions/Overload.png';
import Ranging from '@/public/img/potions/Ranging.png';
import Saturated from '@/public/img/potions/Saturated heart.png';
import Salts from '@/public/img/potions/Smelling salts.png';
import Strength from '@/public/img/potions/Strength.png';
import SuperAttack from '@/public/img/potions/Super attack.png';
import SuperStrength from '@/public/img/potions/Super strength.png';
import SuperRanging from '@/public/img/potions/Super ranging.png';
import SuperCombat from '@/public/img/potions/Super combat.png';
import SuperMagic from '@/public/img/potions/Super magic.png';

export enum Potion {
  ANCIENT,
  ATTACK,
  FORGOTTEN_BREW,
  IMBUED_HEART,
  MAGIC,
  OVERLOAD,
  OVERLOAD_PLUS,
  RANGING,
  SATURATED_HEART,
  SMELLING_SALTS,
  STRENGTH,
  SUPER_ATTACK,
  SUPER_STRENGTH,
  SUPER_RANGING,
  SUPER_COMBAT,
  SUPER_MAGIC,
}

export const PotionMap: {[k in Potion]: {name: string, image: StaticImageData, desc?: string}} = {
  [Potion.ANCIENT]: {
    name: 'Ancient brew',
    image: Ancient,
    desc: 'Boosts Magic & restores Prayer, but drains Attack/Strength/Defence',
  },
  [Potion.ATTACK]: {
    name: 'Attack potion',
    image: Attack,
    desc: 'Boosts Attack by 3 + 10%',
  },
  [Potion.FORGOTTEN_BREW]: {
    name: 'Forgotten brew',
    image: Forgotten,
    desc: 'Boosts Magic & restores Prayer, but drains Attack/Strength/Defence',
  },
  [Potion.IMBUED_HEART]: {
    name: 'Imbued heart',
    image: Imbued,
    desc: 'Boosts Magic by 1 + 10%',
  },
  [Potion.MAGIC]: {
    name: 'Magic potion',
    image: Magic,
    desc: 'Boosts Magic by 4 levels',
  },
  [Potion.OVERLOAD]: {
    name: 'Overload',
    image: Overload,
    desc: 'Boosts all combat stats by 5 + 13%',
  },
  [Potion.OVERLOAD_PLUS]: {
    name: 'Overload (+)',
    image: Overload,
    desc: 'Boosts all combat stats by 6 + 16%'
  },
  [Potion.RANGING]: {
    name: 'Ranging potion',
    image: Ranging,
    desc: 'Boosts Ranged by 4 + 10%',
  },
  [Potion.SATURATED_HEART]: {
    name: 'Saturated heart',
    image: Saturated,
    desc: 'Boosts Magic by 4 + 10%',
  },
  [Potion.SMELLING_SALTS]: {
    name: 'Smelling salts',
    image: Salts,
    desc: 'Boosts all combat stats by 11 + 16%',
  },
  [Potion.STRENGTH]: {
    name: 'Strength potion',
    image: Strength,
    desc: 'Boosts Strength by 3 + 10%',
  },
  [Potion.SUPER_ATTACK]: {
    name: 'Super attack',
    image: SuperAttack,
    desc: 'Boosts Attack by 5 + 15%',
  },
  [Potion.SUPER_STRENGTH]: {
    name: 'Super strength',
    image: SuperStrength,
    desc: 'Boosts Strength by 5 + 15%',
  },
  [Potion.SUPER_RANGING]: {
    name: 'Super ranging',
    image: SuperRanging,
    desc: 'Boosts Ranged by 5 + 15%',
  },
  [Potion.SUPER_COMBAT]: {
    name: 'Super combat',
    image: SuperCombat,
    desc: 'Boosts Attack, Strength, Defence by 5 + 15%',
  },
  [Potion.SUPER_MAGIC]: {
    name: 'Super magic',
    image: SuperMagic,
    desc: 'Boosts Magic by 5 + 15%',
  }
}