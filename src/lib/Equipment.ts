import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { keys } from '@/utils';
import { TOMBS_OF_AMASCUT_MONSTER_IDS } from '@/constants';
import { sum } from 'd3-array';

export type EquipmentBonuses = Pick<Player, 'bonuses' | 'offensive' | 'defensive'>;

const commonAmmoCategories = () => {
  const ret: { [k: string]: number[] } = {
    bow_t1: [
      882, 883, 5616, 5622, // Bronze arrow + variants
      884, 885, 5617, 5623, // Iron arrow + variants
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
  ret.bow_t5 = [...ret.bow_t1, 886, 887, 5618, 5624]; // Steel arrow + variants
  ret.bow_t20 = [...ret.bow_t5, 888, 889, 5619, 5625]; // Mithril arrow + variants
  ret.bow_t30 = [...ret.bow_t20, 890, 891, 5620, 5626]; // Adamant arrow + variants
  ret.bow_t40 = [...ret.bow_t30, 892, 893, 5621, 5627, 78]; // Rune arrow + variants, ice arrows
  ret.bow_t50 = [...ret.bow_t40, 21326, 21332, 21334, 21336, 4160]; // Amethyst arrow + variants, broad arrows
  ret.bow_t60 = [...ret.bow_t50, 11212, 11227, 11228, 11229]; // Dragon arrow + variants

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
  25867: [], // Bow of faerdhinen (c)
};

/**
 * Returns whether the given ammo item ID is valid ammo for the given ranged weapon ID.
 * Will return true if no weapon is equipped, or no ranged weapon is equipped.
 * @param weaponId - the item ID of the ranged weapon
 * @param ammoId - the item ID of the ammo (such as bronze arrows)
 */
export const isValidAmmoForRangedWeapon = (weaponId?: number, ammoId?: number) => {
  if (!weaponId) return true; // No weapon, ammo is valid
  if (!Object.prototype.hasOwnProperty.call(ammoForRangedWeapons, weaponId)) return true; // Probably not a ranged weapon, ammo is valid

  const validAmmo = ammoForRangedWeapons[weaponId];
  if (validAmmo.length === 0 && ammoId === undefined) return true; // No ammo is valid for this weapon, no ammo was passed, valid
  if (ammoId && validAmmo.includes(ammoId)) return true; // Ammo can be used with this weapon

  return false; // Ammo is not valid for this weapon
};

/**
 * A map of base item ID -> variant item IDs for items that are identical in function. This includes
 * "locked" variants of items, broken/degraded variants of armour and weapons, and cosmetic recolours of equipment.
 * @see https://oldschool.runescape.wiki/w/Trouver_parchment
 */
export const equipmentAliases = {
  8849: [24141],
  1161: [2613, 2605],
  1199: [2611, 2603],
  1123: [2607, 23392, 23395, 23398, 23401, 23404, 2599],
  1073: [2609, 2601],
  1091: [3475, 3474],
  4708: [4860, 4856, 4859, 4858, 4857],
  4714: [4878, 4874, 4877, 4876, 4875],
  4712: [4872, 4868, 4871, 4870, 4869],
  4710: [4866, 4862, 4865, 4864, 4863],
  1729: [23309],
  1727: [10366],
  1731: [23354],
  24201: [24203],
  27624: [27626],
  11771: [26768, 25260],
  24192: [24194],
  21898: [24135],
  22109: [24222],
  22322: [24186],
  24195: [24197],
  25641: [25643],
  11773: [26770, 25264],
  2503: [12381, 12385],
  2497: [12383, 12387],
  8847: [24139],
  1165: [2595, 2587],
  1195: [2597, 2589],
  1125: [2591, 23366, 23369, 23372, 23375, 23378, 2583],
  1077: [2593, 2585],
  1089: [3473, 3472],
  1015: [12445, 12447],
  11864: [19639, 19643, 23073, 21264, 19647, 21888, 24370, 25910, 25898, 25904],
  28260: [28473],
  2499: [7374, 7376],
  2493: [7382, 7384],
  1011: [7386, 7388],
  579: [7394, 7396],
  577: [7390, 7392],
  24204: [24206],
  8844: [24136],
  1155: [12211, 12221],
  1189: [12213, 12223],
  1117: [12205, 12215],
  1075: [12207, 12217],
  1087: [12209, 12219],
  19991: [20059],
  26755: [26756],
  26749: [26750],
  26721: [26722],
  3105: [23413],
  4509: [24158],
  4510: [24159],
  11895: [24162],
  11898: [24165],
  11897: [24164],
  11896: [24163],
  11901: [24168],
  11900: [24167],
  11899: [24166],
  25171: [25173],
  25174: [25176],
  4511: [24160],
  4512: [24161],
  4508: [24157],
  4718: [4890, 4886, 4889, 4888, 4887],
  4716: [4884, 4880, 4883, 4882, 4881],
  4720: [4896, 4892, 4895, 4894, 4893],
  4722: [4902, 4898, 4901, 4900, 4899],
  11840: [22234],
  3140: [12414],
  12954: [24143],
  19722: [27008],
  11335: [12417],
  21012: [25916],
  21895: [22244],
  21892: [22242],
  4087: [12415],
  4585: [12416],
  1187: [12418],
  26759: [26760],
  26753: [26754],
  13073: [24180],
  26471: [27004],
  13072: [24178],
  26469: [27003],
  10548: [24173],
  10551: [24175],
  28067: [28069],
  6570: [24223],
  13329: [24134],
  27550: [27551],
  27552: [27553],
  21752: [26685, 25193],
  1135: [7370, 7372],
  1099: [7378, 7380],
  4730: [4926, 4922, 4925, 4924, 4923],
  4724: [4908, 4904, 4907, 4906, 4905],
  4728: [4920, 4916, 4919, 4918, 4917],
  4726: [4914, 4910, 4913, 4912, 4911],
  12639: [24171],
  10547: [24172],
  28262: [28474],
  21793: [24249],
  21784: [24234],
  21791: [24248],
  21776: [24232],
  21795: [24250],
  21780: [24233],
  21295: [24224],
  21285: [24133],
  8845: [24137],
  1153: [12241, 12231],
  1191: [12243, 12233],
  1115: [12235, 12225],
  1067: [12237, 12227],
  1081: [12239, 12229],
  4732: [4932, 4928, 4931, 4930, 4929],
  4734: [4938, 4934, 4937, 4936, 4935],
  4738: [4950, 4946, 4949, 4948, 4947],
  4736: [4944, 4940, 4943, 4942, 4941],
  26741: [26742],
  26739: [26740],
  26737: [26738],
  1129: [23381],
  1095: [23384],
  26745: [26746],
  26747: [26748],
  26743: [26744],
  27374: [27376],
  27363: [27365],
  8848: [24140],
  1159: [12283, 12293],
  1197: [12281, 12291],
  1121: [12277, 12287],
  1071: [12279, 12289],
  1085: [12285, 12295],
  542: [20202, 23306],
  544: [20199, 23303],
  10555: [24176],
  10550: [24174],
  2501: [12327, 12331],
  2495: [12329, 12333],
  13202: [26764, 25252],
  8850: [24142],
  23230: [27009],
  1163: [2619, 2627],
  1201: [2621, 2629],
  1127: [2615, 23209, 23212, 23215, 23218, 23221, 2623],
  1079: [2617, 2625],
  1093: [3476, 3477],
  10549: [24533],
  26731: [26732],
  26735: [26736],
  26733: [26734],
  12018: [26782, 25278],
  12017: [26763, 25250],
  12637: [24169],
  11770: [26767, 25258],
  24198: [24200],
  28266: [28476],
  11865: [26674, 25177],
  28264: [28475],
  8846: [24138],
  1157: [20178, 20193],
  1193: [20181, 20196],
  1119: [20169, 20184],
  1069: [20172, 20187],
  1083: [20175, 20190],
  1133: [7362, 7364],
  1097: [7366, 7368],
  26757: [26758],
  26751: [26752],
  4747: [4962, 4958, 4961, 4960, 4959],
  4745: [4956, 4952, 4955, 4954, 4953],
  4749: [4968, 4964, 4967, 4966, 4965],
  4751: [4974, 4970, 4973, 4972, 4971],
  12692: [26766, 25256],
  12691: [26765, 25254],
  6528: [23235],
  4757: [4992, 4988, 4991, 4990, 4989],
  4755: [4986, 4982, 4985, 4984, 4983],
  4753: [4980, 4976, 4979, 4978, 4977],
  4759: [4998, 4994, 4997, 4996, 4995],
  8842: [24182],
  26467: [27002],
  8841: [24181],
  8840: [24179],
  26465: [27001],
  8839: [24177],
  26463: [27000],
  11663: [24183],
  26473: [27005],
  11665: [24185],
  26477: [27007],
  11664: [24184],
  26475: [27006],
  11772: [26769, 25262],
  1171: [20166],
  26723: [26724],
  26727: [26728],
  12638: [24170],
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
  };

  keys(player.equipment).forEach((slot) => {
    const piece = player.equipment[slot];
    if (!piece) {
      return;
    }

    // If this is the ammo slot, determine whether the ammo is compatible with the current weapon.
    if (piece.slot === 'ammo' && !isValidAmmoForRangedWeapon(player.equipment.weapon?.id, piece.id)) {
      // If it is not valid ammo, then don't include this in the bonuses.
      return;
    }

    keys(piece.bonuses).forEach((stat) => {
      totals.bonuses[stat] += piece.bonuses[stat] || 0;
    });
    keys(piece.offensive).forEach((stat) => {
      totals.offensive[stat] += piece.offensive[stat] || 0;
    });
    keys(piece.defensive).forEach((stat) => {
      totals.defensive[stat] += piece.defensive[stat] || 0;
    });
  });

  if (player.equipment.weapon?.name === "Tumeken's shadow") {
    const factor = TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id) ? 4 : 3;
    totals.bonuses.magic_str *= factor;
    totals.offensive.magic *= factor;
  }

  if (player.equipment.weapon?.name === "Dinh's bulwark" || player.equipment.weapon?.name === "Dinh's blazing bulwark") {
    const defensives = totals.defensive;
    const defenceSum = defensives.stab + defensives.slash + defensives.crush + defensives.ranged;
    totals.bonuses.str += Math.max(0, Math.trunc((defenceSum - 800) / 12) - 38);
  }

  if (player.spell?.spellbook === 'ancient') {
    const virtusPieces = sum([player.equipment.head?.name, player.equipment.body?.name, player.equipment.legs?.name], (i) => (i?.includes('Virtus') ? 1 : 0));
    totals.bonuses.magic_str += 3 * virtusPieces;
  }

  return totals;
};
