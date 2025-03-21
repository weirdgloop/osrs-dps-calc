import { CombatStyleType, RangedDamageType } from '@/types/PlayerCombatStyle';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { Spellement } from '@/types/Spell';
import { TD_PHASES } from '@/lib/constants';

// For now this is the same as player combat styles, but it may support other stuff in future like "typeless"
export type MonsterCombatStyle = CombatStyleType;

export interface Monster {
  id: number;
  name: string;
  image?: string;
  version?: string;
  size: number;
  speed: number;
  style: MonsterCombatStyle;
  maxHit?: number; // Only used for UI. Calculator doesn't use this value - it computes it itself.
  skills: {
    atk: number;
    def: number;
    hp: number;
    magic: number;
    ranged: number;
    str: number;
  }
  offensive: {
    atk: number;
    magic: number;
    magic_str: number;
    ranged: number;
    ranged_str: number;
    str: number;
  }
  defensive: {
    flat_armour: number;
  } & {
    [k in Exclude<CombatStyleType, null | 'ranged'> | Exclude<RangedDamageType, 'mixed'>]: number;
  }
  /**
   * The attributes the monster has
   * @see https://oldschool.runescape.wiki/w/Monster_attribute
   */
  attributes: MonsterAttribute[];

  weakness: {
    element: Spellement;
    severity: number;
  } | null

  /**
   * Fields that users have control over in the UI, which may affect buff applicability, monster scaling, etc.
   */
  inputs: {
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
    };

    demonbaneVulnerability?: number;

    /** @deprecated use {@link phase} */
    tormentedDemonPhase?: typeof TD_PHASES[number];

    phase?: string;
  }
}
