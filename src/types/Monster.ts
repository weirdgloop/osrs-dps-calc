import { isSpellement, Spellement } from '@/types/Spell';
import { CombatStyleType, isCombatStyleType } from '@/types/PlayerCombatStyle';
import { CUSTOM_MONSTER_ID, TD_PHASES } from '@/lib/constants';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import monsters from '../../cdn/json/monsters.json';

export enum BurnImmunity {
  WEAK = 'Weak',
  NORMAL = 'Normal',
  STRONG = 'Strong',
}

export const isBurnImmunity = (s: string | undefined | null): s is BurnImmunity => Object.values(BurnImmunity).includes(s as BurnImmunity);

export interface MonsterSkills {
  atk: number;
  def: number;
  hp: number;
  magic: number;
  ranged: number;
  str: number;
}

export interface MonsterOffensive {
  atk: number;
  magic: number;
  magic_str: number;
  ranged: number;
  ranged_str: number;
  str: number;
}

export interface MonsterDefensive {
  stab: number;
  slash: number;
  crush: number;
  magic: number;
  light: number;
  standard: number;
  heavy: number;
  flat_armour: number;
}

export interface MonsterWeakness {
  element: Spellement;
  severity: number;
}

export const isMonsterWeakness = (o: object | undefined | null): o is MonsterWeakness => !!o
    && 'element' in o && typeof o.element === 'string' && isSpellement(o.element)
    && 'severity' in o && typeof o.severity === 'number';

export interface MonsterImmunities {
  burn: BurnImmunity | null;
}

/**
 * Fields that users have control over in the UI, which may affect buff applicability, monster scaling, etc.
 */
export interface MonsterInputs {
  /**
   * Whether the monster is from the Chambers of Xeric: Challenge Mode.
   * Not exposed as a UI option.
   */
  isFromCoxCm: boolean;
  /**
   * Invocation level for Tombs of Amascut
   * @see https://oldschool.runescape.wiki/w/Tombs_of_Amascut#Invocations_and_Raid_Level
   */
  toaInvocationLevel: number;
  /**
   * Path level for Tombs of Amascut
   * @see https://oldschool.runescape.wiki/w/Tombs_of_Amascut#Invocations_and_Raid_Level
   */
  toaPathLevel: number;
  /**
   * Max combat level of the party for Chambers of Xeric.
   */
  partyMaxCombatLevel: number;
  /**
   * Average mining level of the party for Chambers of Xeric.
   * @deprecated use {@link partySumMiningLevel}
   */
  partyAvgMiningLevel?: number;
  /**
   * Sum total of cox party members' mining level, used to determine guardians' hp
   */
  partySumMiningLevel: number;
  /**
   * Highest hitpoints level of the party for Chambers of Xeric.
   */
  partyMaxHpLevel: number;
  /**
   * Party size for ToB/CoX/ToA
   * @see https://github.com/weirdgloop/osrs-dps-calc/issues/29
   * @see https://oldschool.runescape.wiki/w/Theatre_of_Blood/Strategies
   * @see https://oldschool.runescape.wiki/w/Tombs_of_Amascut#Mechanics
   */
  partySize: number;
  /**
   * The monster's current HP, for effects like Ruby bolt (e), or Vardorvis defence.
   */
  monsterCurrentHp: number;
  defenceReductions: {
    vulnerability: boolean;
    accursed: boolean;
    elderMaul: number;
    dwh: number;
    arclight: number;
    emberlight: number;
    bgs: number;
    tonalztic: number;
    seercull: number;
    ayak: number;
  };

  demonbaneVulnerability?: number;

  /** @deprecated use {@link phase} */
  tormentedDemonPhase?: typeof TD_PHASES[number];

  phase?: string;

  prayers: {
    melee: boolean;
    ranged: boolean;
    magic: boolean;
  };
}

export interface Monster {
  id: number;
  name: string;
  version: string;
  image: string | null;
  size: number;
  speed: number;
  style: CombatStyleType | null;
  maxHit: number;
  skills: MonsterSkills;
  offensive: MonsterOffensive;
  defensive: MonsterDefensive;
  attributes: MonsterAttribute[];
  weakness: MonsterWeakness | null;
  immunities: MonsterImmunities;
  isSlayerMonster: boolean;
  inputs: MonsterInputs;
}

export const createDefaultMonsterInputs = (): MonsterInputs => ({
  isFromCoxCm: false,
  toaInvocationLevel: 0,
  toaPathLevel: 0,
  partyMaxCombatLevel: 126,
  partySumMiningLevel: 99,
  partyMaxHpLevel: 99,
  partySize: 1,
  monsterCurrentHp: 150,
  defenceReductions: {
    vulnerability: false,
    accursed: false,
    elderMaul: 0,
    dwh: 0,
    arclight: 0,
    emberlight: 0,
    bgs: 0,
    tonalztic: 0,
    seercull: 0,
    ayak: 0,
  },
  prayers: {
    melee: false,
    ranged: false,
    magic: false,
  },
});

export const createDefaultMonster = (): Monster => ({
  id: CUSTOM_MONSTER_ID,
  name: 'Custom Monster',
  version: '',
  image: null,
  size: 1,
  speed: 4,
  style: 'stab',
  maxHit: 8,
  skills: {
    atk: 0,
    def: 0,
    hp: 10,
    magic: 0,
    ranged: 0,
    str: 0,
  },
  offensive: {
    atk: 0,
    magic: 0,
    magic_str: 0,
    ranged: 0,
    ranged_str: 0,
    str: 0,
  },
  defensive: {
    flat_armour: 0,
    crush: 0,
    magic: 0,
    heavy: 0,
    standard: 0,
    light: 0,
    slash: 0,
    stab: 0,
  },
  attributes: [],
  immunities: {
    burn: null,
  },
  isSlayerMonster: true,
  weakness: null,
  inputs: createDefaultMonsterInputs(),
});

export function getMonsters(): Omit<Monster, 'inputs'>[] {
  return monsters.map((m): Omit<Monster, 'inputs'> => {
    const maxHit = parseInt(m.max_hit.toString());
    const styleStr = m.style?.join(',').toLowerCase() || null;
    return {
      id: m.id,
      name: m.name,
      version: m.version,
      image: m.image,
      size: m.size,
      speed: m.speed,
      style: isCombatStyleType(styleStr) ? styleStr : null,
      maxHit: Number.isNaN(maxHit) ? 0 : maxHit,
      skills: m.skills,
      offensive: m.offensive,
      defensive: m.defensive,
      attributes: m.attributes as MonsterAttribute[],
      weakness: <Monster['weakness']>m.weakness || null,
      immunities: {
        burn: m.immunities.burn as BurnImmunity,
      },
      isSlayerMonster: m.is_slayer_monster ?? false,
    };
  });
}
