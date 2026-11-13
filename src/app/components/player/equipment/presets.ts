import EquipmentPreset from '@/enums/EquipmentPreset';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { availableEquipment } from '@/lib/Equipment';
import { PlayerPatch, PlayerStore } from '@/state/PlayerStore';
import { PlayerEquipment } from '@/types/Player';
import { getCombatStylesForCategory } from '@/utils';

const RUBY_DRAGON_BOLTS_E = 21944;

interface PresetDefinition {
  label: string;
  value: EquipmentPreset;
  equipment: Partial<Record<keyof PlayerEquipment, number | null>>;
  ammo?: number;
  crossbowShield?: number;
  style?: () => PlayerPatch['style'];
}

// ids are annotated with the item name; the dropdown shows the presets in this order
export const EQUIPMENT_PRESETS: PresetDefinition[] = [
  {
    label: 'Bowfa + Crystal',
    value: EquipmentPreset.BOWFA,
    equipment: {
      head: 23971, // Crystal helm
      cape: 28955, // Blessed Dizana's quiver
      neck: 33639, // Necklace of rupture
      ammo: 22947, // Rada's blessing 4
      weapon: 25865, // Bow of Faerdhinen
      body: 23975, // Crystal body
      legs: 23979, // Crystal legs
      hands: 26235, // Zaryte vambraces
      feet: 31097, // Avernic treads (max)
      ring: 28310, // Venator ring
    },
  },
  {
    label: 'Blood Moon set',
    value: EquipmentPreset.BLOOD_MOON,
    equipment: {
      head: 29028, // Blood Moon helm
      body: 29022, // Blood Moon chestplate
      weapon: 28997, // Dual macuahuitl
      shield: null,
      legs: 29025, // Blood Moon tassets
    },
  },
  {
    label: 'Dharok\'s equipment',
    value: EquipmentPreset.DHAROKS,
    equipment: {
      head: 4716, // Dharok's helm
      cape: 21295, // Infernal cape
      neck: 29801, // Amulet of rancour
      ammo: 22947, // Rada's blessing 4
      weapon: 4718, // Dharok's greataxe
      body: 4720, // Dharok's platebody
      shield: null,
      legs: 4722, // Dharok's platelegs
      hands: 22981, // Ferocious gloves
      feet: 31097, // Avernic treads (max)
      ring: 28307, // Ultor ring
    },
  },
  {
    label: 'Max Mage',
    value: EquipmentPreset.MAX_MAGE,
    equipment: {
      head: 21018, // Ancestral hat
      cape: 21791, // Imbued saradomin cape
      neck: 12002, // Occult necklace
      ammo: 22947, // Rada's blessing 4
      body: 21021, // Ancestral robe top
      legs: 21024, // Ancestral robe bottom
      hands: 31106, // Confliction gauntlets
      feet: 31097, // Avernic treads (max)
      ring: 28313, // Magus ring
    },
  },
  {
    label: 'Max Melee',
    value: EquipmentPreset.MAX_MELEE,
    equipment: {
      head: 26382, // Torva full helm
      cape: 21295, // Infernal cape
      neck: 29801, // Amulet of rancour
      ammo: 22947, // Rada's blessing 4
      body: 26384, // Torva platebody
      shield: 22322, // Avernic defender
      legs: 26386, // Torva platelegs
      hands: 22981, // Ferocious gloves
      feet: 31097, // Avernic treads (max)
      ring: 28307, // Ultor ring
    },
  },
  {
    label: 'Max Ranged',
    value: EquipmentPreset.MAX_RANGED,
    ammo: 33595, // Seeking dragon arrow
    crossbowShield: 21000, // Twisted buckler
    equipment: {
      head: 27235, // Masori mask (f)
      cape: 28955, // Blessed Dizana's quiver
      neck: 33639, // Necklace of rupture
      body: 27238, // Masori body (f)
      legs: 27241, // Masori chaps (f)
      hands: 26235, // Zaryte vambraces
      feet: 31097, // Avernic treads (max)
      ring: 28310, // Venator ring
    },
  },
  {
    label: 'Mid Level Mage',
    value: EquipmentPreset.MID_LEVEL_MAGE,
    equipment: {
      head: 4708, // Ahrim's hood#Undamaged
      cape: 21791, // Imbued saradomin cape
      neck: 12002, // Occult necklace
      ammo: 20229, // Honourable blessing
      body: 4712, // Ahrim's robetop#Undamaged
      legs: 4714, // Ahrim's robeskirt#Undamaged
      hands: 7462, // Barrows gloves
      feet: 6920, // Infinity boots
      ring: 11770, // Seers ring (i)
    },
  },
  {
    label: 'Mid Level Melee',
    value: EquipmentPreset.MID_LEVEL_MELEE,
    equipment: {
      head: 10828, // Helm of neitiznot
      cape: 6570, // Fire cape
      neck: 6585, // Amulet of fury
      ammo: 20229, // Honourable blessing
      body: 10551, // Fighter torso#Normal
      shield: 12954, // Dragon defender
      legs: 21304, // Obsidian platelegs
      hands: 7462, // Barrows gloves
      feet: 11840, // Dragon boots
      ring: 11773, // Berserker ring (i)
    },
  },
  {
    label: 'Mid Level Ranged',
    value: EquipmentPreset.MID_LEVEL_RANGED,
    ammo: 11212, // Dragon arrow
    crossbowShield: 12610, // Book of law
    equipment: {
      head: 12496, // Ancient coif
      cape: 22109, // Ava's assembler
      neck: 6585, // Amulet of fury
      body: 12492, // Ancient d'hide body
      legs: 12494, // Ancient chaps
      hands: 7462, // Barrows gloves
      feet: 19921, // Ancient d'hide boots
      ring: 11771, // Archers ring (i)
    },
  },
  {
    label: 'Verac\'s equipment',
    value: EquipmentPreset.VERACS,
    equipment: {
      head: 4753, // Verac's helm
      cape: 21295, // Infernal cape
      neck: 29801, // Amulet of rancour
      ammo: 22947, // Rada's blessing 4
      weapon: 4755, // Verac's flail
      body: 4757, // Verac's brassard
      shield: null,
      legs: 4759, // Verac's plateskirt
      hands: 22981, // Ferocious gloves
      feet: 31097, // Avernic treads (max)
      ring: 28307, // Ultor ring
    },
  },
  {
    label: 'Void Mage',
    value: EquipmentPreset.VOID_MAGE,
    equipment: {
      head: 11663, // Void mage helm
      cape: 21791, // Imbued saradomin cape
      neck: 12002, // Occult necklace
      ammo: 22947, // Rada's blessing 4
      body: 13072, // Elite void top
      legs: 13073, // Elite void robe
      hands: 8842, // Void knight gloves
      feet: 31097, // Avernic treads (max)
      ring: 28313, // Magus ring
    },
  },
  {
    label: 'Void Melee',
    value: EquipmentPreset.VOID_MELEE,
    equipment: {
      head: 11665, // Void melee helm
      cape: 21295, // Infernal cape
      neck: 29801, // Amulet of rancour
      ammo: 22947, // Rada's blessing 4
      body: 13072, // Elite void top
      shield: 22322, // Avernic defender
      legs: 13073, // Elite void robe
      hands: 8842, // Void knight gloves
      feet: 31097, // Avernic treads (max)
      ring: 28307, // Ultor ring
    },
  },
  {
    label: 'Void Ranged',
    value: EquipmentPreset.VOID_RANGED,
    ammo: 33595, // Seeking dragon arrow
    crossbowShield: 21000, // Twisted buckler
    equipment: {
      head: 11664, // Void ranger helm
      cape: 28955, // Blessed Dizana's quiver
      neck: 33639, // Necklace of rupture
      body: 13072, // Elite void top
      legs: 13073, // Elite void robe
      hands: 8842, // Void knight gloves
      feet: 31097, // Avernic treads (max)
      ring: 28310, // Venator ring
    },
  },
  {
    label: 'Tank',
    value: EquipmentPreset.TANK,
    style: () => getCombatStylesForCategory(EquipmentCategory.BULWARK)[1],
    equipment: {
      head: 22326, // Justiciar faceguard
      cape: 21295, // Infernal cape
      neck: 6585, // Amulet of fury
      ammo: 22947, // Rada's blessing 4
      weapon: 21015, // Dinh's bulwark
      body: 22327, // Justiciar chestguard
      shield: null,
      legs: 22328, // Justiciar legguards
      hands: 7462, // Barrows gloves
      feet: 21733, // Guardian boots
      ring: 19710, // Ring of suffering (i)
    },
  },
];

const findItemById = (id: number) => availableEquipment.find((eq) => eq.id === id);

export const getPresetPatch = (player: PlayerStore, preset: PresetDefinition): PlayerPatch => {
  const equipment: Partial<PlayerEquipment> = {};
  for (const [slot, id] of Object.entries(preset.equipment) as [keyof PlayerEquipment, number | null][]) {
    const item = id === null ? null : findItemById(id);
    if (item !== undefined) equipment[slot] = item;
  }

  const { weapon, shield } = player.equipment;
  const usingCrossbow = weapon?.category === EquipmentCategory.CROSSBOW && !weapon.isTwoHanded;
  if (preset.ammo !== undefined) {
    equipment.ammo = findItemById(usingCrossbow ? RUBY_DRAGON_BOLTS_E : preset.ammo) ?? equipment.ammo;
  }
  if (preset.crossbowShield !== undefined) {
    equipment.shield = usingCrossbow && !shield ? findItemById(preset.crossbowShield) : shield;
  }

  const patch: PlayerPatch = { name: preset.label, equipment };
  if (preset.style) patch.style = preset.style();
  return patch;
};
