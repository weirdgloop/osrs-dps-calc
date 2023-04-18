import {Potion} from '@/lib/enums/Potion';
import {Skill} from '@/lib/enums/Skill';

export interface PlayerOffensive {
  stab: number,
  slash: number,
  crush: number,
  magic: number,
  ranged: number
}

export interface PlayerDefensive {
  stab: number,
  slash: number,
  crush: number,
  magic: number,
  ranged: number
}

export interface PlayerBonuses {
  strength: number,
  ranged_str: number,
  magic_str: number,
  prayer: number
}

export type PlayerSkills = {
  [k in Skill]: number;
};

export interface Player {
  offensive: PlayerOffensive,
  defensive: PlayerDefensive,
  bonuses: PlayerBonuses
}

export interface PlayerBuffs {
  potions: Potion[],
  onSlayerTask: boolean,
  inWilderness: boolean,
  kandarinDiary: boolean
}