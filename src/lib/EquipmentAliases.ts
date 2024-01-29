/**
 * A map of base item ID -> variant item IDs for items that are identical in function. This includes
 * "locked" variants of items, broken/degraded variants of armour and weapons, and cosmetic recolours of equipment.
 * @see https://oldschool.runescape.wiki/w/Trouver_parchment
 */
const equipmentAliases = {
  8849: [24141], // Adamant defender
  1161: [2613, 2605], // Adamant full helm
  1199: [2611, 2603], // Adamant kiteshield
  1123: [2607, 23392, 23395, 23398, 23401, 23404, 2599], // Adamant platebody
  1073: [2609, 2601], // Adamant platelegs
  1091: [3475, 3474], // Adamant plateskirt
  4708: [4860, 4856, 4859, 4858, 4857], // Ahrim's hood
  4714: [4878, 4874, 4877, 4876, 4875], // Ahrim's robeskirt
  4712: [4872, 4868, 4871, 4870, 4869], // Ahrim's robetop
  4710: [4866, 4862, 4865, 4864, 4863], // Ahrim's staff
  1729: [23309], // Amulet of defence
  1727: [10366], // Amulet of magic
  1731: [23354], // Amulet of power
  24201: [24203], // Ancient halo
  27624: [27626], // Ancient sceptre
  11771: [26768, 25260], // Archers ring (i)
  24192: [24194], // Armadyl halo
  21898: [24135], // Assembler max cape
  22109: [24222], // Ava's assembler
  22322: [24186], // Avernic defender
  24195: [24197], // Bandos halo
  25641: [25643], // Barronite mace
  11773: [26770, 25264], // Berserker ring (i)
  2503: [12381, 12385], // Black d'hide body
  2497: [12383, 12387], // Black d'hide chaps
  8847: [24139], // Black defender
  1165: [2595, 2587], // Black full helm
  1195: [2597, 2589], // Black kiteshield
  1125: [2591, 23366, 23369, 23372, 23375, 23378, 2583], // Black platebody
  1077: [2593, 2585], // Black platelegs
  1089: [3473, 3472], // Black plateskirt
  1015: [12445, 12447], // Black skirt
  11864: [19639, 19643, 23073, 21264, 19647, 21888, 24370, 25910, 25898, 25904], // Slayer helmet
  28260: [28473], // Blood ancient sceptre
  2499: [7374, 7376], // Blue d'hide body
  2493: [7382, 7384], // Blue d'hide chaps
  1011: [7386, 7388], // Blue skirt
  579: [7394, 7396], // Blue wizard hat
  577: [7390, 7392], // Blue wizard robe
  24204: [24206], // Brassica halo
  8844: [24136], // Bronze defender
  1155: [12211, 12221], // Bronze full helm
  1189: [12213, 12223], // Bronze kiteshield
  1117: [12205, 12215], // Bronze platebody
  1075: [12207, 12217], // Bronze platelegs
  1087: [12209, 12219], // Bronze plateskirt
  19991: [20059], // Bucket helm
  26755: [26756], // Calamity breeches
  26749: [26750], // Calamity chest
  26721: [26722], // Centurion cuirass
  3105: [23413], // Climbing boots
  4509: [24158], // Decorative armour (gold platebody)
  4510: [24159], // Decorative armour (gold platelegs)
  11895: [24162], // Decorative armour (gold plateskirt)
  11898: [24165], // Decorative armour (magic hat)
  11897: [24164], // Decorative armour (magic legs)
  11896: [24163], // Decorative armour (magic top)
  11901: [24168], // Decorative armour (quiver)
  11900: [24167], // Decorative armour (ranged legs)
  11899: [24166], // Decorative armour (ranged top)
  25171: [25173], // Decorative boots (gold)
  25174: [25176], // Decorative full helm (gold)
  4511: [24160], // Decorative helm (gold)
  4512: [24161], // Decorative shield (gold)
  4508: [24157], // Decorative sword (gold)
  4718: [4890, 4886, 4889, 4888, 4887], // Dharok's greataxe
  4716: [4884, 4880, 4883, 4882, 4881], // Dharok's helm
  4720: [4896, 4892, 4895, 4894, 4893], // Dharok's platebody
  4722: [4902, 4898, 4901, 4900, 4899], // Dharok's platelegs
  11840: [22234], // Dragon boots
  3140: [12414], // Dragon chainbody
  12954: [24143, 27008, 19722], // Dragon defender
  11335: [12417], // Dragon full helm
  21012: [25916], // Dragon hunter crossbow
  21895: [22244], // Dragon kiteshield
  21892: [22242], // Dragon platebody
  4087: [12415], // Dragon platelegs
  4585: [12416], // Dragon plateskirt
  1187: [12418], // Dragon sq shield
  26759: [26760], // Elite calamity breeches
  26753: [26754], // Elite calamity chest
  13073: [24180], // Elite void robe
  26471: [27004], // Elite void robe (or)
  13072: [24178], // Elite void top
  26469: [27003], // Elite void top (or)
  10548: [24173], // Fighter hat
  10551: [24175], // Fighter torso
  28067: [28069], // Fighter torso (or)
  6570: [24223], // Fire cape
  13329: [24134], // Fire max cape
  27550: [27551], // Ghommal's avernic defender 5
  27552: [27553], // Ghommal's avernic defender 6
  21752: [26685, 25193], // Granite ring (i)
  1135: [7370, 7372], // Green d'hide body
  1099: [7378, 7380], // Green d'hide chaps
  4730: [4926, 4922, 4925, 4924, 4923], // Guthan's chainskirt
  4724: [4908, 4904, 4907, 4906, 4905], // Guthan's helm
  4728: [4920, 4916, 4919, 4918, 4917], // Guthan's platebody
  4726: [4914, 4910, 4913, 4912, 4911], // Guthan's warspear
  12639: [24171], // Guthix halo
  10547: [24172], // Healer hat
  28262: [28474], // Ice ancient sceptre
  21793: [24249], // Imbued guthix cape
  21784: [24234], // Imbued guthix max cape
  21791: [24248], // Imbued saradomin cape
  21776: [24232], // Imbued saradomin max cape
  21795: [24250], // Imbued zamorak cape
  21780: [24233], // Imbued zamorak max cape
  21295: [24224], // Infernal cape
  21285: [24133], // Infernal max cape
  8845: [24137], // Iron defender
  1153: [12241, 12231], // Iron full helm
  1191: [12243, 12233], // Iron kiteshield
  1115: [12235, 12225], // Iron platebody
  1067: [12237, 12227], // Iron platelegs
  1081: [12239, 12229], // Iron plateskirt
  4732: [4932, 4928, 4931, 4930, 4929], // Karil's coif
  4734: [4938, 4934, 4937, 4936, 4935], // Karil's crossbow
  4738: [4950, 4946, 4949, 4948, 4947], // Karil's leatherskirt
  4736: [4944, 4940, 4943, 4942, 4941], // Karil's leathertop
  26741: [26742], // Koriff's coif
  26739: [26740], // Koriff's cowl
  26737: [26738], // Koriff's headband
  1129: [23381], // Leather body
  1095: [23384], // Leather chaps
  26745: [26746], // Maoma's full helm
  26747: [26748], // Maoma's great helm
  26743: [26744], // Maoma's med helm
  27374: [27376], // Masori assembler
  27363: [27365], // Masori assembler max cape
  8848: [24140], // Mithril defender
  1159: [12283, 12293], // Mithril full helm
  1197: [12281, 12291], // Mithril kiteshield
  1121: [12277, 12287], // Mithril platebody
  1071: [12279, 12289], // Mithril platelegs
  1085: [12285, 12295], // Mithril plateskirt
  542: [20202, 23306], // Monk's robe
  544: [20199, 23303], // Monk's robe top
  10555: [24176], // Penance skirt
  10550: [24174], // Ranger hat
  2501: [12327, 12331], // Red d'hide body
  2495: [12329, 12333], // Red d'hide chaps
  13202: [26764, 25252], // Ring of the gods (i)
  8850: [24142, 27009, 23230], // Rune defender
  1163: [2619, 2627], // Rune full helm
  1201: [2621, 2629], // Rune kiteshield
  1127: [2615, 23209, 23212, 23215, 23218, 23221, 2623], // Rune platebody
  1079: [2617, 2625], // Rune platelegs
  1093: [3476, 3477], // Rune plateskirt
  10549: [24533], // Runner hat
  26731: [26732], // Saika's hood
  26735: [26736], // Saika's shroud
  26733: [26734], // Saika's veil
  12018: [26782, 25278], // Salve amulet(ei)
  12017: [26763, 25250], // Salve amulet(i)
  12637: [24169], // Saradomin halo
  11770: [26767, 25258], // Seers ring (i)
  24198: [24200], // Seren halo
  28266: [28476], // Shadow ancient sceptre
  11865: [26674, 25177], // Slayer helmet (i)
  28264: [28475], // Smoke ancient sceptre
  8846: [24138], // Steel defender
  1157: [20178, 20193], // Steel full helm
  1193: [20181, 20196], // Steel kiteshield
  1119: [20169, 20184], // Steel platebody
  1069: [20172, 20187], // Steel platelegs
  1083: [20175, 20190], // Steel plateskirt
  1133: [7362, 7364], // Studded body
  1097: [7366, 7368], // Studded chaps
  26757: [26758], // Superior calamity breeches
  26751: [26752], // Superior calamity chest
  4747: [4962, 4958, 4961, 4960, 4959], // Torag's hammers
  4745: [4956, 4952, 4955, 4954, 4953], // Torag's helm
  4749: [4968, 4964, 4967, 4966, 4965], // Torag's platebody
  4751: [4974, 4970, 4973, 4972, 4971], // Torag's platelegs
  12692: [26766, 25256], // Treasonous ring (i)
  12691: [26765, 25254], // Tyrannical ring (i)
  6528: [23235], // Tzhaar-ket-om
  4757: [4992, 4988, 4991, 4990, 4989], // Verac's brassard
  4755: [4986, 4982, 4985, 4984, 4983], // Verac's flail
  4753: [4980, 4976, 4979, 4978, 4977], // Verac's helm
  4759: [4998, 4994, 4997, 4996, 4995], // Verac's plateskirt
  8842: [24182], // Void knight gloves
  26467: [27002], // Void knight gloves (or)
  8841: [24181], // Void knight mace
  8840: [24179], // Void knight robe
  26465: [27001], // Void knight robe (or)
  8839: [24177], // Void knight top
  26463: [27000], // Void knight top (or)
  11663: [24183], // Void mage helm
  26473: [27005], // Void mage helm (or)
  11665: [24185], // Void melee helm
  26477: [27007], // Void melee helm (or)
  11664: [24184], // Void ranger helm
  26475: [27006], // Void ranger helm (or)
  11772: [26769, 25262], // Warrior ring (i)
  1171: [20166], // Wooden shield
  26723: [26724], // Wristbands of the arena
  26727: [26728], // Wristbands of the arena (i)
  12638: [24170], // Zamorak halo
};

export default equipmentAliases;
