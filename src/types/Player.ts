import {EquipmentCategory} from '@/enums/EquipmentCategory';
import {Prayer} from '@/enums/Prayer';
import {Potion} from '@/enums/Potion';
import {Spell} from '@/types/Spell';
import {PlayerCombatStyle} from "@/types/PlayerCombatStyle";

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
  isTwoHanded: boolean;
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
  username: string;
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

