import {StaticImageData} from 'next/image';
import Ancient from '@/img/potions/Ancient brew.png';
import Attack from '@/img/potions/Attack.png';
import Forgotten from '@/img/potions/Forgotten brew.png';
import Imbued from '@/img/potions/Imbued heart.png';
import Magic from '@/img/potions/Magic.png';
import Overload from '@/img/potions/Overload.png';
import Ranging from '@/img/potions/Ranging.png';
import Saturated from '@/img/potions/Saturated heart.png';
import Salts from '@/img/potions/Smelling salts.png';
import Strength from '@/img/potions/Strength.png';
import SuperAttack from '@/img/potions/Super attack.png';
import SuperStrength from '@/img/potions/Super strength.png';

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