import { EquipmentPiece, EquipmentSlot } from '@/types/Player';
import { findItemById } from '@/lib/Equipment';

export enum EquipmentPreset {
  BOWFA,
  BLOOD_MOON,
  DHAROKS,
  MAX_MAGE,
  MAX_MELEE,
  MAX_RANGED,
  MID_LEVEL_MAGE,
  MID_LEVEL_MELEE,
  MID_LEVEL_RANGED,
  VERACS,
  VOID_MAGE,
  VOID_MELEE,
  VOID_RANGED,
  TANK,
}

export interface EquipmentPresetData {
  loadoutName: string;
  equipment: Partial<Record<EquipmentSlot, EquipmentPiece | null>>,
}

export const EquipmentPresetValues: Record<EquipmentPreset, EquipmentPresetData> = {
  [EquipmentPreset.BOWFA]: {
    loadoutName: 'Bow of faerdinhen',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(23971), // Crystal helm
      [EquipmentSlot.CAPE]: findItemById(28955), // Blessed dizana's quiver
      [EquipmentSlot.NECK]: findItemById(19547), // Necklace of anguish
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.WEAPON]: findItemById(25865), // Bow of faerdhinen
      [EquipmentSlot.BODY]: findItemById(23975), // Crystal body
      [EquipmentSlot.LEGS]: findItemById(23979), // Crystal legs
      [EquipmentSlot.HANDS]: findItemById(26235), // Zaryte vambraces
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28310), // Venator ring
    },
  },
  [EquipmentPreset.BLOOD_MOON]: {
    loadoutName: 'Blood moon set',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(29028), // Blood moon helm
      [EquipmentSlot.BODY]: findItemById(29022), // Blood moon chestplate
      [EquipmentSlot.WEAPON]: findItemById(28997), // Dual macuahuitl
      [EquipmentSlot.SHIELD]: null,
      [EquipmentSlot.LEGS]: findItemById(29025), // Blood moon tassets
    },
  },
  [EquipmentPreset.DHAROKS]: {
    loadoutName: 'Dharok\'s equipment',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(4716), // Dharok's helm
      [EquipmentSlot.CAPE]: findItemById(21295), // Infernal cape
      [EquipmentSlot.NECK]: findItemById(29801), // Amulet of rancour
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.WEAPON]: findItemById(4718), // Dharok's greataxe
      [EquipmentSlot.BODY]: findItemById(4720), // Dharok's platebody
      [EquipmentSlot.SHIELD]: null,
      [EquipmentSlot.LEGS]: findItemById(4722), // Dharok's platelegs
      [EquipmentSlot.HANDS]: findItemById(22981), // Ferocious gloves
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28307), // Ultor ring
    },
  },
  [EquipmentPreset.MAX_MAGE]: {
    loadoutName: 'Max Mage',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(21018), // Ancestral hat
      [EquipmentSlot.CAPE]: findItemById(21791), // Imbued saradomin cape
      [EquipmentSlot.NECK]: findItemById(12002), // Occult necklace
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.BODY]: findItemById(21021), // Ancestral robe top
      [EquipmentSlot.LEGS]: findItemById(21024), // Ancestral robe bottom
      [EquipmentSlot.HANDS]: findItemById(31106), // Confliction gauntlets
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28313), // Magus ring
    },
  },
  [EquipmentPreset.MAX_MELEE]: {
    loadoutName: 'Max Melee',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(26382), // Torva full helm
      [EquipmentSlot.CAPE]: findItemById(21295), // Infernal cape
      [EquipmentSlot.NECK]: findItemById(29801), // Amulet of rancour
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.BODY]: findItemById(26384), // Torva platebody
      [EquipmentSlot.SHIELD]: findItemById(22322), // Avernic defender
      [EquipmentSlot.LEGS]: findItemById(26386), // Torva platelegs
      [EquipmentSlot.HANDS]: findItemById(22981), // Ferocious gloves
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28307), // Ultor ring
    },
  },
  [EquipmentPreset.MAX_RANGED]: {
    loadoutName: 'Max Ranged',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(27235), // Masori mask (f)
      [EquipmentSlot.CAPE]: findItemById(28955), // Blessed dizana's quiver
      [EquipmentSlot.NECK]: findItemById(19547), // Necklace of anguish
      [EquipmentSlot.AMMO]: findItemById(11212), // Dragon arrow
      [EquipmentSlot.BODY]: findItemById(27238), // Masori body (f)
      [EquipmentSlot.LEGS]: findItemById(27241), // Masori chaps (f)
      [EquipmentSlot.HANDS]: findItemById(26235), // Zaryte vambraces
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28310), // Venator ring
    },
  },
  [EquipmentPreset.MID_LEVEL_MAGE]: {
    loadoutName: 'Mid Level Mage',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(4708), // Ahrim's hood#Undamaged
      [EquipmentSlot.CAPE]: findItemById(21791), // Imbued saradomin cape
      [EquipmentSlot.NECK]: findItemById(12002), // Occult necklace
      [EquipmentSlot.AMMO]: findItemById(20229), // Honourable blessing
      [EquipmentSlot.BODY]: findItemById(4712), // Ahrim's robetop#Undamaged
      [EquipmentSlot.LEGS]: findItemById(4714), // Ahrim's robeskirt#Undamaged
      [EquipmentSlot.HANDS]: findItemById(7462), // Barrows gloves
      [EquipmentSlot.FEET]: findItemById(6920), // Infinity boots
      [EquipmentSlot.RING]: findItemById(11770), // Seers ring (i)
    },
  },
  [EquipmentPreset.MID_LEVEL_MELEE]: {
    loadoutName: 'Mid Level Melee',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(10828), // Helm of neitiznot
      [EquipmentSlot.CAPE]: findItemById(6570), // Fire cape
      [EquipmentSlot.NECK]: findItemById(6585), // Amulet of fury
      [EquipmentSlot.AMMO]: findItemById(20229), // Honourable blessing
      [EquipmentSlot.BODY]: findItemById(10551), // Fighter torso#Normal
      [EquipmentSlot.SHIELD]: findItemById(12954), // Dragon defender
      [EquipmentSlot.LEGS]: findItemById(21304), // Obsidian platelegs
      [EquipmentSlot.HANDS]: findItemById(7462), // Barrows gloves
      [EquipmentSlot.FEET]: findItemById(11840), // Dragon boots
      [EquipmentSlot.RING]: findItemById(11773), // Berserker ring (i)
    },
  },
  [EquipmentPreset.MID_LEVEL_RANGED]: {
    loadoutName: 'Mid Level Ranged',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(12496), // Ancient coif
      [EquipmentSlot.CAPE]: findItemById(22109), // Ava's assembler
      [EquipmentSlot.NECK]: findItemById(6585), // Amulet of fury
      [EquipmentSlot.AMMO]: findItemById(11212), // Dragon arrow
      [EquipmentSlot.BODY]: findItemById(12492), // Ancient d'hide body
      [EquipmentSlot.LEGS]: findItemById(12494), // Ancient chaps
      [EquipmentSlot.HANDS]: findItemById(7462), // Barrows gloves
      [EquipmentSlot.FEET]: findItemById(19921), // Ancient d'hide boots
      [EquipmentSlot.RING]: findItemById(11771), // Archers ring (i)
    },
  },
  [EquipmentPreset.VERACS]: {
    loadoutName: 'Verac\'s equipment',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(4753), // Verac's helm
      [EquipmentSlot.CAPE]: findItemById(21295), // Infernal cape
      [EquipmentSlot.NECK]: findItemById(29801), // Amulet of rancour
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.WEAPON]: findItemById(4755), // Verac's flail
      [EquipmentSlot.BODY]: findItemById(4757), // Verac's brassard
      [EquipmentSlot.SHIELD]: null,
      [EquipmentSlot.LEGS]: findItemById(4759), // Verac's plateskirt
      [EquipmentSlot.HANDS]: findItemById(22981), // Ferocious gloves
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28307), // Ultor ring
    },
  },
  [EquipmentPreset.VOID_MAGE]: {
    loadoutName: 'Void Mage',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(11663), // Void mage helm
      [EquipmentSlot.CAPE]: findItemById(21791), // Imbued saradomin cape
      [EquipmentSlot.NECK]: findItemById(12002), // Occult necklace
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.BODY]: findItemById(13072), // Elite void top
      [EquipmentSlot.LEGS]: findItemById(13073), // Elite void robe
      [EquipmentSlot.HANDS]: findItemById(8842), // Void knight gloves
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28313), // Magus ring
    },
  },
  [EquipmentPreset.VOID_MELEE]: {
    loadoutName: 'Void Melee',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(11665), // Void melee helm
      [EquipmentSlot.CAPE]: findItemById(21295), // Infernal cape
      [EquipmentSlot.NECK]: findItemById(29801), // Amulet of rancour
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.BODY]: findItemById(13072), // Elite void top
      [EquipmentSlot.SHIELD]: findItemById(22322), // Avernic defender
      [EquipmentSlot.LEGS]: findItemById(13073), // Elite void robe
      [EquipmentSlot.HANDS]: findItemById(8842), // Void knight gloves
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28307), // Ultor ring
    },
  },
  [EquipmentPreset.VOID_RANGED]: {
    loadoutName: 'Void Ranged',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(11664), // Void ranger helm
      [EquipmentSlot.CAPE]: findItemById(28955), // Blessed dizana's quiver
      [EquipmentSlot.NECK]: findItemById(19547), // Necklace of anguish
      [EquipmentSlot.AMMO]: findItemById(11212), // Dragon arrow
      [EquipmentSlot.BODY]: findItemById(13072), // Elite void top
      [EquipmentSlot.LEGS]: findItemById(13073), // Elite void robe
      [EquipmentSlot.HANDS]: findItemById(8842), // Void knight gloves
      [EquipmentSlot.FEET]: findItemById(31097), // Avernic treads (max)
      [EquipmentSlot.RING]: findItemById(28310), // Venator ring
    },
  },
  [EquipmentPreset.TANK]: {
    loadoutName: 'Tank',
    equipment: {
      [EquipmentSlot.HEAD]: findItemById(22326), // Justiciar faceguard
      [EquipmentSlot.CAPE]: findItemById(21295), // Infernal cape
      [EquipmentSlot.NECK]: findItemById(6585), // Amulet of fury
      [EquipmentSlot.AMMO]: findItemById(22947), // Rada's blessing 4
      [EquipmentSlot.WEAPON]: findItemById(21015), // Dinh's bulwark
      [EquipmentSlot.BODY]: findItemById(22327), // Justiciar chestguard
      [EquipmentSlot.SHIELD]: null,
      [EquipmentSlot.LEGS]: findItemById(22328), // Justiciar legguards
      [EquipmentSlot.HANDS]: findItemById(7462), // Barrows gloves
      [EquipmentSlot.FEET]: findItemById(21733), // Guardian boots
      [EquipmentSlot.RING]: findItemById(19710), // Ring of suffering (i)
    },
  },
};
