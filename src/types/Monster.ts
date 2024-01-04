import {CombatStyleType} from "@/types/PlayerCombatStyle";

export interface Monster {
  id: number | null;
  name: string;
  image?: string;
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
   * Party size for ToB/CoX/ToA
   * TODO CoX formulas not yet known
   * @see https://oldschool.runescape.wiki/w/Theatre_of_Blood/Strategies
   * @see https://oldschool.runescape.wiki/w/Tombs_of_Amascut#Mechanics
   */
  partySize: number;
  /**
   * The attributes the monster has
   * @see https://oldschool.runescape.wiki/w/Monster_attribute
   */
  attributes: string[];
}