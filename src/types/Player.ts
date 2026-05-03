import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { Prayer } from '@/enums/Prayer';
import Potion from '@/enums/Potion';
import { Spell } from '@/types/Spell';
import { getCombatStylesForCategory, PlayerCombatStyle } from '@/types/PlayerCombatStyle';
import { LeaguesEffect } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';
import { DEFAULT_ATTACK_SPEED } from '@/lib/constants';

export interface PlayerSkills {
  atk: number;
  def: number;
  hp: number;
  magic: number;
  prayer: number;
  ranged: number;
  str: number;
  mining: number;
  herblore: number;
}

export interface EquipmentPiece extends EquipmentStats {
  name: string;
  id: number;
  weight: number;
  version: string;
  slot: keyof PlayerEquipment;
  image: string;
  speed: number;
  category: EquipmentCategory;
  isTwoHanded: boolean;
  itemVars?: {
    blowpipeDartName?: string;
    blowpipeDartId?: number;
  };
}

/**
 * Each slot is represented by an item ID. We've used a string rather than a number here to represent the IDs in case
 * we have to use strings in the future (for arbitrary, non-ID values).
 */
export interface PlayerEquipment {
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

export interface EquipmentStats {
  bonuses: PlayerBonuses,
  offensive: PlayerOffensive,
  defensive: PlayerDefensive,
}

export interface LeaguesState {
  selectedNodeIds: Set<string>;

  effects: { [k in LeaguesEffect]?: number };

  distanceToEnemy: number;

  enemyPrayers: {
    melee: boolean;
    ranged: boolean;
    magic: boolean;
  }

  blindbagWeapons: EquipmentPiece[];

  regenerateMagicBonus: number;

  cullingSpree: boolean;

  bowHitsWithoutDamage: number;
}

export interface Player extends EquipmentStats {
  name: string;
  style: PlayerCombatStyle;
  /**
   * The player's base skill levels. These are their skill levels before any boosts (for example, from potions)
   * are applied.
   */
  skills: PlayerSkills;
  /**
   * These are the values for each skill that should be added to each of the "skills" property's values to compute
   * the player's "current" skill levels.
   */
  boosts: PlayerSkills;
  equipment: PlayerEquipment;
  attackSpeed: number;
  prayers: Prayer[];
  buffs: {
    /**
     * This property should only be used to display the UI state, and should not be used in calculator code.
     *
     * Instead, use the "boosts" value of the Player interface, which contains the computed value that should be
     * added to each of the "skills" values to make the player's "current" skill levels.
     */
    potions: Potion[];
    onSlayerTask: boolean;
    inWilderness: boolean;
    forinthrySurge: boolean;
    /**
     * Soul Stacks for the Soulreaper axe.
     @see https://oldschool.runescape.wiki/w/Soulreaper_axe
     */
    soulreaperStacks: number;
    /**
     * Barbarian assault attacker level.
     * @see https://oldschool.runescape.wiki/w/Barbarian_Assault
     */
    baAttackerLevel: number;
    /**
     * Distance from the monster. Used for chinchompa accuracy modifiers, ignored otherwise.
     * @see https://oldschool.runescape.wiki/w/Chinchompa#Chinchompa_guide
     */
    chinchompaDistance: number;
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
    /**
     * Whether the Mark of Darkness spell buff is being used, which boosts the effect of Arceuus spells.
     * @see https://oldschool.runescape.wiki/w/Mark_of_Darkness
     */
    markOfDarknessSpell: boolean;
    /**
     * Sunfire runes ensure 10% minimum hit.
     * Can be used for any spell that requires fire runes.
     * @see https://oldschool.runescape.wiki/w/Sunfire_rune
     */
    usingSunfireRunes: boolean;
  };
  spell: Spell | null;

  leagues: {
    six: LeaguesState
  }
}

export const createDefaultPlayer = (name?: string): Player => ({
  name: name ?? 'Loadout 1',
  style: getCombatStylesForCategory(EquipmentCategory.UNARMED)[0],
  skills: {
    atk: 99,
    def: 99,
    hp: 99,
    magic: 99,
    prayer: 99,
    ranged: 99,
    str: 99,
    mining: 99,
    herblore: 99,
  },
  boosts: {
    atk: 0,
    def: 0,
    hp: 0,
    magic: 0,
    prayer: 0,
    ranged: 0,
    str: 0,
    mining: 0,
    herblore: 0,
  },
  equipment: {
    ammo: null,
    body: null,
    cape: null,
    feet: null,
    hands: null,
    head: null,
    legs: null,
    neck: null,
    ring: null,
    shield: null,
    weapon: null,
  },
  attackSpeed: DEFAULT_ATTACK_SPEED,
  prayers: [],
  bonuses: {
    str: 0,
    ranged_str: 0,
    magic_str: 0,
    prayer: 0,
  },
  defensive: {
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    ranged: 0,
  },
  offensive: {
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    ranged: 0,
  },
  buffs: {
    potions: [],
    onSlayerTask: true,
    inWilderness: false,
    kandarinDiary: true,
    chargeSpell: false,
    markOfDarknessSpell: false,
    forinthrySurge: false,
    soulreaperStacks: 0,
    baAttackerLevel: 0,
    chinchompaDistance: 4, // 4 tiles is the optimal range for "medium fuse" (rapid), which is the default selected stance
    usingSunfireRunes: false,
  },
  spell: null,
  leagues: {
    six: {
      selectedNodeIds: new Set<string>(['node1']),
      effects: {},
      distanceToEnemy: 1,
      enemyPrayers: {
        melee: false,
        ranged: false,
        magic: false,
      },
      blindbagWeapons: [],
      regenerateMagicBonus: 0,
      cullingSpree: false,
      bowHitsWithoutDamage: 0,
    },
  },
});
