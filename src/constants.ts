/**
 * IDs of monsters that are present in Tombs of Amascut and are affected by path level.
 * TODO does this affect minions? I assumed yes.
 */
export const TOMBS_OF_AMASCUT_PATH_MONSTER_IDS = [
  11789, 11790, 11791, 11792, 11793, 11794, 11795, 11796, // akkha
  11797, 11798, 11799, // akkha shadows
  11781, 11709, 11712, 11711, 11714, 11715, 11718, 11710, 11713, 11716, 11717, // apmeken monkeys 
  11778, 11779, 11780, // ba-ba
  11719, 11720, 11721, 11722, // kephri
  11697, 11723, 11723, 11724, 11725, 11726, 11727, // kephri minions
  11705, // crondis tree croc 
  11730, 11732, 11733, // zebak
];

/** IDs of monsters that are present in Tombs of Amascut **/
export const TOMBS_OF_AMASCUT_MONSTER_IDS = [
  ...TOMBS_OF_AMASCUT_PATH_MONSTER_IDS,
  11750, 11751, 11752, // obelisk (wardens) 
  11747, 11749, 11756, 11757, 11758, 11760, 11762, 11764, // tumeken warden 
  11746, 11748, 11753, 11754, 11755, 11759, 11761, 11763, // elidinis warden
];

export const VERZIK_P1_IDS = [
  10830, 10831, 10832, // em
  8369, 8370, 8371, // norm
  10847, 10848, 10849 // hmt
];

export const VERZIK_IDS = [
  ...VERZIK_P1_IDS,
  10833, 10834, 10835, // verzik entry mode
  8372, 8373, 8374, // verzik normal mode
  10850, 10851, 10852, // verzik hard mode
];

/** IDs of monsters that are present in Theatre of Blood **/
export const TOB_MONSTER_IDS = [
  ...VERZIK_P1_IDS,
  // normal
  8360, 8361, 8362, 8363, 8364, 8365, // maiden 
  8366, 8367, // maiden crab + blood spawn 
  8359, // bloat 
  8342, 8343, 8344, 8345, 8346, 8347, 8348, 8349, 8350, 8351, 8352, 8353, // nylos 
  8355, 8356, 8357, // nylo boss 
  10864, 10865, // sote 
  8339, 8340, // xarpus
  8372, 8373, 8374, // verzik 
  8376, 8381, 8382, 8383, 8384, 8385, // verzik web + nylos 
  
  // hmt
  10822, 10823, 10824, 10825, 10826, 10827, // maiden
  10828, 10829, // maiden crab + blood spawn 
  10813, // bloat
  10791, 10792, 10793, 10794, 10795, 10796, 10797, 10798, 10799, 10800, 10801, 10802, // nylos 
  10804, 10805, 10806, // nylo demi-boss
  10808, 10809, 10810, // nylo boss 
  10867, 10868, // sote 
  10770, 10771, 10772, // xarpus (i think there's an extra one here because of its different p3 behaviour?)
  10850, 10851, 10852, // verzik
  10854, 10858, 10859, 10860, 10861, 10862 // verzik web + nylos 
];

/** IDs of monsters that are present in Theatre of Blood Entry Mode.
 * Separated from norm + hmt due to different health scaling rules. **/
export const TOB_EM_MONSTER_IDS = [
  10814, 10815, 10816, 10817, 10818, 10819, // maiden 
  10820, 10821, // maiden crab + blood spawn  
  10812, // bloat
  10774, 10775, 10776,
  10777, 10778, 10779, 10780, 10781, 10782, 10783, 10784, 10785, // nylos
  10787, 10788, 10789, // nylo boss 
  10864, 10865, // sote 
  10767, 10768, // xarpus 
  10833, 10834, 10835, // verzik 
  10837, 10841, 10842, 10843, 10844, 10845 // verzik web + nylos
];

/**
 * IDs of Tekton from the Chambers of Xeric. 
 * Separated due to different defence scaling rules.
 */
export const TEKTON_IDS = [
  7540, 7543, // reg
  7544, 7545, // cm
];

/**
 * IDs of Guardians from the Chambers of Xeric. 
 * Separated due to different health scaling rules.
 */
export const GUARDIAN_IDS = [
  7569, 7571, // reg
  7570, 7572, // cm
];

/**
 * IDs of the Great Olm's head from the Chambers of Xeric.
 * Separated due to different health scaling rules.
 */
export const OLM_HEAD_IDS = [
  7551, // reg
  7554, // cm
];

/**
 * IDs of the Great Olm from the Chambers of Xeric. 
 * Separated due to different health, offence, and defence scaling rules.
 */
export const OLM_IDS = [
  ...OLM_HEAD_IDS,
  7550, 7552, // reg
  7553, 7555, // cm
];

/**
 * IDs of Scavenger beasts from the Chambers of Xeric.
 * Separated due to different health scaling rules.
 */
export const SCAVENGER_BEAST_IDS = [
  7548, 7549
];

/**
 * IDs of Vespula's Abyssal portal from the Chambers of Xeric.
 * Separated due to different offence scaling rules.
 */
export const ABYSSAL_PORTAL_IDS = [
  7533,
];

/**
 * IDs of Vasa's Glowing crystal from the Chambers of Xeric.
 * Separated due to different health and defence scaling rules.
 */
export const GLOWING_CRYSTAL_IDS = [
  7568,
];

/**
 * IDs of the Ice demon from the Chambers of Xeric.
 */
export const ICE_DEMON_IDS = [
  7584, // reg
  7585, // cm
];

/**
 * IDs of the Fragment of Seren.
 */
export const FRAGMENT_OF_SEREN_IDS = [
  8917, 8918, 8919, 8920
];

/**
 * IDs of monsters that calculate their magical defence using the defence stat.
 * https://twitter.com/JagexAsh/status/1689566945635438592
 **/
export const USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS = [
  ...ICE_DEMON_IDS,
  ...VERZIK_IDS,
  ...FRAGMENT_OF_SEREN_IDS,
  11709, 11712, // baboon brawler
  9118 // rabbit (prifddinas)
];

export const PARTY_SIZE_REQUIRED_MONSTER_IDS = [
  ...TOMBS_OF_AMASCUT_MONSTER_IDS,
  ...TOB_MONSTER_IDS,
  ...TOB_EM_MONSTER_IDS,
];

export const ACCURACY_PRECISION = 2;
export const DPS_PRECISION = 3;
