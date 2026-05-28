import { PlayerSkills } from '@/types/Player';
import { StaticImageData } from 'next/image';
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
import Defence from '@/public/img/potions/Defence.png';
import SuperDefence from '@/public/img/potions/Super defence.png';
import Moonlight from '@/public/img/potions/Moonlight.png';
import RubyHarvest from '@/public/img/potions/Ruby Harvest.png';
import BlackWarlock from '@/public/img/potions/Black Warlock.png';
import SapphireGlacialis from '@/public/img/potions/Sapphire Glacialis.png';
import Potion from '@/enums/Potion';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';

/**
 * Can be reused in a number of locations where we partially support a feature
 * and want to distinguish to users whether that feature is expected, and is implemented.
 */
export enum FeatureStatus {
  /**
   * The feature is fully implemented and is expected to give accurate and comprehensive results.
   */
  IMPLEMENTED = 'IMPLEMENTED',

  /**
   * The feature is partially but not wholly implemented, and may or may not be accurate.
   * Example: a special attack that has an increased max hit, and applies damage over time, where only the increased max hit is implemented.
   */
  PARTIALLY_IMPLEMENTED = 'PARTIALLY_IMPLEMENTED',

  /**
   * The feature is known to exist, but has not been implemented.
   * Example: A new weapon has been implemented with a unique effect and is selectable in the UI, but it is not yet implemented in the calculator. */
  UNIMPLEMENTED = 'UNIMPLEMENTED',

  /**
   * The feature does not apply to the given conditions.
   * Example: Querying whether the special attack of a weapon has been implemented, but the weapon does not have a special attack.
   */
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

/**
 * Fetch a player's skills (using the Hiscores API)
 * @param username
 */

// for type narrowing
export function isDefined<T>(id: T | undefined | null): id is T {
  return !!id;
}

export const getWikiImage = (filename: string) => `https://oldschool.runescape.wiki/images/${filename.replaceAll(' ', '_')}?11111`;

export const getCdnImage = (filename: string) => `https://tools.runescape.wiki/osrs-dps/cdn/${filename}`;

export const keys = <T extends object>(o: T): (keyof T)[] => Object.keys(o) as (keyof T)[];

export const typedMerge = <T, E extends PartialDeep<T>>(base: T, updates: E): T => merge({}, base, updates);

export const toggleArrayMembership = <T>(arr: T[], item: T, eql: (a: T) => boolean = (a) => a === item): T[] => {
  if (arr.some((i) => eql(i))) {
    return arr.filter((i) => !eql(i));
  }
  return [...arr, item];
};

/** Always overwrite arrays, do not merge their contents. */
export const MERGE_OVERWRITE_ARRAYS: Parameters<typeof merge>[2] = <TObject, TSource>(obj: TObject, src: TSource) => {
  if (Array.isArray(src) && src.length === 0) {
    return src;
  }
  return undefined;
};

export type RenderData<K extends string | number | symbol, R> = { [key in K]: R };

export const PotionMap: { [k in Potion]: { name: string, order: number, image: StaticImageData, calculateFn: (skills: PlayerSkills) => Partial<PlayerSkills> } } = {
  [Potion.OVERLOAD_PLUS]: {
    name: 'Overload (+)',
    order: 0,
    image: Overload,
    calculateFn: (skills) => ({
      atk: Math.floor(6 + (skills.atk * 0.16)),
      str: Math.floor(6 + (skills.str * 0.16)),
      def: Math.floor(6 + (skills.def * 0.16)),
      magic: Math.floor(6 + (skills.magic * 0.16)),
      ranged: Math.floor(6 + (skills.ranged * 0.16)),
    }),
  },
  [Potion.SMELLING_SALTS]: {
    name: 'Smelling salts',
    order: 1,
    image: Salts,
    calculateFn: (skills) => ({
      atk: Math.floor(11 + (skills.atk * 0.16)),
      str: Math.floor(11 + (skills.str * 0.16)),
      def: Math.floor(11 + (skills.def * 0.16)),
      magic: Math.floor(11 + (skills.magic * 0.16)),
      ranged: Math.floor(11 + (skills.ranged * 0.16)),
    }),
  },
  [Potion.SUPER_COMBAT]: {
    name: 'Super combat',
    order: 2,
    image: SuperCombat,
    calculateFn: (skills) => ({
      atk: Math.floor(5 + (skills.atk * 0.15)),
      str: Math.floor(5 + (skills.str * 0.15)),
      def: Math.floor(5 + (skills.def * 0.15)),
    }),
  },
  [Potion.RANGING]: {
    name: 'Ranging potion',
    order: 3,
    image: Ranging,
    calculateFn: (skills) => ({
      ranged: Math.floor(4 + (skills.ranged * 0.1)),
    }),
  },
  [Potion.SATURATED_HEART]: {
    name: 'Saturated heart',
    order: 4,
    image: Saturated,
    calculateFn: (skills) => ({
      magic: Math.floor(4 + (skills.magic * 0.1)),
    }),
  },
  [Potion.IMBUED_HEART]: {
    name: 'Imbued heart',
    order: 5,
    image: Imbued,
    calculateFn: (skills) => ({
      magic: Math.floor(1 + (skills.magic * 0.1)),
    }),
  },
  [Potion.FORGOTTEN_BREW]: {
    name: 'Forgotten brew',
    order: 6,
    image: Forgotten,
    calculateFn: (skills) => ({
      magic: Math.floor(3 + (skills.magic * 0.08)),
      atk: Math.floor(-2 - (skills.atk * 0.1)),
      str: Math.floor(-2 - (skills.str * 0.1)),
      def: Math.floor(-2 - (skills.def * 0.1)),
    }),
  },
  [Potion.SUPER_ATTACK]: {
    name: 'Super attack',
    order: 7,
    image: SuperAttack,
    calculateFn: (skills) => ({
      atk: Math.floor(5 + (skills.atk * 0.15)),
    }),
  },
  [Potion.SUPER_STRENGTH]: {
    name: 'Super strength',
    order: 8,
    image: SuperStrength,
    calculateFn: (skills) => ({
      str: Math.floor(5 + (skills.str * 0.15)),
    }),
  },
  [Potion.ANCIENT]: {
    name: 'Ancient brew',
    order: 9,
    image: Ancient,
    calculateFn: (skills) => ({
      magic: Math.floor(2 + (skills.magic * 0.05)),
      atk: Math.floor(-2 - (skills.atk * 0.1)),
      str: Math.floor(-2 - (skills.str * 0.1)),
      def: Math.floor(-2 - (skills.def * 0.1)),
    }),
  },
  [Potion.OVERLOAD]: {
    name: 'Overload',
    order: 10,
    image: Overload,
    calculateFn: (skills) => ({
      atk: Math.floor(5 + (skills.atk * 0.13)),
      str: Math.floor(5 + (skills.str * 0.13)),
      def: Math.floor(5 + (skills.def * 0.13)),
      magic: Math.floor(5 + (skills.magic * 0.13)),
      ranged: Math.floor(5 + (skills.ranged * 0.13)),
    }),
  },
  [Potion.MAGIC]: {
    name: 'Magic potion',
    order: 11,
    image: Magic,
    calculateFn: () => ({
      magic: 4,
    }),
  },
  [Potion.ATTACK]: {
    name: 'Attack potion',
    order: 12,
    image: Attack,
    calculateFn: (skills) => ({
      atk: Math.floor(3 + (skills.atk * 0.1)),
    }),
  },
  [Potion.STRENGTH]: {
    name: 'Strength potion',
    order: 13,
    image: Strength,
    calculateFn: (skills) => ({
      str: Math.floor(3 + (skills.str * 0.1)),
    }),
  },
  [Potion.SUPER_RANGING]: {
    name: 'Super ranging',
    order: 14,
    image: SuperRanging,
    calculateFn: (skills) => ({
      ranged: Math.floor(5 + (skills.ranged * 0.15)),
    }),
  },
  [Potion.SUPER_MAGIC]: {
    name: 'Super magic',
    order: 15,
    image: SuperMagic,
    calculateFn: (skills) => ({
      magic: Math.floor(5 + (skills.magic * 0.15)),
    }),
  },
  [Potion.DEFENCE]: {
    name: 'Defence potion',
    order: 16,
    image: Defence,
    calculateFn: (skills) => ({
      def: Math.floor(3 + (skills.def * 0.1)),
    }),
  },
  [Potion.SUPER_DEFENCE]: {
    name: 'Super defence',
    order: 17,
    image: SuperDefence,
    calculateFn: (skills) => ({
      def: Math.floor(5 + (skills.def * 0.15)),
    }),
  },
  [Potion.RUBY_HARVEST]: {
    name: 'Ruby Harvest',
    order: 18,
    image: RubyHarvest,
    calculateFn: (skills) => ({
      atk: Math.floor(4 + (skills.atk * 0.15)),
    }),
  },
  [Potion.BLACK_WARLOCK]: {
    name: 'Black Warlock',
    order: 19,
    image: BlackWarlock,
    calculateFn: (skills) => ({
      str: Math.floor(4 + (skills.str * 0.15)),
    }),
  },
  [Potion.SAPPHIRE_GLACIALIS]: {
    name: 'Sapphire Glacialis',
    order: 20,
    image: SapphireGlacialis,
    calculateFn: (skills) => ({
      def: Math.floor(4 + (skills.def * 0.15)),
    }),
  },
  [Potion.MOONLIGHT]: {
    name: 'Moonlight potion',
    order: 21,
    image: Moonlight,
    calculateFn: (skills) => {
      let atk; let str; let def;
      if (skills.herblore >= 45) {
        atk = Math.trunc(5 + (skills.atk * 0.15));
      } else if (skills.herblore >= 3) {
        atk = Math.trunc(3 + (skills.atk * 0.10));
      }
      if (skills.herblore >= 55) {
        str = Math.trunc(5 + (skills.str * 0.15));
      } else if (skills.herblore >= 12) {
        str = Math.trunc(3 + (skills.str * 0.10));
      }
      if (skills.herblore >= 70) {
        def = Math.trunc(7 + (skills.def * 0.20));
      } else if (skills.herblore >= 66) {
        def = Math.trunc(5 + (skills.def * 0.15));
      } else if (skills.herblore >= 30) {
        def = Math.trunc(3 + (skills.def * 0.10));
      }
      return { atk, str, def };
    },
  },
};
