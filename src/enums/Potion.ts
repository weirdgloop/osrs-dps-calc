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
import {PlayerSkills} from "@/types/Player";

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

export const PotionMap: {[k in Potion]: {name: string, image: StaticImageData, calculateFn: (skills: PlayerSkills) => Partial<PlayerSkills>}} = {
  [Potion.ANCIENT]: {
    name: 'Ancient brew',
    image: Ancient,
    calculateFn: (skills) => {
      return {
        magic: Math.floor(3 + (skills.magic * 0.05)),
        atk: Math.floor(-2 - (skills.atk * 0.1)),
        str: Math.floor(-2 - (skills.str * 0.1)),
        def: Math.floor(-2 - (skills.def * 0.1))
      }
    }
  },
  [Potion.ATTACK]: {
    name: 'Attack potion',
    image: Attack,
    calculateFn: (skills) => {
      return {
        atk: Math.floor(3 + (skills.atk * 0.1))
      }
    }
  },
  [Potion.FORGOTTEN_BREW]: {
    name: 'Forgotten brew',
    image: Forgotten,
    calculateFn: (skills) => {
      return {
        magic: Math.floor(3 + (skills.magic * 0.08)),
        atk: Math.floor(-2 - (skills.atk * 0.1)),
        str: Math.floor(-2 - (skills.str * 0.1)),
        def: Math.floor(-2 - (skills.def * 0.1))
      }
    }
  },
  [Potion.IMBUED_HEART]: {
    name: 'Imbued heart',
    image: Imbued,
    calculateFn: (skills) => {
      return {
        magic: Math.floor(1 + (skills.magic * 0.1)),
      }
    }
  },
  [Potion.MAGIC]: {
    name: 'Magic potion',
    image: Magic,
    calculateFn: (skills) => {
      return {
        magic: 4,
      }
    }
  },
  [Potion.OVERLOAD]: {
    name: 'Overload',
    image: Overload,
    calculateFn: (skills) => {
      return {
        atk: Math.floor(5 + (skills.atk * 0.13)),
        str: Math.floor(5 + (skills.str * 0.13)),
        def: Math.floor(5 + (skills.def * 0.13)),
        magic: Math.floor(5 + (skills.magic * 0.13)),
        ranged: Math.floor(5 + (skills.ranged * 0.13)),
      }
    }
  },
  [Potion.OVERLOAD_PLUS]: {
    name: 'Overload (+)',
    image: Overload,
    calculateFn: (skills) => {
      return {
        atk: Math.floor(6 + (skills.atk * 0.16)),
        str: Math.floor(6 + (skills.str * 0.16)),
        def: Math.floor(6 + (skills.def * 0.16)),
        magic: Math.floor(6 + (skills.magic * 0.16)),
        ranged: Math.floor(6 + (skills.ranged * 0.16)),
      }
    }
  },
  [Potion.RANGING]: {
    name: 'Ranging potion',
    image: Ranging,
    calculateFn: (skills) => {
      return {
        ranged: Math.floor(4 + (skills.ranged * 0.1)),
      }
    }
  },
  [Potion.SATURATED_HEART]: {
    name: 'Saturated heart',
    image: Saturated,
    calculateFn: (skills) => {
      return {
        magic: Math.floor(4 + (skills.magic * 0.1)),
      }
    }
  },
  [Potion.SMELLING_SALTS]: {
    name: 'Smelling salts',
    image: Salts,
    calculateFn: (skills) => {
      return {
        atk: Math.floor(11 + (skills.atk * 0.16)),
        str: Math.floor(11 + (skills.str * 0.16)),
        def: Math.floor(11 + (skills.def * 0.16)),
        magic: Math.floor(11 + (skills.magic * 0.16)),
        ranged: Math.floor(11 + (skills.ranged * 0.16)),
      }
    }
  },
  [Potion.STRENGTH]: {
    name: 'Strength potion',
    image: Strength,
    calculateFn: (skills) => {
      return {
        str: Math.floor(3 + (skills.str * 0.1)),
      }
    }
  },
  [Potion.SUPER_ATTACK]: {
    name: 'Super attack',
    image: SuperAttack,
    calculateFn: (skills) => {
      return {
        atk: Math.floor(5 + (skills.atk * 0.15))
      }
    }
  },
  [Potion.SUPER_STRENGTH]: {
    name: 'Super strength',
    image: SuperStrength,
    calculateFn: (skills) => {
      return {
        str: Math.floor(5 + (skills.str * 0.15)),
      }
    }
  },
  [Potion.SUPER_RANGING]: {
    name: 'Super ranging',
    image: SuperRanging,
    calculateFn: (skills) => {
      return {
        ranged: Math.floor(5 + (skills.ranged * 0.15)),
      }
    }
  },
  [Potion.SUPER_COMBAT]: {
    name: 'Super combat',
    image: SuperCombat,
    calculateFn: (skills) => {
      return {
        atk: Math.floor(5 + (skills.atk * 0.15)),
        str: Math.floor(5 + (skills.str * 0.15)),
        def: Math.floor(5 + (skills.def * 0.15)),
      }
    }
  },
  [Potion.SUPER_MAGIC]: {
    name: 'Super magic',
    image: SuperMagic,
    calculateFn: (skills) => {
      return {
        magic: Math.floor(5 + (skills.magic * 0.15)),
      }
    }
  }
}
