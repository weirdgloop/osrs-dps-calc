/**
 * A map of base NPC ID -> variant NPC IDs for NPCs that are identical in function.
 */

const monsterAliases = {
  14113: [14114, 14115, 14116, 14117], // Armoured zombie (Zemouregal's Fort)
  14118: [14119, 14120, 14121, 14122], // Armoured zombie (Zemouregal's Fort)
  241: [242, 243], // Baby blue dragon
  14105: [14106], // Baby blue dragon
  5194: [5872, 5873], // Baby green dragon
  244: [245, 246], // Baby red dragon
  265: [266, 267, 268, 269, 5878, 5879, 5880, 5881, 5882], // Blue dragon
  14103: [14104], // Blue dragon
  5330: [5331, 5332, 5333, 5336, 5337, 5338, 5339], // Cave goblin miner
  12918: [12919, 12920, 12921, 12922, 12923], // Cultist
  13763: [13732, 13732, 13732, 13732], // Emissary Acolyte
  13706: [13707, 13708, 13709, 13710, 13711, 13712, 13713], // Emissary Ascended
  13738: [13739, 13740, 13741, 13742, 13743], // Emissary Chosen
  13777: [13778], // Emissary Conjurer
  11919: [3243, 3244, 11920, 11921, 11918, 3114], // Farmer
  437: [441, 11245, 442, 438, 11242, 440, 11244, 11241, 439, 11243], // Jelly
  1045: [1044, 1046, 1042, 1043], // Jungle horror
  960: [962, 959], // Kalphite Guardian
  13114: [13115, 13116, 13117, 13118, 13119], // Knight of Varlamore
  3293: [11930, 11931, 11932, 11933], // Paladin
  1669: [5749, 5750, 5751, 5752, 5753, 5754, 5755, 5756], // Penance Runner
  247: [248, 249, 250, 251], // Red dragon
  1685: [1688, 1687, 1686], // Skeleton (Barrows)
  10717: [10718, 10719, 10720, 10721], // Skeleton (Forthos Ruin)
  13476: [13477, 13478, 13479], // Skeleton (Lucien's camp)
  3972: [3973, 3974], // Skeleton (Melzar's Maze)
  2521: [2522, 2523, 2520, 2524, 2525, 2526], // Skeleton (Stronghold of Security)
  13495: [13496, 13497, 13498, 13499, 13500, 13501], // Skeleton (Wilderness Agility Course)
  13599: [13600, 13601], // Tormented Demon
  2603: [2593, 2598, 2605, 2600, 2594, 2602, 2596, 2607, 2599, 2612, 2604, 2609, 2597, 2606, 2601, 2610, 2608, 2595, 2611], // Werewolf
  3111: [3112, 3113, 11053, 3015], // Woman
  64: [65, 66, 67, 68], // Zombie (Entrana Dungeon)
  613: [614, 615, 616, 617, 618], // Zombie pirate (Braindeath Island)
  563: [575, 576, 577, 578, 579, 580, 581, 582, 584, 586, 565, 588, 590, 592, 593, 595, 597, 599, 567, 568, 569, 571, 572, 573, 574], // Zombie pirate (Harmony Island)
  619: [620, 621, 622, 623, 624], // Zombie swab
};
export default monsterAliases;
