import { CombatStyleType } from '@/types/PlayerCombatStyle';
import { MonsterAttribute } from '@/enums/MonsterAttribute';

export interface Monster {
  id: number;
  name: string;
  image?: string;
  version?: string;
  size: number;
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
    [k in CombatStyleType]: number;
  }
  /**
   * The attributes the monster has
   * @see https://oldschool.runescape.wiki/w/Monster_attribute
   */
  attributes: MonsterAttribute[];

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
     */
    partyAvgMiningLevel: number;
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
      dwh: number;
      arclight: number;
      bgs: number;
    }
  }
}
