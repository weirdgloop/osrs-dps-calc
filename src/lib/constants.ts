import { CombatStyleStance } from '@/types/PlayerCombatStyle';
import { range, sum } from 'd3-array';

export const AKKHA_IDS = [
  11789, 11790, 11791, 11792, 11793, 11794, 11795, 11796,
];

export const AKKHA_SHADOW_IDS = [
  11797, 11798, 11799,
];

export const BABA_IDS = [
  11778, 11779, 11780,
];

export const STANDARD_BABOON_SMALL_IDS = [
  11709, 11710, 11711,
];

export const STANDARD_BABOON_LARGE_IDS = [
  11712, 11713, 11714,
];

export const BABOON_SHAMAN_IDS = [
  11715,
];

export const VOLATILE_BABOON_IDS = [
  11716,
];

export const CURSED_BABOON_IDS = [
  11717,
];

export const BABOON_THRALL_IDS = [
  11718,
];

export const APMEKEN_BABOON_IDS = [
  ...STANDARD_BABOON_SMALL_IDS,
  ...STANDARD_BABOON_LARGE_IDS,
  ...BABOON_SHAMAN_IDS,
  ...VOLATILE_BABOON_IDS,
  ...CURSED_BABOON_IDS,
  ...BABOON_THRALL_IDS,
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
  11753, 11754, 11755, // elidinis
  11756, 11757, 11758, // tumeken
];

export const P3_WARDEN_IDS = [
  11761, 11763, // elidinis
  11762, 11764, // tumeken
];

export const TOA_CORE_IDS = [
  11770, 11771,
];

/**
 * IDs of monsters that are present in Tombs of Amascut and are affected by path level.
 */
export const TOMBS_OF_AMASCUT_PATH_MONSTER_IDS = [
  ...AKKHA_IDS,
  ...AKKHA_SHADOW_IDS,
  ...BABA_IDS,
  ...APMEKEN_BABOON_IDS,
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
  ...TOA_CORE_IDS,
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

/** IDs of monsters that are present in Theatre of Blood * */
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
  ...OLM_MAGE_HAND_IDS,
  ...OLM_HEAD_IDS,
  2042, 2043, 2044, // zulrah
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
];

/**
 * Monsters immune to magic damage.
 */
export const IMMUNE_TO_MAGIC_DAMAGE_NPC_IDS = [
  ...DUSK_IDS,
];

export const PARTY_SIZE_REQUIRED_MONSTER_IDS = [
  ...TOMBS_OF_AMASCUT_MONSTER_IDS,
  ...TOB_MONSTER_IDS,
  ...TOB_EM_MONSTER_IDS,
];

export const ACCURACY_PRECISION = 2;
export const DPS_PRECISION = 3;

export const AUTOCAST_STANCES: CombatStyleStance[] = ['Autocast', 'Defensive Autocast'];
export const CAST_STANCES: CombatStyleStance[] = [...AUTOCAST_STANCES, 'Manual Cast'];

export const ONE_HIT_MONSTERS: number[] = [
  7223, // Giant rat (Scurrius)
  8584, // Flower
  11193, // Flower (A Night at the Theatre)
];

export const DEFAULT_ATTACK_SPEED = 4;
export const SECONDS_PER_TICK = 0.6;

export const TTK_DIST_MAX_ITER_ROUNDS = 1000;
export const TTK_DIST_EPSILON = 0.0001;

export const THRALL_MAX = 3;
export const THRALL_SPEED = 4;
export const THRALL_DPT = sum(range(0, THRALL_MAX + 1)) / ((THRALL_MAX + 1) * THRALL_SPEED);
