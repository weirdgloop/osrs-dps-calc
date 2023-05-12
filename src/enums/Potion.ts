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

export enum Potion {
  ANCIENT,
  ATTACK,
  FORGOTTEN_BREW,
  IMBUED_HEART,
  MAGIC,
  OVERLOAD,
  RANGING,
  SATURATED_HEART,
  SMELLING_SALTS,
  STRENGTH,
  SUPER_ATTACK,
  SUPER_STRENGTH,
}

export const PotionMap: {[k in Potion]: {name: string, image: StaticImageData}} = {
  [Potion.ANCIENT]: {
    name: 'Ancient potion',
    image: Ancient
  },
  [Potion.ATTACK]: {
    name: 'Attack potion',
    image: Attack
  },
  [Potion.FORGOTTEN_BREW]: {
    name: 'Forgotten brew',
    image: Forgotten
  },
  [Potion.IMBUED_HEART]: {
    name: 'Imbued heart',
    image: Imbued
  },
  [Potion.MAGIC]: {
    name: 'Magic potion',
    image: Magic
  },
  [Potion.OVERLOAD]: {
    name: 'Overload',
    image: Overload
  },
  [Potion.RANGING]: {
    name: 'Ranging potion',
    image: Ranging
  },
  [Potion.SATURATED_HEART]: {
    name: 'Saturated heart',
    image: Saturated
  },
  [Potion.SMELLING_SALTS]: {
    name: 'Smelling salts',
    image: Salts
  },
  [Potion.STRENGTH]: {
    name: 'Strength potion',
    image: Strength
  },
  [Potion.SUPER_ATTACK]: {
    name: 'Super attack',
    image: SuperAttack
  },
  [Potion.SUPER_STRENGTH]: {
    name: 'Super strength',
    image: SuperStrength
  }
}