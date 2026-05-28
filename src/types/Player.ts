import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { Prayer } from '@/enums/Prayer';
import Potion from '@/enums/Potion';
import { Spell } from '@/types/Spell';
import { getCombatStylesForCategory, PlayerCombatStyle } from '@/types/PlayerCombatStyle';
import { DEFAULT_ATTACK_SPEED } from '@/lib/constants';
import { LeaguesEffect } from '@/app/components/player/demonicPactsLeague/pactSelector/parse_skill_tree_elements';
import { MergeDeep } from 'type-fest';

export enum PlayerSkill {
  ATTACK = 'atk',
  DEFENCE = 'def',
  HITPOINTS = 'hp',
  MAGIC = 'magic',
  PRAYER = 'prayer',
  RANGED = 'ranged',
  STRENGTH = 'str',
  MINING = 'mining',
  HERBLORE = 'herblore',
}

export type PlayerSkills = Record<PlayerSkill, number>;

export enum EquipmentSlot {
  HEAD = 'head',
  CAPE = 'cape',
  NECK = 'neck',
  AMMO = 'ammo',
  WEAPON = 'weapon',
  BODY = 'body',
  SHIELD = 'shield',
  LEGS = 'legs',
  HANDS = 'hands',
  FEET = 'feet',
  RING = 'ring',
}

export const isEquipmentSlot = (s: string): s is EquipmentSlot => Object.values(EquipmentSlot).includes(s as EquipmentSlot);

export type PlayerEquipment = Record<EquipmentSlot, EquipmentPiece | null>;

export interface EquipmentPiece extends EquipmentStats {
  name: string;
  id: number;
  weight: number;
  version: string;
  slot: EquipmentSlot;
  image: string;
  speed: number;
  category: EquipmentCategory;
  isTwoHanded: boolean;
  itemVars?: {
    blowpipeDartName?: string;
    blowpipeDartId?: number;
  };
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

  blindbagWeapons: EquipmentPiece[];

  regenerateMagicBonus: number;

  cullingSpree: boolean;

  bowHitsWithoutDamage: number;
}

export type LoadoutId = number;

export interface PlayerBase {
  name: string;
  style: PlayerCombatStyle;
  skills: PlayerSkills;
  currentHp: number;
  equipment: PlayerEquipment;
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
    six: Omit<LeaguesState, 'effects'>;
  }
}

export const createDefaultPlayer = (name?: string): PlayerBase => ({
  name: name ?? 'New Loadout',
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
  currentHp: 99,
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
  prayers: [],
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
      distanceToEnemy: 1,
      blindbagWeapons: [],
      regenerateMagicBonus: 0,
      cullingSpree: false,
      bowHitsWithoutDamage: 0,
    },
  },
});

export interface PlayerDerived extends EquipmentStats {
  boostedSkills: Omit<PlayerSkills, 'hp'>;
  attackSpeed: number;
  leagues: {
    six: Pick<LeaguesState, 'effects'>;
  }
  spellMaxHit: number | null;
}

export type ManualModeDerivedOverrides =
  Pick<PlayerDerived,
  'offensive' |
  'defensive' |
  'bonuses' |
  'attackSpeed' |
  'spellMaxHit' |
  'boostedSkills'
  >;

export const createDefaultPlayerDerived = (): PlayerDerived => ({
  offensive: {
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    ranged: 0,
  },
  defensive: {
    stab: 0,
    slash: 0,
    crush: 0,
    magic: 0,
    ranged: 0,
  },
  bonuses: {
    str: 0,
    ranged_str: 0,
    magic_str: 0,
    prayer: 0,
  },
  boostedSkills: {
    atk: 99,
    def: 99,
    magic: 99,
    prayer: 99,
    ranged: 99,
    str: 99,
    mining: 99,
    herblore: 99,
  },
  attackSpeed: DEFAULT_ATTACK_SPEED,
  leagues: {
    six: {
      effects: {},
    },
  },
  spellMaxHit: null,
});

export type Player = MergeDeep<PlayerBase, PlayerDerived>;
