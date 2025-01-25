import { CombatStyleStance } from '@/types/PlayerCombatStyle';

export const BLOWPIPE_IDS: number[] = [
  12926, // regular
  28688, // blazing
];

// The maximum number of loadouts that users can have. Do not lower it, else it will cause share link issues.
export const NUMBER_OF_LOADOUTS = 6;

export const AKKHA_IDS = [
  11789, 11790, 11791, 11792, 11793, 11794, 11795, 11796,
];

export const AKKHA_SHADOW_IDS = [
  11797, 11798, 11799,
];

export const BABA_IDS = [
  11778, 11779, 11780,
];

export const KEPHRI_SHIELDED_IDS = [
  11719,
];
// ^v todo these two might be swapped ^v
export const KEPHRI_UNSHIELDED_IDS = [
  11721,
];

export const KEPHRI_OVERLORD_IDS = [
  11724, 11725, 11726,
];

export const ZEBAK_IDS = [
  11730, 11732, 11733,
];

export const TOA_OBELISK_IDS = [
  11750, 11751, 11752,
];

export const P2_WARDEN_IDS = [
  11753, 11754, // elidinis
  11756, 11757, // tumeken
];

export const P3_WARDEN_IDS = [
  11761, 11763, // elidinis
  11762, 11764, // tumeken
];

export const TOA_WARDEN_CORE_EJECTED_IDS = [
  11755, // elidinis
  11758, // tumeken
];

/**
 * IDs of monsters that are present in Tombs of Amascut and are affected by path level.
 */
export const TOMBS_OF_AMASCUT_PATH_MONSTER_IDS = [
  ...AKKHA_IDS,
  ...AKKHA_SHADOW_IDS,
  ...BABA_IDS,
  ...KEPHRI_SHIELDED_IDS,
  ...KEPHRI_UNSHIELDED_IDS,
  ...KEPHRI_OVERLORD_IDS,
  ...ZEBAK_IDS,
];

/** IDs of monsters that are present in Tombs of Amascut * */
export const TOMBS_OF_AMASCUT_MONSTER_IDS = [
  ...TOMBS_OF_AMASCUT_PATH_MONSTER_IDS,
  ...TOA_OBELISK_IDS,
  ...P2_WARDEN_IDS,
  ...TOA_WARDEN_CORE_EJECTED_IDS,
  ...P3_WARDEN_IDS,
];

export const VERZIK_P1_IDS = [
  10830, 10831, 10832, // em
  8369, 8370, 8371, // norm
  10847, 10848, 10849, // hmt
];

export const VERZIK_IDS = [
  ...VERZIK_P1_IDS,
  10833, 10834, 10835, // verzik entry mode
  8372, 8373, 8374, // verzik normal mode
  10850, 10851, 10852, // verzik hard mode
];

export const SOTETSEG_IDS = [
  8387, 8388, // normal
  10867, 10868, // hard
];

/** IDs of monsters that are present in Theatre of Blood * */
export const TOB_MONSTER_IDS = [
  ...VERZIK_P1_IDS,
  // normal
  8360, 8361, 8362, 8363, 8364, 8365, // maiden
  8366, 8367, // maiden crab + blood spawn
  8359, // bloat
  8342, 8343, 8344, 8345, 8346, 8347, 8348, 8349, 8350, 8351, 8352, 8353, // nylos
  8355, 8356, 8357, // nylo boss
  ...SOTETSEG_IDS,
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
  // sote is above
  10770, 10771, 10772, // xarpus (i think there's an extra one here because of its different p3 behaviour?)
  10850, 10851, 10852, // verzik
  10854, 10858, 10859, 10860, 10861, 10862, // verzik web + nylos
];

/** IDs of monsters that are present in Theatre of Blood Entry Mode.
 * Separated from norm + hmt due to different health scaling rules. * */
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
  10837, 10841, 10842, 10843, 10844, 10845, // verzik web + nylos
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
 * IDs of the Great Olm's melee hand from the Chambers of Xeric.
 */
export const OLM_MELEE_HAND_IDS = [
  7552, // reg
  7555, // cm
];

/**
 * IDs of the Great Olm's mage hand from the Chambers of Xeric.
 */
export const OLM_MAGE_HAND_IDS = [
  7550, // reg
  7553, // cm
];

/**
 * IDs of the Great Olm from the Chambers of Xeric.
 * Separated due to different health, offence, and defence scaling rules.
 */
export const OLM_IDS = [
  ...OLM_HEAD_IDS,
  ...OLM_MELEE_HAND_IDS,
  ...OLM_MAGE_HAND_IDS,
];

/**
 * IDs of Scavenger beasts from the Chambers of Xeric.
 * Separated due to different health scaling rules.
 */
export const SCAVENGER_BEAST_IDS = [
  7548, 7549,
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
  8917, 8918, 8919, 8920,
];

export const NIGHTMARE_IDS = [
  378, 9425, 9426, 9427, 9428, 9429, 9430, 9431, 9432, 9433, 9460, // nightmare
  377, 9423, 9416, 9417, 9418, 9419, 9420, 9421, 9422, 9424, 11153, 11154, 11155, // phosani's
];

/**
 * IDs of the totems in the Nightmare / Phosani's Nightmare fight.
 * They take double damage from magic sources.
 *
 * @see https://oldschool.runescape.wiki/w/Totem_(The_Nightmare)#Uncharged
 */
export const NIGHTMARE_TOTEM_IDS = [
  9434, 9437, 9440, 9443,
  9435, 9438, 9441, 9444,
];

export const NEX_IDS = [
  11278, 11279, 11280, 11281, 11282,
];

/**
 * IDs of monsters that calculate their magical defence using the defence stat.
 * https://twitter.com/JagexAsh/status/1689566945635438592
 * */
export const USES_DEFENCE_LEVEL_FOR_MAGIC_DEFENCE_NPC_IDS = [
  ...ICE_DEMON_IDS,
  ...VERZIK_IDS,
  ...FRAGMENT_OF_SEREN_IDS,
  11709, 11712, // baboon brawler
  9118, // rabbit (prifddinas)
];

/**
 * IDs of Dusk.
 */
const DUSK_IDS = [
  7851, 7854, 7855, 7882, 7883, 7886, // dusk first form
  7887, 7888, 7889, // dusk second form
];

const WARRIORS_GUILD_CYCLOPES = [
  2463, 2465, 2467, // L56
  2464, 2466, 2468, // L76
  2137, 2138, 2139, 2140, 2141, 2142, // L106
];

export const ZULRAH_IDS = [
  2042, 2043, 2044,
];

/**
 * Monsters immune to melee damage.
 */
export const IMMUNE_TO_MELEE_DAMAGE_NPC_IDS = [
  494, // kraken
  ...ABYSSAL_PORTAL_IDS,
  7706, // zuk
  7708, // Jal-MejJak
  12214, 12215, 12219, // leviathan
  7852, 7853, 7884, 7885, // dawn
  ...ZULRAH_IDS,
];

export const IMMUNE_TO_NON_SALAMANDER_MELEE_DAMAGE_NPC_IDS = [
  3169, 3170, 3171, 3172, 3173, 3174, 3175, 3176, 3177, 3178, 3179, 3180, 3181, 3182, 3183, // aviansie
  7037, // reanimated aviansie
];

/**
 * Monsters immune to ranged damage.
 */
export const IMMUNE_TO_RANGED_DAMAGE_NPC_IDS = [
  ...TEKTON_IDS,
  ...DUSK_IDS,
  ...GLOWING_CRYSTAL_IDS,
  ...WARRIORS_GUILD_CYCLOPES,
];

/**
 * Monsters immune to magic damage.
 */
export const IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS = [
  ...DUSK_IDS,
  ...WARRIORS_GUILD_CYCLOPES,
];

export const PARTY_SIZE_REQUIRED_MONSTER_IDS = [
  ...TOMBS_OF_AMASCUT_MONSTER_IDS,
  ...TOB_MONSTER_IDS,
  ...TOB_EM_MONSTER_IDS,
];

export const BA_ATTACKER_MONSTERS = [
  // fighters
  1667,
  5739,
  5740,
  5741,
  5742,
  5743,
  5744,
  5745,
  5746,
  5747,

  // rangers
  1668,
  5757,
  5758,
  5759,
  5760,
  5761,
  5762,
  5763,
  5764,
  5765,
];

export const VARDORVIS_IDS = [12223, 12224, 12228, 12425, 12426, 13656];

export const ACCURACY_PRECISION = 2;
export const DPS_PRECISION = 3;
export const EXPECTED_HIT_PRECISION = 1;

export const AUTOCAST_STANCES: CombatStyleStance[] = ['Autocast', 'Defensive Autocast'];
export const CAST_STANCES: CombatStyleStance[] = [...AUTOCAST_STANCES, 'Manual Cast'];

/**
 * NPCs that will always die in one hit from a player attack
 */
export const ONE_HIT_MONSTERS: number[] = [
  7223, // Giant rat (Scurrius)
  8584, // Flower
  11193, // Flower (A Night at the Theatre)
];

export const ALWAYS_MAX_HIT_MONSTERS = {
  melee: [
    11710, 11713, // baboon thrower
    12814, // frem warband archer
    ...TOA_WARDEN_CORE_EJECTED_IDS,
  ],
  ranged: [
    11711, 11714, // baboon mage
    12815, // frem warband seer
  ],
  magic: [
    11709, 11712, // baboon brawler
    12816, // frem warband berserker
  ],
};

/**
 * NPCs that will always hit the player with their attacks, no matter what gear they are wearing
 */
export const ALWAYS_ACCURATE_MONSTERS: number[] = [
  931, // Thrower Troll
  4135, // Thrower troll (Trollheim)
  7691, // Jal-Nib
  12335, // Wighted Leech
];

export const DEFAULT_ATTACK_SPEED = 4;
export const SECONDS_PER_TICK = 0.6;

export const TTK_DIST_MAX_ITER_ROUNDS = 1000;
export const TTK_DIST_EPSILON = 0.0001;

export const NPC_HARDCODED_MAX_HIT: { [npcId: number]: number } = {
  5947: 10, // Spinolyp (1)
  5961: 10, // Spinolyp (2)
};

export const MONSTER_PHASES_BY_ID: { [k: number]: string[] } = {};
export const TD_IDS = [13599, 13600, 13601, 13602, 13603, 13604, 13605, 13606];
export const TD_PHASES = ['Shielded', 'Shielded (Defenceless)', 'Unshielded'];
TD_IDS.forEach((id) => { MONSTER_PHASES_BY_ID[id] = TD_PHASES; });

export const ARAXXOR_IDS = [13668];
export const ARAXXOR_PHASES = ['Standard', 'Enraged'];
ARAXXOR_IDS.forEach((id) => { MONSTER_PHASES_BY_ID[id] = ARAXXOR_PHASES; });

export const HUEYCOATL_HEAD_IDS = [14009, 14010, 14013];
export const HUEYCOATL_BODY_IDS = [14017];
export const HUEYCOATL_TAIL_IDS = [14014];
export const HUEYCOATL_IDS = [
  ...HUEYCOATL_HEAD_IDS,
  ...HUEYCOATL_BODY_IDS,
  ...HUEYCOATL_TAIL_IDS,
];
export const HUEYCOATL_PHASES = ['Without Pillar', 'With Pillar'];
export const HUEYCOATL_PHASE_IDS = [...HUEYCOATL_HEAD_IDS, ...HUEYCOATL_TAIL_IDS]; // body can't receive pillar buff
HUEYCOATL_PHASE_IDS.forEach((id) => { MONSTER_PHASES_BY_ID[id] = HUEYCOATL_PHASES; });
