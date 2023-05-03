import {EquipmentCategory} from '@/lib/enums/EquipmentCategory';
import {Prayer} from '@/lib/enums/Prayer';
import {Potion} from '@/lib/enums/Potion';
import {Spell} from '@/types/Spell';

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

export interface PlayerBonuses {
  str: number;
  ranged_str: number;
  magic_str: number;
  prayer: number;
}

export interface PlayerDefensive {
  stab: number;
  slash: number;
  crush: number;
  magic: number;
  ranged: number;
}

export interface PlayerOffensive {
  stab: number;
  slash: number;
  crush: number;
  magic: number;
  ranged: number;
}

export interface Player {
  style: PlayerCombatStyle;
  skills: PlayerSkills;
  equipment: PlayerEquipment;
  prayers: Prayer[];
  bonuses: PlayerBonuses;
  defensive: PlayerDefensive;
  offensive: PlayerOffensive;
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

// The available types of combat styles. These directly translate into defensive bonuses for monsters too.
export type CombatStyleType = 'slash' | 'crush' | 'stab' | 'magic' | 'ranged';

export interface PlayerCombatStyle {
  name: string,
  type: CombatStyleType,
  stance: string,
}