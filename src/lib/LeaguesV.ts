import melee_1 from '@/public/img/league/melee_1.png';
import melee_2 from '@/public/img/league/melee_2.png';
import melee_3 from '@/public/img/league/melee_3.png';
import melee_4 from '@/public/img/league/melee_4.png';
import melee_5 from '@/public/img/league/melee_5.png';
import melee_6 from '@/public/img/league/melee_6.png';
import ranged_1 from '@/public/img/league/ranged_1.png';
import ranged_2 from '@/public/img/league/ranged_2.png';
import ranged_3 from '@/public/img/league/ranged_3.png';
import ranged_4 from '@/public/img/league/ranged_4.png';
import ranged_5 from '@/public/img/league/ranged_5.png';
import ranged_6 from '@/public/img/league/ranged_6.png';
import magic_1 from '@/public/img/league/magic_1.png';
import magic_2 from '@/public/img/league/magic_2.png';
import magic_3 from '@/public/img/league/magic_3.png';
import magic_4 from '@/public/img/league/magic_4.png';
import magic_5 from '@/public/img/league/magic_5.png';
import magic_6 from '@/public/img/league/magic_6.png';
import { StaticImageData } from 'next/image';

export enum MeleeMastery {
  NONE = 0,
  MELEE_1,
  MELEE_2,
  MELEE_3,
  MELEE_4,
  MELEE_5,
  MELEE_6,
}

export enum RangedMastery {
  NONE = 0,
  RANGED_1,
  RANGED_2,
  RANGED_3,
  RANGED_4,
  RANGED_5,
  RANGED_6,
}

export enum MagicMastery {
  NONE = 0,
  MAGIC_1,
  MAGIC_2,
  MAGIC_3,
  MAGIC_4,
  MAGIC_5,
  MAGIC_6,
}

export interface LeaguesState {
  melee: MeleeMastery;
  ranged: RangedMastery;
  magic: MagicMastery;

  /** for {@link MagicMastery.MAGIC_2} */
  ticksDelayed: number;

  /** for {@link RangedMastery.RANGED_2}. not shown in ui anymore but still stateful in calculations */
  attackCount: number;
}

export type MasteryStyle = keyof Pick<LeaguesState, 'melee' | 'ranged' | 'magic'>;

export const defaultLeaguesState = (): LeaguesState => ({
  melee: MeleeMastery.NONE,
  ranged: RangedMastery.NONE,
  magic: MagicMastery.NONE,
  ticksDelayed: 0,
  attackCount: 2, // average, -1 relative to ui so this is 3/5
});

export interface MasteryUiData<S extends MasteryStyle> {
  masteryStyle: S;
  mastery: LeaguesState[S];
  name: string;
  image: StaticImageData;
  description: string;
}

export const MELEE_MASTERIES: MasteryUiData<'melee'>[] = [
  {
    name: 'Melee I',
    mastery: MeleeMastery.MELEE_1,
    masteryStyle: 'melee',
    image: melee_1,
    description: 'Melee hits have a 25% chance to roll damage twice and take the highest result.',
  },
  {
    name: 'Melee II',
    mastery: MeleeMastery.MELEE_2,
    masteryStyle: 'melee',
    image: melee_2,
    description: 'Melee hits have a 10% chance to generate an echo hit.',
  },
  {
    name: 'Melee III',
    mastery: MeleeMastery.MELEE_3,
    masteryStyle: 'melee',
    image: melee_3,
    description: 'Melee attack rate set to 80%, rounding down.',
  },
  {
    name: 'Melee IV',
    mastery: MeleeMastery.MELEE_4,
    masteryStyle: 'melee',
    image: melee_4,
    description: 'Melee hits have a 5% chance to heal 40% of damage dealt.',
  },
  {
    name: 'Melee V',
    mastery: MeleeMastery.MELEE_5,
    masteryStyle: 'melee',
    image: melee_5,
    description: 'Melee attack rate set to 50%, rounded down above 5t, rounded up below 4t.',
  },
  {
    name: 'Melee VI',
    mastery: MeleeMastery.MELEE_6,
    masteryStyle: 'melee',
    image: melee_6,
    description: 'Your chance to generate a Melee echo increases to 20%, and your echoes can generate additional echoes.',
  },
];

export const RANGED_MASTERIES: MasteryUiData<'ranged'>[] = [
  {
    name: 'Ranged I',
    mastery: RangedMastery.RANGED_1,
    masteryStyle: 'ranged',
    image: ranged_1,
    description: 'Damage rolls beneath 30% of max hit with Ranged are increased to 30%.',
  },
  {
    name: 'Ranged II',
    mastery: RangedMastery.RANGED_2,
    masteryStyle: 'ranged',
    image: ranged_2,
    description: 'Each subsequent Ranged attack has its max hit increased by an additional 5%. Resets after +20%.',
  },
  {
    name: 'Ranged III',
    mastery: RangedMastery.RANGED_3,
    masteryStyle: 'ranged',
    image: ranged_3,
    description: 'Ranged attack rate set to 80%, rounding down.',
  },
  {
    name: 'Ranged IV',
    mastery: RangedMastery.RANGED_4,
    masteryStyle: 'ranged',
    image: ranged_4,
    description: 'Every 5th Ranged hit, heal 5 hitpoints.',
  },
  {
    name: 'Ranged V',
    mastery: RangedMastery.RANGED_5,
    masteryStyle: 'ranged',
    image: ranged_5,
    description: 'Ranged attack rate set to 50%, rounded down above 5t, rounded up below 4t.',
  },
  {
    name: 'Ranged VI',
    mastery: RangedMastery.RANGED_6,
    masteryStyle: 'ranged',
    image: ranged_6,
    description: 'Never miss with Ranged (PvM only).',
  },
];

export const MAGIC_MASTERIES: MasteryUiData<'magic'>[] = [
  {
    name: 'Magic I',
    mastery: MagicMastery.MAGIC_1,
    masteryStyle: 'magic',
    image: magic_1,
    description: 'When you roll above 90% of your max hit with Magic, damage is increased by 50%.',
  },
  {
    name: 'Magic II',
    mastery: MagicMastery.MAGIC_2,
    masteryStyle: 'magic',
    image: magic_2,
    description: 'Magic max hit is increased by 5% per tick in-between your attacks (Up to +40%).',
  },
  {
    name: 'Magic III',
    mastery: MagicMastery.MAGIC_3,
    masteryStyle: 'magic',
    image: magic_3,
    description: 'Magic attack rate set to 80%, rounding down.',
  },
  {
    name: 'Magic IV',
    mastery: MagicMastery.MAGIC_4,
    masteryStyle: 'magic',
    image: magic_4,
    description: 'When you roll above 90% of your max hit with Magic, heal 10% of damage dealt.',
  },
  {
    name: 'Magic V',
    mastery: MagicMastery.MAGIC_5,
    masteryStyle: 'magic',
    image: magic_5,
    description: 'Magic attack rate set to 50%, rounded down above 5t, rounded up below 4t.',
  },
  {
    name: 'Magic VI',
    mastery: MagicMastery.MAGIC_6,
    masteryStyle: 'magic',
    image: magic_6,
    description: 'Max hit with Magic is increased by 1% for every 100 Hitpoints remaining on target (Up to 10%). On a successful Magic hit, if your target has less Hitpoints than your max hit, you max hit.',
  },
];
