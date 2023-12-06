import {EquipmentCategory} from '@/enums/EquipmentCategory';
import {Prayer} from '@/enums/Prayer';
import {Potion} from '@/enums/Potion';
import {Spell} from '@/types/Spell';
import {PlayerCombatStyle} from "@/types/PlayerCombatStyle";
import {TrailblazerRelic} from "@/enums/TrailblazerRelic";
import {RuinousPower} from "@/enums/RuinousPower";

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
  id: number;
  version: string;
  slot: string;
  image: string;
  speed: number;
  category: EquipmentCategory;
  offensive: number[],
  defensive: number[],
  isTwoHanded: boolean;
}

/**
 * Each slot is represented by an item ID. We've used a string rather than a number here to represent the IDs in case
 * we have to use strings in the future (for arbitrary, non-ID values).
 */
export interface PlayerEquipment {
  head: string | null;
  cape: string | null;
  neck: string | null;
  ammo: string | null;
  weapon: string | null;
  body: string | null;
  shield: string | null;
  legs: string | null;
  hands: string | null;
  feet: string | null;
  ring: string | null;
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
  boosts: PlayerSkills;
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
  trailblazerRelics: TrailblazerRelic[];
  ruinousPowers: RuinousPower[];
}

/**
 * A loadout object with computed values, passed to and from the worker
 */
export interface PlayerComputed extends Omit<Player, 'equipment'> {
  equipment: {
    head: EquipmentPiece | null;
    cape: EquipmentPiece | null;
    neck: EquipmentPiece | null;
    ammo: EquipmentPiece | null;
    weapon: EquipmentPiece | null;
    body: EquipmentPiece | null;
    shield: EquipmentPiece | null;
    legs: EquipmentPiece | null;
    hands: EquipmentPiece | null;
    feet: EquipmentPiece | null;
    ring: EquipmentPiece | null;
  }
}

