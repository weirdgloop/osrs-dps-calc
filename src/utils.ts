import axios from 'axios';
import { PlayerSkills } from '@/types/Player';
import { ImportableData } from '@/types/State';
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
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { PlayerCombatStyle } from '@/types/PlayerCombatStyle';
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
  IMPLEMENTED,

  /**
   * The feature is partially but not wholly implemented, and may or may not be accurate.
   * Example: a special attack that has an increased max hit, and applies damage over time, where only the increased max hit is implemented.
   */
  PARTIALLY_IMPLEMENTED,

  /**
   * The feature is known to exist, but has not been implemented.
   * Example: A new weapon has been implemented with a unique effect and is selectable in the UI, but it is not yet implemented in the calculator. */
  UNIMPLEMENTED,

  /**
   * The feature does not apply to the given conditions.
   * Example: Querying whether the special attack of a weapon has been implemented, but the weapon does not have a special attack.
   */
  NOT_APPLICABLE,
}

export const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

const SHORTLINK_API = 'https://tools.runescape.wiki/osrs-dps/shortlink';
const API_PROXY = 'https://oldschool.runescape.wiki/cors';

/**
 * Fetch a player's skills (using the Hiscores API)
 * @param username
 */
export const fetchPlayerSkills = async (username: string) => {
  const res = await axios.get<string>(`${API_PROXY}/m=hiscore_oldschool/index_lite.ws?player=${username.replaceAll(' ', '_')}`);

  // The Hiscores API returns in a CSV format, rather than JSON, so we need to do some manual parsing here
  const rawData = res.data.split('\n');
  const skillData = rawData.map((v) => {
    const d = v.split(',');
    return { rank: parseInt(d[0]), level: parseInt(d[1]), xp: parseInt(d[2]) };
  });

  return {
    atk: skillData[1].level,
    def: skillData[2].level,
    str: skillData[3].level,
    hp: skillData[4].level,
    ranged: skillData[5].level,
    prayer: skillData[6].level,
    magic: skillData[7].level,
    mining: skillData[15].level,
    herblore: skillData[16].level,
  };
};

export const fetchShortlinkData = async (linkId: string): Promise<ImportableData> => {
  const res = await axios.get<{ data: ImportableData }>(`${SHORTLINK_API}?id=${linkId}`);
  return res.data.data;
};

export const generateShortlink = async (data: ImportableData): Promise<string> => {
  const res = await axios.post(SHORTLINK_API, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.data;
};

// for type narrowing
export function isDefined<T>(id: T | undefined | null): id is T {
  return !!id;
}

/**
 * Calculates a player's combat level using their skills
 * @param s
 */
export const calculateCombatLevel = (s: PlayerSkills) => {
  const baseLevel = 0.25 * (s.def + s.hp + Math.floor(s.prayer / 2));
  const meleeCbLevel = 0.325 * (s.atk + s.str);
  const magicCbLevel = 0.325 * (Math.floor(s.magic / 2) + s.magic);
  const rangedCbLevel = 0.325 * (Math.floor(s.ranged / 2) + s.ranged);
  const cbType = Math.max(meleeCbLevel, Math.max(magicCbLevel, rangedCbLevel));
  const cbLevelDouble = baseLevel + cbType;

  // Return the combat level
  return Math.floor(cbLevelDouble);
};

export const getWikiImage = (filename: string) => `https://oldschool.runescape.wiki/images/${filename.replaceAll(' ', '_')}?11111`;

export const getCdnImage = (filename: string) => `https://tools.runescape.wiki/osrs-dps/cdn/${filename}`;

export const isDevServer = () => process.env.NODE_ENV === 'development';

export const keys = <T extends object>(o: T): (keyof T)[] => Object.keys(o) as (keyof T)[];

export const typedMerge = <T, E extends PartialDeep<T>>(base: T, updates: E): T => merge({}, base, updates);

export class DeferredPromise<T> {
  private _resolve!: (response: T) => void;

  private _reject!: (reason: Error) => void;

  readonly promise: Promise<T>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public resolve(response: T): void {
    this._resolve(response);
  }

  public reject(reason: Error): void {
    this._reject(reason);
  }
}

// This is a bit of a hack of Promise, but it is very convenient to use as a result.
// Technically a promise should always be resolved, but we *can* just not resolve to effectively debounce.
export class Debouncer {
  private readonly delay: number;

  private windowTimeoutId?: number;

  constructor(ms: number = 250) {
    this.delay = ms;
  }

  /* eslint-disable no-restricted-globals */
  async debounce(): Promise<void> {
    if (this.windowTimeoutId) {
      self.clearTimeout(this.windowTimeoutId);
    }

    const p = new DeferredPromise<void>();
    this.windowTimeoutId = self.setTimeout(() => {
      p.resolve(undefined);
    }, this.delay);

    return p.promise;
  }
  /* eslint-enable no-restricted-globals */
}

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

export const CombatStyleMap: { [k in EquipmentCategory]: { [k: string]: { image: string } } } = {
  [EquipmentCategory.BLASTER]: {
    Flamer: { image: '36' },
    Explosive: { image: '47' },
  },
  [EquipmentCategory.GUN]: {
    'Aim and Fire': { image: '128' },
  },
  [EquipmentCategory.AXE]: {
    Block: { image: '233' },
    Chop: { image: '234' },
    Hack: { image: '235' },
    Smash: { image: '236' },
  },
  [EquipmentCategory.TWO_HANDED_SWORD]: {
    Block: { image: '237' },
    Smash: { image: '238' },
    Slash: { image: '238' },
    Chop: { image: '239' },
  },
  [EquipmentCategory.PARTISAN]: {
    Block: { image: '237' },
    Pound: { image: '238' },
    Lunge: { image: '239' },
    Stab: { image: '240' },
  },
  [EquipmentCategory.SLASH_SWORD]: {
    Block: { image: '237' },
    Slash: { image: '238' },
    Chop: { image: '239' },
    Lunge: { image: '240' },
  },
  [EquipmentCategory.STAB_SWORD]: {
    Block: { image: '237' },
    Slash: { image: '238' },
    Lunge: { image: '239' },
    Stab: { image: '240' },
  },
  [EquipmentCategory.BANNER]: {
    Lunge: { image: '241' },
    Pound: { image: '242' },
    Block: { image: '250' },
    Swipe: { image: '251' },
  },
  [EquipmentCategory.SPEAR]: {
    Lunge: { image: '241' },
    Pound: { image: '242' },
    Block: { image: '250' },
    Swipe: { image: '251' },
  },
  [EquipmentCategory.SPIKED]: {
    Block: { image: '243' },
    Pummel: { image: '244' },
    Spike: { image: '245' },
    Pound: { image: '246' },
  },
  [EquipmentCategory.UNARMED]: {
    Punch: { image: '247' },
    Kick: { image: '248' },
    Block: { image: '249' },
  },
  [EquipmentCategory.STAFF]: {
    Focus: { image: '252' },
    Bash: { image: '266' },
    Pound: { image: '267' },
  },
  [EquipmentCategory.BLADED_STAFF]: {
    Fend: { image: '252' },
    Jab: { image: '266' },
    Swipe: { image: '267' },
  },
  [EquipmentCategory.POLESTAFF]: {
    Block: { image: '252' },
    Bash: { image: '266' },
    Pound: { image: '267' },
  },
  [EquipmentCategory.BLUDGEON]: {
    Smash: { image: '253' },
    Pound: { image: '255' },
    Pummel: { image: '256' },
  },
  [EquipmentCategory.BLUNT]: {
    Block: { image: '253' },
    Pound: { image: '255' },
    Pummel: { image: '256' },
  },
  [EquipmentCategory.BULWARK]: {
    Block: { image: '253' },
    Pummel: { image: '254' },
  },
  [EquipmentCategory.CROSSBOW]: {
    Accurate: { image: '258' },
    Rapid: { image: '259' },
    Longrange: { image: '260' },
  },
  [EquipmentCategory.SCYTHE]: {
    Block: { image: '261' },
    Chop: { image: '262' },
    Reap: { image: '271' },
    Jab: { image: '271' },
  },
  [EquipmentCategory.POWERED_STAFF]: {
    Accurate: { image: '263' },
    Longrange: { image: '265' },
  },
  [EquipmentCategory.POWERED_WAND]: {
    Accurate: { image: '263' },
    Longrange: { image: '265' },
  },
  [EquipmentCategory.THROWN]: {
    Accurate: { image: '263' },
    Rapid: { image: '264' },
    Longrange: { image: '265' },
  },
  [EquipmentCategory.BOW]: {
    Accurate: { image: '268' },
    Rapid: { image: '269' },
    Longrange: { image: '270' },
  },
  [EquipmentCategory.PICKAXE]: {
    Block: { image: '273' },
    Spike: { image: '274' },
    Smash: { image: '275' },
    Impale: { image: '276' },
  },
  [EquipmentCategory.CLAW]: {
    Lunge: { image: '277' },
    Slash: { image: '278' },
    Chop: { image: '279' },
    Block: { image: '280' },
  },
  [EquipmentCategory.CHINCHOMPA]: {
    'Long fuse': { image: '281' },
    'Medium fuse': { image: '282' },
    'Short fuse': { image: '288' },
  },
  [EquipmentCategory.POLEARM]: {
    Fend: { image: '283' },
    Jab: { image: '284' },
    Swipe: { image: '285' },
  },
  [EquipmentCategory.WHIP]: {
    Flick: { image: '286' },
    Deflect: { image: '286' },
    Lash: { image: '287' },
  },
  [EquipmentCategory.SALAMANDER]: {
    Scorch: { image: '289' },
    Flare: { image: '290' },
    Blaze: { image: '291' },
  },
  [EquipmentCategory.DAGGER]: {},
  [EquipmentCategory.NONE]: {
    Punch: { image: '247' },
    Kick: { image: '248' },
    Block: { image: '249' },
  },
};

/**
 * Returns the available combat styles when provided an equipment category.
 * @param style
 */
export const getCombatStylesForCategory = (style: EquipmentCategory): PlayerCombatStyle[] => {
  let ret: PlayerCombatStyle[] = [];
  switch (style) {
    case EquipmentCategory.TWO_HANDED_SWORD:
      ret = [
        { name: 'Chop', type: 'slash', stance: 'Accurate' },
        { name: 'Slash', type: 'slash', stance: 'Aggressive' },
        { name: 'Smash', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'slash', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.BANNER:
      ret = [
        { name: 'Lunge', type: 'stab', stance: 'Accurate' },
        { name: 'Swipe', type: 'slash', stance: 'Aggressive' },
        { name: 'Pound', type: 'crush', stance: 'Controlled' },
        { name: 'Block', type: 'stab', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.BLADED_STAFF:
      ret = [
        { name: 'Jab', type: 'stab', stance: 'Accurate' },
        { name: 'Swipe', type: 'slash', stance: 'Aggressive' },
        { name: 'Fend', type: 'crush', stance: 'Defensive' },
        { name: 'Spell', type: 'magic', stance: 'Defensive Autocast' },
        { name: 'Spell', type: 'magic', stance: 'Autocast' },
      ];
      break;
    case EquipmentCategory.BLASTER:
      // TODO?
      return [];
    case EquipmentCategory.BOW:
    case EquipmentCategory.CROSSBOW:
    case EquipmentCategory.THROWN:
      ret = [
        { name: 'Accurate', type: 'ranged', stance: 'Accurate' },
        { name: 'Rapid', type: 'ranged', stance: 'Rapid' },
        { name: 'Longrange', type: 'ranged', stance: 'Longrange' },
      ];
      break;
    case EquipmentCategory.GUN:
      ret = [
        // {name: 'Aim and Fire', type: '', stance: ''},
        { name: 'Kick', type: 'crush', stance: 'Aggressive' },
      ];
      break;
    case EquipmentCategory.BULWARK:
      ret = [
        { name: 'Pummel', type: 'crush', stance: 'Accurate' },
        { name: 'Block', type: null, stance: null },
      ];
      break;
    case EquipmentCategory.PARTISAN:
      ret = [
        { name: 'Stab', type: 'stab', stance: 'Accurate' },
        { name: 'Lunge', type: 'stab', stance: 'Aggressive' },
        { name: 'Pound', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'stab', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.PICKAXE:
      ret = [
        { name: 'Spike', type: 'stab', stance: 'Accurate' },
        { name: 'Impale', type: 'stab', stance: 'Aggressive' },
        { name: 'Smash', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'stab', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.POLEARM:
      ret = [
        { name: 'Jab', type: 'stab', stance: 'Controlled' },
        { name: 'Swipe', type: 'slash', stance: 'Aggressive' },
        { name: 'Fend', type: 'stab', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.POWERED_STAFF:
    case EquipmentCategory.POWERED_WAND:
      ret = [
        { name: 'Accurate', type: 'magic', stance: 'Accurate' },
        { name: 'Accurate', type: 'magic', stance: 'Accurate' },
        { name: 'Longrange', type: 'magic', stance: 'Longrange' },
      ];
      break;
    case EquipmentCategory.SALAMANDER:
      ret = [
        { name: 'Scorch', type: 'slash', stance: 'Aggressive' },
        { name: 'Flare', type: 'ranged', stance: 'Rapid' },
        { name: 'Blaze', type: 'magic', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.CHINCHOMPA:
      ret = [
        { name: 'Short fuse', type: 'ranged', stance: 'Accurate' },
        { name: 'Medium fuse', type: 'ranged', stance: 'Rapid' },
        { name: 'Long fuse', type: 'ranged', stance: 'Longrange' },
      ];
      break;
    case EquipmentCategory.CLAW:
      ret = [
        { name: 'Chop', type: 'slash', stance: 'Accurate' },
        { name: 'Slash', type: 'slash', stance: 'Aggressive' },
        { name: 'Lunge', type: 'stab', stance: 'Controlled' },
        { name: 'Block', type: 'slash', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.BLUDGEON:
      ret = [
        { name: 'Pound', type: 'crush', stance: 'Aggressive' },
        { name: 'Pummel', type: 'crush', stance: 'Aggressive' },
        { name: 'Smash', type: 'crush', stance: 'Aggressive' },
      ];
      break;
    case EquipmentCategory.BLUNT:
      ret = [
        { name: 'Pound', type: 'crush', stance: 'Accurate' },
        { name: 'Pummel', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'crush', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.POLESTAFF:
      ret = [
        { name: 'Bash', type: 'crush', stance: 'Accurate' },
        { name: 'Pound', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'crush', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.SPIKED:
      ret = [
        { name: 'Pound', type: 'crush', stance: 'Accurate' },
        { name: 'Pummel', type: 'crush', stance: 'Aggressive' },
        { name: 'Spike', type: 'stab', stance: 'Controlled' },
        { name: 'Block', type: 'crush', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.STAFF:
      ret = [
        { name: 'Bash', type: 'crush', stance: 'Accurate' },
        { name: 'Pound', type: 'crush', stance: 'Aggressive' },
        { name: 'Focus', type: 'crush', stance: 'Defensive' },
        { name: 'Spell', type: 'magic', stance: 'Defensive Autocast' },
        { name: 'Spell', type: 'magic', stance: 'Autocast' },
      ];
      break;
    case EquipmentCategory.AXE:
      ret = [
        { name: 'Chop', type: 'slash', stance: 'Accurate' },
        { name: 'Hack', type: 'slash', stance: 'Aggressive' },
        { name: 'Smash', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'slash', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.NONE:
    case EquipmentCategory.UNARMED:
      ret = [
        { name: 'Punch', type: 'crush', stance: 'Accurate' },
        { name: 'Kick', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'crush', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.SCYTHE:
      ret = [
        { name: 'Reap', type: 'slash', stance: 'Accurate' },
        { name: 'Chop', type: 'slash', stance: 'Aggressive' },
        { name: 'Jab', type: 'crush', stance: 'Aggressive' },
        { name: 'Block', type: 'slash', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.SLASH_SWORD:
      ret = [
        { name: 'Chop', type: 'slash', stance: 'Accurate' },
        { name: 'Slash', type: 'slash', stance: 'Aggressive' },
        { name: 'Lunge', type: 'stab', stance: 'Controlled' },
        { name: 'Block', type: 'slash', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.SPEAR:
      ret = [
        { name: 'Lunge', type: 'stab', stance: 'Controlled' },
        { name: 'Swipe', type: 'slash', stance: 'Controlled' },
        { name: 'Pound', type: 'crush', stance: 'Controlled' },
        { name: 'Block', type: 'stab', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.STAB_SWORD:
      ret = [
        { name: 'Stab', type: 'stab', stance: 'Accurate' },
        { name: 'Lunge', type: 'stab', stance: 'Aggressive' },
        { name: 'Slash', type: 'slash', stance: 'Aggressive' },
        { name: 'Block', type: 'stab', stance: 'Defensive' },
      ];
      break;
    case EquipmentCategory.WHIP:
      ret = [
        { name: 'Flick', type: 'slash', stance: 'Accurate' },
        { name: 'Lash', type: 'slash', stance: 'Controlled' },
        { name: 'Deflect', type: 'slash', stance: 'Defensive' },
      ];
      break;
    default:
      ret = [];
      break;
  }

  // Add a psuedo combat style here for manual casting
  ret.push(
    { name: 'Spell', type: 'magic', stance: 'Manual Cast' },
  );
  return ret;
};
