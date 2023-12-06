import {StaticImageData} from "next/image";
import AncientStrength from '@/public/img/league/Ancient_Strength.webp';
import AncientSight from '@/public/img/league/Ancient_Sight.webp';
import AncientWill from '@/public/img/league/Ancient_Will.webp';
import Rebuke from '@/public/img/league/Rebuke.webp';
import Decimate from '@/public/img/league/Decimate.webp';
import Annihilate from '@/public/img/league/Annihilate.webp';
import Vaporise from '@/public/img/league/Vaporise.webp';
import FumusVow from '@/public/img/league/Fumus\'_Vow.webp';
import UmbrasVow from '@/public/img/league/Umbra\'s_Vow.webp';
import CruorsVow from '@/public/img/league/Cruor\'s_Vow.webp';
import GlaciesVow from '@/public/img/league/Glacies\'_Vow.webp';
import Intensify from '@/public/img/league/Intensify.webp';

export enum RuinousPower {
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

export interface RuinousPowerData {
  name: string,
  image: StaticImageData,
}

export const RuinousPowerMap: {[k in RuinousPower]: RuinousPowerData} = {
  [RuinousPower.ANCIENT_STRENGTH]: {
    name: 'Ancient Strength',
    image: AncientStrength
  },
  [RuinousPower.ANCIENT_SIGHT]: {
    name: 'Ancient Sight',
    image: AncientSight
  },
  [RuinousPower.ANCIENT_WILL]: {
    name: 'Ancient Will',
    image: AncientWill
  },
  [RuinousPower.REBUKE]: {
    name: 'Rebuke',
    image: Rebuke
  },
  [RuinousPower.DECIMATE]: {
    name: 'Decimate',
    image: Decimate
  },
  [RuinousPower.ANNIHILATE]: {
    name: 'Annihilate',
    image: Annihilate
  },
  [RuinousPower.VAPORISE]: {
    name: 'Vaporise',
    image: Vaporise
  },
  [RuinousPower.FUMUS_VOW]: {
    name: 'Fumus\' Vow',
    image: FumusVow
  },
  [RuinousPower.UMBRAS_VOW]: {
    name: 'Umbra\'s Vow',
    image: UmbrasVow
  },
  [RuinousPower.CRUORS_VOW]: {
    name: 'Cruor\'s Vow',
    image: CruorsVow
  },
  [RuinousPower.GLACIES_VOW]: {
    name: 'Glacie\'s Vow',
    image: GlaciesVow
  },
  [RuinousPower.INTENSIFY]: {
    name: 'Intensify',
    image: Intensify
  }
}
