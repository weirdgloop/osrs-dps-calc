import { EquipmentPiece, Player, PlayerEquipment } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { keys } from '@/utils';
import {
  BLOWPIPE_IDS,
  CAST_STANCES,
  DEFAULT_ATTACK_SPEED,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
} from '@/lib/constants';
import { sum } from 'd3-array';
import equipment from '../../cdn/json/equipment.json';
import generatedEquipmentAliases from './EquipmentAliases';

export type EquipmentBonuses = Pick<Player, 'bonuses' | 'offensive' | 'defensive' | 'attackSpeed'>;

/**
 * All available equipment that a player can equip.
 */
export const availableEquipment = equipment as EquipmentPiece[];

export const noStatExceptions = [
  'Castle wars bracelet',
  'Lightbearer',
  'Ring of recoil',
  'Phoenix necklace',
  'Reinforced goggles',
  'Expeditious bracelet',
  'Bracelet of slaughter',
  'Facemask',
  'Earmuffs',
  'Bug lantern',
  'Nose peg',
  "Efaritay's aid",
  'Inoculation bracelet',
  'Bracelet of ethereum',
  'Atlatl dart',
];

/**
 * A map of base item ID -> variant item IDs for items that are identical in function. This includes
 * "locked" variants of items, broken/degraded variants of armour and weapons, and cosmetic recolours of equipment.
 * @see https://oldschool.runescape.wiki/w/Trouver_parchment
 */
export const equipmentAliases = generatedEquipmentAliases as { [key: number]: number[] };

const commonAmmoCategories = () => {
  const ret: { [k: string]: number[] } = {
    bow_t1: [
      882, 883, 5616, 5622, 598, 942, // Bronze arrow + variants
      884, 885, 5617, 5623, 2532, 2533, // Iron arrow + variants
      22227, 22228, 22229, 22230, // barb assault
    ],
    cb_t1: [
      877, 878, 6061, 6062, 879, 9236, // Bronze bolts + variants, opal bolts + (e)
    ],
    javelin: [
      825, 831, 5642, 5648, // Bronze javelin + variants
      826, 832, 5643, 5649, // Iron javelin + variants
      827, 833, 5644, 5650, // Steel javelin + variants
      828, 834, 5645, 5651, // Mithril javelin + variants
      829, 835, 5646, 5652, // Adamant javelin + variants
      830, 836, 5647, 5653, // Rune javelin + variants
      21318, 21320, 21322, 21324, // Amethyst javelin + variants
      19484, 19486, 19488, 19490, // Dragon javelin + variants
    ],
  };

  // Bows
  ret.bow_t5 = [...ret.bow_t1, 886, 887, 5618, 5624, 2534, 2535]; // Steel arrow + variants
  ret.bow_t20 = [...ret.bow_t5, 888, 889, 5619, 5625, 2536, 2537]; // Mithril arrow + variants
  ret.bow_t30 = [...ret.bow_t20, 890, 891, 5620, 5626, 2538, 2539]; // Adamant arrow + variants
  ret.bow_t40 = [...ret.bow_t30, 892, 893, 5621, 5627, 78, 2540, 2541]; // Rune arrow + variants, ice arrows
  ret.bow_t50 = [...ret.bow_t40, 21326, 21332, 21334, 21336, 4160, 21328, 21330]; // Amethyst arrow + variants, broad arrows
  ret.bow_t60 = [...ret.bow_t50, 11212, 11227, 11228, 11229, 11217, 11222]; // Dragon arrow + variants

  // Bolts
  ret.cb_t16 = [...ret.cb_t1, 9139, 9286, 9293, 9300, 9335, 9237]; // Blurite bolts + variants, jade bolts + (e)
  ret.cb_t26 = [...ret.cb_t16, 9140, 9287, 9294, 9301, 880, 9238, 9145, 9292, 9299, 9306]; // Iron bolts + variants, pearl bolts + (e), silver bolts
  ret.cb_t31 = [...ret.cb_t26, 9141, 9288, 9295, 9302, 9336, 9239]; // Steel bolts + variants, topaz bolts + (e)
  ret.cb_t36 = [...ret.cb_t31, 9142, 9289, 9296, 9303, 9337, 9240, 9338, 9241]; // Mithril bolts + variants, sapphire/emerald bolts + (e)
  ret.cb_t46 = [...ret.cb_t36, 9143, 9290, 9297, 9304, 9339, 9242, 9340, 9243]; // Adamant bolts + variants, ruby/diamond bolts + (e)
  ret.cb_t61 = [...ret.cb_t46, 9144, 9291, 9298, 9305, 11875, 21316, 9341, 9244, 9342, 9245]; // Runite bolts + variants, broad bolts, amethyst broad bolts, dragonstone/onyx bolts + (e)
  ret.cb_t64 = [...ret.cb_t61, 21905, 21924, 21926, 21928, 21955, 21932, 21957, 21934, 21959, 21936, 21961, 21938, 21963, 21940, 21965, 21942, 21967, 21944, 21969, 21946, 21971, 21948, 21973, 21950]; // Dragon bolts + variants, many gem-tipped bolts
  return ret;
};

/**
 * A map of item ID -> array of item IDs for which ranged weapons can use which specific types of ammo.
 * Empty arrays indicate that the item should not be used with any ammo in the ammo slot at all.
 */
const ammoForRangedWeapons: { [weapon: number]: number[] } = {
  // todo(wgs): scorching bow arrows
  11708: commonAmmoCategories().bow_t1, // Cursed goblin bow
  23357: commonAmmoCategories().bow_t1, // Rain bow
  9705: [9706], // Training bow
  841: commonAmmoCategories().bow_t1, // Shortbow
  839: commonAmmoCategories().bow_t1, // Longbow
  843: commonAmmoCategories().bow_t5, // Oak shortbow
  845: commonAmmoCategories().bow_t5, // Oak longbow
  4236: commonAmmoCategories().bow_t5, // Signed oak bow
  849: commonAmmoCategories().bow_t20, // Willow shortbow
  847: commonAmmoCategories().bow_t20, // Willow longbow
  10280: commonAmmoCategories().bow_t20, // Willow comp bow
  853: commonAmmoCategories().bow_t30, // Maple shortbow
  851: commonAmmoCategories().bow_t30, // Maple longbow
  2883: [2866], // Ogre bow
  4827: [2866, 4773, 4778, 4783, 4788, 4793, 4798, 4803], // Comp ogre bow
  857: commonAmmoCategories().bow_t40, // Yew shortbow
  855: commonAmmoCategories().bow_t40, // Yew longbow
  10282: commonAmmoCategories().bow_t40, // Yew comp bow
  28794: commonAmmoCategories().bow_t50, // Bone shortbow
  6724: commonAmmoCategories().bow_t50, // Seercull
  861: commonAmmoCategories().bow_t50, // Magic shortbow
  12788: commonAmmoCategories().bow_t50, // Magic shortbow (i)
  859: commonAmmoCategories().bow_t50, // Magic longbow
  10284: commonAmmoCategories().bow_t50, // Magic comp bow
  11235: commonAmmoCategories().bow_t60, // Dark bow
  27853: commonAmmoCategories().bow_t60, // Dark bow (bh)
  12424: commonAmmoCategories().bow_t60, // 3rd age bow
  27610: commonAmmoCategories().bow_t60, // Venator bow
  27612: commonAmmoCategories().bow_t60, // Venator bow (uncharged)
  20997: commonAmmoCategories().bow_t60, // Twisted bow
  29591: commonAmmoCategories().bow_t60, // Scorching bow
  837: commonAmmoCategories().cb_t1, // Crossbow
  767: commonAmmoCategories().cb_t1, // Phoenix crossbow
  9174: commonAmmoCategories().cb_t1, // Bronze crossbow
  9176: commonAmmoCategories().cb_t16, // Blurite crossbow
  9177: commonAmmoCategories().cb_t26, // Iron crossbow
  9179: commonAmmoCategories().cb_t31, // Steel crossbow
  9181: commonAmmoCategories().cb_t36, // Mithril crossbow
  9183: commonAmmoCategories().cb_t46, // Adamant crossbow
  9185: commonAmmoCategories().cb_t61, // Rune crossbow
  21902: commonAmmoCategories().cb_t64, // Dragon crossbow
  19478: commonAmmoCategories().javelin, // Light ballista
  19481: commonAmmoCategories().javelin, // Heavy ballista
  8880: [...commonAmmoCategories().cb_t16, 9140, 9287, 9294, 9301, 8882], // Dorgeshuun crossbow
  10156: [10158, 10159], // Hunters' crossbow
  4734: [4740], // Karil's crossbow (undmg)
  21012: commonAmmoCategories().cb_t64, // Dragon hunter crossbow
  11785: commonAmmoCategories().cb_t64, // Armadyl crossbow
  26374: commonAmmoCategories().cb_t64, // Zaryte crossbow
  12924: [], // Toxic blowpipe (empty)
  12926: [], // Toxic blowpipe (charged)
  22547: [], // Craw's bow (empty)
  22550: [], // Craw's bow (charged)
  23983: [], // Crystal bow (empty)
  23985: [], // Crystal bow (inactive)
  24123: [], // Crystal bow (new)
  27652: [], // Webweaver bow (empty)
  27655: [], // Webweaver bow (charged)
  25862: [], // Bow of faerdhinen (empty)
  25865: [], // Bow of faerdhinen (charged)
  10149: [10142], // Swamp lizard, Guam tar
  10146: [10143], // Orange salamander, Marrentill tar
  10147: [10144], // Red salamander, Tarromin tar
  10148: [10145], // Black salamander, Harralander tar
  28834: [28837], // Tecu salamander, Irit tar
  28869: [28872, 28878], // Hunters' sunlight crossbow
  29000: [28991], // Eclipse atlatl
};

export enum AmmoApplicability {
  /** Include the ammo slot bonuses in the equipment stats */
  INCLUDED,
  /** Allow the ammo but do not include its ranged accuracy and strength bonuses */
  ALLOWED,
  /** The ammo is incompatible with the weapon */
  INVALID,
}

/**
 * Returns whether the given ammo item ID is valid ammo for the given ranged weapon ID.
 * Will return true if no weapon is equipped, or no ranged weapon is equipped.
 * @param weaponId - the item ID of the ranged weapon
 * @param ammoId - the item ID of the ammo (such as bronze arrows)
 */
export const ammoApplicability = (weaponId?: number, ammoId?: number): AmmoApplicability => {
  const validAmmo = ammoForRangedWeapons[weaponId || -1];

  // The weapon does not use ammo
  if (!validAmmo || validAmmo.length === 0) {
    return AmmoApplicability.ALLOWED;
  }

  // weapon requires ammo, and we have one that matches the list
  if (ammoId !== undefined && validAmmo.includes(ammoId)) {
    return AmmoApplicability.INCLUDED;
  }

  // weapon requires ammo, but we don't have a matching one
  return AmmoApplicability.INVALID;
};

/**
 * Returns the canonical (base) item ID for a given item ID. This is useful if there are variants of each item.
 * @param itemId
 */
export const getCanonicalItemId = (itemId: number): number => {
  for (const [k, v] of Object.entries(equipmentAliases)) {
    if (v.includes(itemId)) return parseInt(k);
  }
  return itemId;
};

export const getCanonicalItem = (equipmentPiece: EquipmentPiece): EquipmentPiece => {
  const canonicalId = getCanonicalItemId(equipmentPiece.id);
  if (equipmentPiece.id === canonicalId) {
    return equipmentPiece;
  }

  return availableEquipment.find((e) => e.id === canonicalId) || equipmentPiece;
};

export const getCanonicalEquipment = (inputEq: PlayerEquipment) => {
  // canonicalize equipment ids
  let canonicalized = inputEq;
  for (const k of keys(inputEq)) {
    const v = inputEq[k];
    if (!v) continue;

    const canonical = getCanonicalItem(v);
    if (v.id !== canonical.id) {
      canonicalized = {
        ...canonicalized,
        [k]: canonical,
      };
    }
  }
  return canonicalized;
};

/**
 * Calculates the player's attack speed using current stance and equipment.
 */
export const calculateAttackSpeed = (player: Player, monster: Monster): number => {
  let attackSpeed = player.equipment.weapon?.speed || DEFAULT_ATTACK_SPEED;

  if (player.style.type === 'ranged' && player.style.stance === 'Rapid') {
    attackSpeed -= 1;
  } else if (CAST_STANCES.includes(player.style.stance)) {
    if (player.equipment.weapon?.name === 'Harmonised nightmare staff'
      && player.spell?.spellbook === 'standard'
      && player.style.stance !== 'Manual Cast') {
      attackSpeed = 4;
    } else if (player.equipment.weapon?.name === 'Twinflame staff') {
      attackSpeed = 6;
    } else {
      attackSpeed = 5;
    }
  }

  // Giant rat (Scurrius)
  if (monster.id === 7223 && player.style.stance !== 'Manual Cast') {
    if (['Bone mace', 'Bone shortbow', 'Bone staff'].includes(player.equipment.weapon?.name || '')) {
      attackSpeed = 1;
    }
  }

  return Math.max(attackSpeed, 1);
};

export const calculateEquipmentBonusesFromGear = (player: Player, monster: Monster): EquipmentBonuses => {
  const totals: EquipmentBonuses = {
    bonuses: {
      str: 0,
      magic_str: 0,
      ranged_str: 0,
      prayer: 0,
    },
    offensive: {
      slash: 0,
      stab: 0,
      crush: 0,
      ranged: 0,
      magic: 0,
    },
    defensive: {
      slash: 0,
      stab: 0,
      crush: 0,
      ranged: 0,
      magic: 0,
    },
    attackSpeed: DEFAULT_ATTACK_SPEED,
  };

  // canonicalize all items first, otherwise ammoApplicability etc calls may return incorrect results later
  const playerEquipment: PlayerEquipment = getCanonicalEquipment(player.equipment);

  keys(playerEquipment).forEach((slot) => {
    let piece = playerEquipment[slot]!;
    if (!piece) {
      return;
    }

    // canonicalize the item first
    piece = getCanonicalItem(piece);

    // skip over ammo slot's ranged bonuses if it is not used by the bow
    const applyRangedStats = piece.slot !== 'ammo' || ammoApplicability(playerEquipment.weapon?.id, piece.id) === AmmoApplicability.INCLUDED;

    keys(piece.bonuses).forEach((stat) => {
      if (stat === 'ranged_str' && !applyRangedStats) {
        return;
      }
      totals.bonuses[stat] += piece.bonuses[stat] || 0;
    });
    keys(piece.offensive).forEach((stat) => {
      if (stat === 'ranged' && !applyRangedStats) {
        return;
      }
      totals.offensive[stat] += piece.offensive[stat] || 0;
    });
    keys(piece.defensive).forEach((stat) => {
      totals.defensive[stat] += piece.defensive[stat] || 0;
    });
  });

  if (BLOWPIPE_IDS.includes(playerEquipment.weapon?.id || 0)) {
    const dart = availableEquipment.find((e) => e.id === playerEquipment.weapon?.itemVars?.blowpipeDartId);
    if (dart) {
      totals.bonuses.ranged_str += dart.bonuses.ranged_str;
    } else {
      // todo warn user
    }
  }

  if (playerEquipment.weapon?.name === "Tumeken's shadow" && player.style.stance !== 'Manual Cast') {
    const factor = TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id) ? 4 : 3;
    totals.bonuses.magic_str *= factor;
    totals.offensive.magic *= factor;
  }

  if (playerEquipment.weapon?.name === "Dinh's bulwark" || playerEquipment.weapon?.name === "Dinh's blazing bulwark") {
    const defensives = totals.defensive;
    const defenceSum = defensives.stab + defensives.slash + defensives.crush + defensives.ranged;
    totals.bonuses.str += Math.max(0, Math.trunc((defenceSum - 800) / 12) - 38);
  }

  if (player.spell?.spellbook === 'ancient' && CAST_STANCES.includes(player.style.stance)) {
    const virtusPieces = sum([playerEquipment.head?.name, playerEquipment.body?.name, playerEquipment.legs?.name], (i) => (i?.includes('Virtus') ? 1 : 0));
    totals.bonuses.magic_str += 30 * virtusPieces;
  }

  // void mage is a visible bonus of 5%
  if (playerEquipment.head?.name === 'Void mage helm'
    && playerEquipment.body?.name === 'Elite void top'
    && playerEquipment.legs?.name === 'Elite void robe'
    && playerEquipment.hands?.name === 'Void knight gloves') {
    totals.bonuses.magic_str += 50;
  }

  const cape = playerEquipment.cape;
  const dizanasQuiverCharged = cape?.name === "Dizana's max cape"
    || cape?.name === "Blessed dizana's quiver"
    || (cape?.name === "Dizana's quiver" && cape?.version === 'Charged');
  if (dizanasQuiverCharged && ammoApplicability(player.equipment.weapon?.id, player.equipment.ammo?.id) === AmmoApplicability.INCLUDED) {
    totals.offensive.ranged += 10;
    totals.bonuses.ranged_str += 1;
  }

  totals.attackSpeed = calculateAttackSpeed(player, monster);

  return totals;
};

/* eslint-disable quote-props */
export const WEAPON_SPEC_COSTS: { [canonicalName: string]: number } = {
  'Abyssal dagger': 25,
  'Dragon dagger': 25,
  'Dragon longsword': 25,
  'Dragon mace': 25,
  "Osmumten's fang": 25,
  "Osmumten's fang (or)": 25,
  'Dual macuahuitl': 25,
  'Scorching bow': 25,
  'Dragon knife': 25,
  'Purging staff': 25,

  'Dawnbringer': 30,
  'Dragon halberd': 30,
  'Crystal halberd': 30,
  'Burning claws': 30,

  'Magic longbow': 35,
  'Magic comp bow': 35,

  'Dragon sword': 40,

  'Elder maul': 50,
  'Dragon warhammer': 50,
  'Bandos godsword': 50,
  'Saradomin godsword': 50,
  'Accursed sceptre': 50,
  'Accursed sceptre (a)': 50,
  'Arclight': 50,
  'Emberlight': 50,
  'Tonalztics of ralos': 50,
  'Dragon claws': 50,
  'Voidwaker': 50,
  'Toxic blowpipe': 50,
  'Blazing blowpipe': 50,
  'Webweaver bow': 50,
  'Magic shortbow (i)': 50,
  'Ancient godsword': 50,
  'Armadyl godsword': 50,
  'Zamorak godsword': 50,
  'Abyssal bludgeon': 50,
  'Abyssal whip': 50,
  'Barrelchest anchor': 50,

  'Magic shortbow': 55,
  'Dark bow': 55,
  'Eldritch nightmare staff': 55,
  'Volatile nightmare staff': 55,
  'Dragon scimitar': 55,

  'Heavy ballista': 65,
  'Light ballista': 65,
  "Saradomin's blessed sword": 65,

  'Brine sabre': 75,
  'Zaryte crossbow': 75,

  'Saradomin sword': 100,
  'Seercull': 100,
};
/* eslint-enable quote-props */
