import {Prayer} from '@/lib/enums/Prayer';
import {Potion} from '@/lib/enums/Potion';
import {EquipmentCategory} from '@/lib/enums/EquipmentCategory';

export interface UI {
  showPreferencesModal: boolean;
}

export interface Preferences {
  allowEditingPlayerStats: boolean;
  allowEditingMonsterStats: boolean;
}

export interface PlayerSkills {
  atk: number;
  def: number;
  hp: number;
  magic: number;
  prayer: number;
  ranged: number;
  str: number;
}

export interface EquipmentPiece {
  name: string;
  image: string;
  category: EquipmentCategory;
  offensive: {
    crush: number;
    magic_str: number;
    magic: number;
    ranged: number;
    ranged_str: number;
    slash: number;
    stab: number;
    str: number;
  },
  defensive: {
    crush: number;
    magic: number;
    ranged: number;
    slash: number;
    stab: number;
    prayer: number;
  }
}

export interface PlayerEquipment {
  head: EquipmentPiece;
  cape: EquipmentPiece;
  neck: EquipmentPiece;
  ammo: EquipmentPiece;
  weapon: EquipmentPiece;
  body: EquipmentPiece;
  shield: EquipmentPiece;
  legs: EquipmentPiece;
  hands: EquipmentPiece;
  feet: EquipmentPiece;
  ring: EquipmentPiece;
}

export interface Spell {
  name: string;
  image: string;
  max_hit: number;
  spellbook: Spellbook;
}

export interface Player {
  style: PlayerCombatStyle;
  skills: PlayerSkills;
  equipment: PlayerEquipment;
  prayers: Prayer[];
  bonuses: {
    str: number;
    ranged_str: number;
    magic_str: number;
    prayer: number;
  }
  defensive: {
    stab: number;
    slash: number;
    crush: number;
    magic: number;
    ranged: number;
  }
  offensive: {
    stab: number;
    slash: number;
    crush: number;
    magic: number;
    ranged: number;
  }
  buffs: {
    potions: Potion[];
    onSlayerTask: boolean;
    inWilderness: boolean;
    /**
     * Whether the Kandarin Hard Diary has been completed, which provides 10% increase for the enchanted bolt spec to activate.
     * @see https://oldschool.runescape.wiki/w/Kandarin_Diary#Hard
     */
    kandarinDiary: boolean;
    /**
     * Whether the Charge spell buff is being used, which empowers god spells from the Mage Arena.
     * @see https://oldschool.runescape.wiki/w/Charge
     */
    chargeSpell: boolean;
  }
  spell: Spell
}

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

// The available spellbooks
export type Spellbook = 'standard' | 'ancient' | 'lunar' | 'arceuus';

// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
export type CombatStyleType = 'slash' | 'crush' | 'stab' | 'magic' | 'ranged';

export interface PlayerCombatStyle {
  name: string,
  type: CombatStyleType,
  stance: string,
}

export interface State {
  player: Player;
  monster: Monster;
  ui: UI;
  prefs: Preferences;
}