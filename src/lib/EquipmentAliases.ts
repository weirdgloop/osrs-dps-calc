/**
 * A map of base item ID -> variant item IDs for items that are identical in function. This includes
 * "locked" variants of items, broken/degraded variants of armour and weapons, and cosmetic recolours of equipment.
 * @see https://oldschool.runescape.wiki/w/Trouver_parchment
 */
const equipmentAliases = {
  12006: [26484], // Abyssal tentacle
  4151: [26482, 12774, 12773], // Abyssal whip
  8849: [24141], // Adamant defender#Normal
  1161: [2613, 2605, 10296, 10298, 10300, 10302, 10304], // Adamant full helm
  1199: [22127, 22129, 22131, 22133, 22135, 22137, 22139, 22141, 22143, 22145, 22147, 22149, 22151, 22153, 22155, 22157, 2611, 2603, 7334, 7340, 7346, 7352, 7358], // Adamant kiteshield
  1123: [2607, 23392, 23395, 23398, 23401, 23404, 2599], // Adamant platebody
  1073: [2609, 2601], // Adamant platelegs
  1091: [3475, 3474], // Adamant plateskirt
  4708: [4860, 4856, 4859, 4858, 4857, 30543, 30519, 30537, 30531, 30525, 30445], // Ahrim's hood#Undamaged
  4714: [4878, 4874, 4877, 4876, 4875, 30547, 30523, 30541, 30535, 30529, 30449], // Ahrim's robeskirt#Undamaged
  4712: [4872, 4868, 4871, 4870, 4869, 30545, 30521, 30539, 30533, 30527, 30447], // Ahrim's robetop#Undamaged
  4710: [4866, 4862, 4865, 4864, 4863, 30574, 30570, 30573, 30572, 30571, 30568], // Ahrim's staff#Undamaged
  1729: [23309], // Amulet of defence
  6585: [12436], // Amulet of fury
  1704: [19707, 1706, 1708, 1710, 1712, 11976, 11978, 10360, 10358, 10356, 10354, 11966, 11964, 10362], // Amulet of glory#Uncharged
  1727: [10366], // Amulet of magic
  1731: [23354], // Amulet of power
  29801: [29804], // Amulet of rancour
  19553: [20366], // Amulet of torture
  21018: [24664], // Ancestral hat
  21024: [24668], // Ancestral robe bottom
  21021: [24666], // Ancestral robe top
  24201: [24203], // Ancient halo#Normal
  27624: [27626], // Ancient sceptre#Normal
  11771: [26768, 25260], // Archers ring (i)#Nightmare Zone
  11830: [26716], // Armadyl chainskirt
  11802: [29605, 20368], // Armadyl godsword
  24192: [24194], // Armadyl halo#Normal
  11826: [26714], // Armadyl helmet
  21898: [24135], // Assembler max cape#Normal
  22109: [24222, 27359, 27376, 27374], // Ava's assembler#Normal
  22322: [24186], // Avernic defender#Normal
  11836: [26720], // Bandos boots
  11804: [20370], // Bandos godsword
  24195: [24197], // Bandos halo#Normal
  11834: [26719], // Bandos tassets
  25641: [25643], // Barronite mace#Normal
  11128: [23240], // Berserker necklace
  11773: [26770, 25264], // Berserker ring (i)#Nightmare Zone
  2503: [12381, 12385], // Black d'hide body
  2497: [12383, 12387], // Black d'hide chaps
  8847: [24139], // Black defender#Normal
  1165: [2595, 2587, 10306, 10308, 10310, 10312, 10314], // Black full helm
  1195: [2597, 2589, 7332, 7338, 7344, 7350, 7356], // Black kiteshield
  1125: [2591, 23366, 23369, 23372, 23375, 23378, 2583], // Black platebody
  1077: [2593, 2585], // Black platelegs
  1089: [3473, 3472], // Black plateskirt
  1015: [12445, 12447], // Black skirt
  24551: [25882, 25876, 25878, 25872, 25870, 25880, 25874], // Blade of saeldor (c)
  28955: [28957], // Blessed dizana's quiver#Normal
  28260: [28473], // Blood ancient sceptre#Normal
  29022: [29022, 29043], // Blood moon chestplate#New
  29028: [29028, 29047], // Blood moon helm#New
  29025: [29025, 29045], // Blood moon tassets#New
  2499: [7374, 7376], // Blue d'hide body
  2493: [7382, 7384], // Blue d'hide chaps
  29013: [29013, 29037], // Blue moon chestplate#New
  29019: [29019, 29041], // Blue moon helm#New
  29016: [29016, 29039], // Blue moon tassets#New
  1011: [7386, 7388], // Blue skirt
  579: [7394, 7396], // Blue wizard hat
  577: [7390, 7392], // Blue wizard robe
  3844: [26488], // Book of balance
  12612: [26490], // Book of darkness
  12610: [26492], // Book of law
  12608: [26494], // Book of war
  25867: [25896, 25890, 25892, 25886, 25884, 25894, 25888], // Bow of faerdhinen (c)
  24204: [24206], // Brassica halo#Normal
  8844: [24136], // Bronze defender#Normal
  1155: [12211, 12221], // Bronze full helm
  1189: [12213, 12223], // Bronze kiteshield
  1117: [12205, 12215], // Bronze platebody
  1075: [12207, 12217], // Bronze platelegs
  1087: [12209, 12219], // Bronze plateskirt
  19991: [20059], // Bucket helm
  26755: [26756], // Calamity breeches#Normal
  26749: [26750], // Calamity chest#Normal
  26721: [26722], // Centurion cuirass#Normal
  3105: [23413], // Climbing boots
  22711: [30593], // Collection log
  23975: [27769, 27745, 27757, 27697, 27721, 27709, 27733], // Crystal body#Active
  23977: [27771, 27747, 27759, 27699, 27723, 27711, 27735], // Crystal body#Inactive
  23971: [27777, 27753, 27765, 27705, 27729, 27717, 27741], // Crystal helm#Active
  23973: [27779, 27755, 27767, 27707, 27731, 27719, 27743], // Crystal helm#Inactive
  23979: [27773, 27749, 27761, 27701, 27725, 27713, 27737], // Crystal legs#Active
  23981: [27775, 27751, 27763, 27703, 27727, 27715, 27739], // Crystal legs#Inactive
  24288: [27123], // Dagon'hai hat
  24294: [27127], // Dagon'hai robe bottom
  24291: [27125], // Dagon'hai robe top
  11235: [12766, 12765, 12768, 12767, 29611], // Dark bow#Regular
  4509: [24158], // Decorative armour (gold platebody)#Normal
  4510: [24159], // Decorative armour (gold platelegs)#Normal
  11895: [24162], // Decorative armour (gold plateskirt)#Normal
  11898: [24165], // Decorative armour (magic hat)#Normal
  11897: [24164], // Decorative armour (magic legs)#Normal
  11896: [24163], // Decorative armour (magic top)#Normal
  11901: [24168], // Decorative armour (quiver)#Normal
  11900: [24167], // Decorative armour (ranged legs)#Normal
  11899: [24166], // Decorative armour (ranged top)#Normal
  25171: [25173], // Decorative boots (gold)#Normal
  25174: [25176], // Decorative full helm (gold)#Normal
  4511: [24160], // Decorative helm (gold)#Normal
  4512: [24161], // Decorative shield (gold)#Normal
  4508: [24157], // Decorative sword (gold)#Normal
  4718: [4890, 4886, 4889, 4888, 4887], // Dharok's greataxe#Undamaged
  4716: [4884, 4880, 4883, 4882, 4881], // Dharok's helm#Undamaged
  4720: [4896, 4892, 4895, 4894, 4893], // Dharok's platebody#Undamaged
  4722: [4902, 4898, 4901, 4900, 4899], // Dharok's platelegs#Undamaged
  21015: [28682], // Dinh's bulwark
  28902: [28906], // Dizana's max cape#Normal
  7158: [28051], // Dragon 2h sword
  6739: [25378, 30352], // Dragon axe
  1377: [28037], // Dragon battleaxe
  11840: [28055, 22234], // Dragon boots
  3140: [28065, 12414], // Dragon chainbody
  13652: [28039, 26708], // Dragon claws
  21902: [28053], // Dragon crossbow
  1231: [28021], // Dragon dagger#Poison
  5680: [28023], // Dragon dagger#Poison+
  5698: [28025], // Dragon dagger#Poison++
  1215: [28019], // Dragon dagger#Unpoisoned
  12954: [24143, 27008, 19722], // Dragon defender#Normal
  11335: [12417], // Dragon full helm
  3204: [28049], // Dragon halberd
  21028: [25373, 30349], // Dragon harpoon
  21012: [25918, 25916], // Dragon hunter crossbow
  21895: [22244], // Dragon kiteshield
  1305: [28033], // Dragon longsword
  1434: [28027], // Dragon mace
  1149: [28057], // Dragon med helm
  11920: [23677, 12797], // Dragon pickaxe
  23677: [25376, 30351], // Dragon pickaxe (or)
  21892: [22242], // Dragon platebody
  4087: [28061, 12415], // Dragon platelegs
  4585: [28063, 12416], // Dragon plateskirt
  4587: [28031, 20000], // Dragon scimitar
  1263: [28043], // Dragon spear#Poison
  5716: [28045], // Dragon spear#Poison+
  5730: [28047], // Dragon spear#Poison++
  1249: [28041], // Dragon spear#Unpoisoned
  1187: [28059, 12418], // Dragon sq shield
  21009: [28029], // Dragon sword
  13576: [28035, 26710], // Dragon warhammer
  29004: [29004, 29031], // Eclipse moon chestplate#New
  29010: [29010, 29035], // Eclipse moon helm#New
  29007: [29007, 29033], // Eclipse moon tassets#New
  20595: [27119], // Elder chaos hood
  20520: [27117], // Elder chaos robe
  20517: [27115], // Elder chaos top
  21003: [27100], // Elder maul
  27251: [27253], // Elidinis' ward (f)
  26759: [26760], // Elite calamity breeches#Normal
  26753: [26754], // Elite calamity chest#Normal
  13073: [24180, 27004, 26471], // Elite void robe#Normal
  13072: [24178, 27003, 26469], // Elite void top#Normal
  10548: [24173], // Fighter hat#Normal
  10551: [24175, 28069, 28067], // Fighter torso#Normal
  6570: [24223], // Fire cape#Normal
  13329: [24134], // Fire max cape#Normal
  27550: [27551], // Ghommal's avernic defender 5#Normal
  27552: [27553], // Ghommal's avernic defender 6#Normal
  22324: [25734], // Ghrazi rapier
  4153: [12848], // Granite maul#Normal
  21752: [26685, 25193], // Granite ring (i)#Nightmare Zone
  1135: [7370, 7372], // Green d'hide body
  1099: [7378, 7380], // Green d'hide chaps
  4730: [4926, 4922, 4925, 4924, 4923], // Guthan's chainskirt#Undamaged
  4724: [4908, 4904, 4907, 4906, 4905], // Guthan's helm#Undamaged
  4728: [4920, 4916, 4919, 4918, 4917], // Guthan's platebody#Undamaged
  4726: [4914, 4910, 4913, 4912, 4911], // Guthan's warspear#Undamaged
  12639: [24171], // Guthix halo#Normal
  10547: [24172], // Healer hat#Normal
  19481: [26712], // Heavy ballista
  10828: [28070], // Helm of neitiznot
  3840: [26496], // Holy book
  28262: [28474], // Ice ancient sceptre#Normal
  21793: [24249], // Imbued guthix cape#Normal
  21784: [24234], // Imbued guthix max cape#Normal
  21791: [24248], // Imbued saradomin cape#Normal
  21776: [24232], // Imbued saradomin max cape#Normal
  21795: [24250], // Imbued zamorak cape#Normal
  21780: [24233], // Imbued zamorak max cape#Normal
  21295: [24224], // Infernal cape#Normal
  21285: [24133], // Infernal max cape#Normal
  6924: [12459, 12421], // Infinity bottoms
  6918: [12457, 12419], // Infinity hat
  6916: [12458, 12420], // Infinity top
  8845: [24137], // Iron defender#Normal
  1153: [12241, 12231], // Iron full helm
  1191: [12243, 12233], // Iron kiteshield
  1115: [12235, 12225], // Iron platebody
  1067: [12237, 12227], // Iron platelegs
  1081: [12239, 12229], // Iron plateskirt
  4732: [4932, 4928, 4931, 4930, 4929], // Karil's coif#Undamaged
  4734: [4938, 4934, 4937, 4936, 4935], // Karil's crossbow#Undamaged
  4738: [4950, 4946, 4949, 4948, 4947], // Karil's leatherskirt#Undamaged
  4736: [4944, 4940, 4943, 4942, 4941], // Karil's leathertop#Undamaged
  26741: [26742], // Koriff's coif#Normal
  26739: [26740], // Koriff's cowl#Normal
  26737: [26738], // Koriff's headband#Normal
  3053: [21198], // Lava battlestaff
  1129: [23381], // Leather body
  1095: [23384], // Leather chaps
  11924: [12806], // Malediction ward
  26745: [26746], // Maoma's full helm#Normal
  26747: [26748], // Maoma's great helm#Normal
  26743: [26744], // Maoma's med helm#Normal
  27363: [27365], // Masori assembler max cape#Normal
  8848: [24140], // Mithril defender#Normal
  1159: [12283, 12293], // Mithril full helm
  1197: [12281, 12291], // Mithril kiteshield
  1121: [12277, 12287], // Mithril platebody
  1071: [12279, 12289], // Mithril platelegs
  1085: [12285, 12295], // Mithril plateskirt
  542: [20202, 23306], // Monk's robe
  544: [20199, 23303], // Monk's robe top
  4097: [4107, 23059, 4117, 26539], // Mystic boots
  4095: [4105, 23056, 4115, 26537], // Mystic gloves
  4089: [4099, 23047, 4109, 26531], // Mystic hat
  3054: [21200], // Mystic lava staff
  4093: [4103, 23053, 4113, 26535], // Mystic robe bottom
  4091: [4101, 23050, 4111, 26533], // Mystic robe top
  11789: [12796], // Mystic steam staff
  19547: [22249], // Necklace of anguish
  30753: [30779], // Oathplate chest
  30750: [30777], // Oathplate helm
  30756: [30781], // Oathplate legs
  6568: [20050], // Obsidian cape
  12002: [19720], // Occult necklace
  11926: [12807], // Odium ward
  26219: [27246], // Osmumten's fang
  10555: [24176], // Penance skirt#Normal
  10550: [24174], // Ranger hat#Normal
  2501: [12327, 12331], // Red d'hide body
  2495: [12329, 12333], // Red d'hide chaps
  13202: [26764, 25252], // Ring of the gods (i)#Nightmare Zone
  9185: [26486], // Rune crossbow
  8850: [24142, 27009, 23230], // Rune defender#Normal
  1163: [2619, 2627, 10286, 10288, 10290, 10292, 10294], // Rune full helm
  1201: [8714, 8716, 8718, 8720, 8722, 8724, 8726, 8728, 8730, 8732, 8734, 8736, 8738, 8740, 8742, 8744, 2621, 2629, 7336, 7342, 7348, 7354, 7360], // Rune kiteshield
  1127: [2615, 23209, 23212, 23215, 23218, 23221, 2623], // Rune platebody
  1079: [2617, 2625], // Rune platelegs
  1093: [3476, 3477], // Rune plateskirt
  1333: [23330, 23332, 23334], // Rune scimitar
  10549: [24533], // Runner hat#Normal
  26731: [26732], // Saika's hood#Normal
  26735: [26736], // Saika's shroud#Normal
  26733: [26734], // Saika's veil#Normal
  12018: [26782, 25278], // Salve amulet(ei)#Nightmare Zone
  12017: [26763, 25250], // Salve amulet(i)#Nightmare Zone
  22323: [25731], // Sanguinesti staff#Charged
  22481: [25733], // Sanguinesti staff#Uncharged
  11806: [20372], // Saradomin godsword
  12637: [24169], // Saradomin halo#Normal
  22325: [25736, 25739], // Scythe of vitur#Charged
  22486: [25738, 25741], // Scythe of vitur#Uncharged
  11770: [26767, 25258], // Seers ring (i)#Nightmare Zone
  24198: [24200], // Seren halo#Normal
  28266: [28476], // Shadow ancient sceptre#Normal
  11864: [29816, 19639, 19643, 23073, 21264, 19647, 21888, 24370, 25910, 25898, 25904], // Slayer helmet
  11865: [29822, 29818, 29820, 26675, 19641, 25179, 26676, 19645, 25181, 26680, 23075, 25189, 26678, 21266, 25185, 26677, 19649, 25183, 26674, 25177, 26679, 21890, 25187, 26681, 24444, 25191, 26684, 25912, 25914, 26682, 25900, 25902, 26683, 25906, 25908], // Slayer helmet (i)#Nightmare Zone
  28264: [28475], // Smoke ancient sceptre#Normal
  11787: [12795], // Steam battlestaff
  8846: [24138], // Steel defender#Normal
  1157: [20178, 20193], // Steel full helm
  1193: [8746, 8748, 8750, 8752, 8754, 8756, 8758, 8760, 8762, 8764, 8766, 8768, 8770, 8772, 8774, 8776, 20181, 20196], // Steel kiteshield
  1119: [20169, 20184], // Steel platebody
  1069: [20172, 20187], // Steel platelegs
  1083: [20175, 20190], // Steel plateskirt
  1133: [7362, 7364], // Studded body
  1097: [7366, 7368], // Studded chaps
  26757: [26758], // Superior calamity breeches#Normal
  26751: [26752], // Superior calamity chest#Normal
  4747: [4962, 4958, 4961, 4960, 4959], // Torag's hammers#Undamaged
  4745: [4956, 4952, 4955, 4954, 4953], // Torag's helm#Undamaged
  4749: [4968, 4964, 4967, 4966, 4965], // Torag's platebody#Undamaged
  4751: [4974, 4970, 4973, 4972, 4971], // Torag's platelegs#Undamaged
  19544: [23444], // Tormented bracelet
  26382: [28254], // Torva full helm#Restored
  26384: [28256], // Torva platebody#Restored
  26386: [28258], // Torva platelegs#Restored
  12926: [28688], // Toxic blowpipe#Charged
  12924: [28687], // Toxic blowpipe#Empty
  12692: [26766, 25256], // Treasonous ring (i)#Nightmare Zone
  12691: [26765, 25254], // Tyrannical ring (i)#Nightmare Zone
  6528: [23235], // Tzhaar-ket-om
  3842: [26498], // Unholy book
  27610: [30434], // Venator bow#Charged
  27612: [30436], // Venator bow#Uncharged
  4757: [4992, 4988, 4991, 4990, 4989], // Verac's brassard#Undamaged
  4755: [4986, 4982, 4985, 4984, 4983], // Verac's flail#Undamaged
  4753: [4980, 4976, 4979, 4978, 4977], // Verac's helm#Undamaged
  4759: [4998, 4994, 4997, 4996, 4995], // Verac's plateskirt#Undamaged
  26241: [30437], // Virtus mask
  26245: [30441], // Virtus robe bottom
  26243: [30439], // Virtus robe top
  8842: [24182, 27002, 26467], // Void knight gloves#Normal
  8841: [24181], // Void knight mace#Normal
  8840: [24179, 27001, 26465], // Void knight robe#Normal
  8839: [24177, 27000, 26463], // Void knight top#Normal
  11663: [24183, 27005, 26473], // Void mage helm#Normal
  11665: [24185, 27007, 26477], // Void melee helm#Normal
  11664: [24184, 27006, 26475], // Void ranger helm#Normal
  27690: [29607], // Voidwaker
  24424: [29609], // Volatile nightmare staff
  11772: [26769, 25262], // Warrior ring (i)#Nightmare Zone
  1171: [20166], // Wooden shield
  26723: [26724], // Wristbands of the arena#Normal
  26727: [26728], // Wristbands of the arena (i)#Normal
  11808: [20374], // Zamorak godsword
  12638: [24170], // Zamorak halo#Normal
};

export default equipmentAliases;
