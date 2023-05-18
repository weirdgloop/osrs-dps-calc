import {CombatStyleType} from "@/types/PlayerCombatStyle";

export interface Monster {
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
  invocationLevel?: number;
  /**
   * The attributes the monster has
   * @see https://oldschool.runescape.wiki/w/Monster_attribute
   */
  attributes: string[];
}