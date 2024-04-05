import Select from '@/app/components/generic/Select';
import React, { useCallback } from 'react';
import EquipmentPreset from '@/enums/EquipmentPreset';
import { useStore } from '@/state';
import { PartialDeep } from 'type-fest';
import { Player } from '@/types/Player';
import { availableEquipment } from '@/lib/Equipment';
import { EquipmentCategory } from '@/enums/EquipmentCategory';
import { getCombatStylesForCategory } from '@/utils';

const EquipmentPresets: React.FC = () => {
  const store = useStore();

  const presets = [
    { label: 'Dharok\'s equipment', value: EquipmentPreset.DHAROKS },
    { label: 'Max Mage', value: EquipmentPreset.MAX_MAGE },
    { label: 'Max Melee', value: EquipmentPreset.MAX_MELEE },
    { label: 'Max Ranged', value: EquipmentPreset.MAX_RANGED },
    { label: 'Mid Level Mage', value: EquipmentPreset.MID_LEVEL_MAGE },
    { label: 'Mid Level Melee', value: EquipmentPreset.MID_LEVEL_MELEE },
    { label: 'Mid Level Ranged', value: EquipmentPreset.MID_LEVEL_RANGED },
    { label: 'Verac\'s equipment', value: EquipmentPreset.VERACS },
    { label: 'Void Mage', value: EquipmentPreset.VOID_MAGE },
    { label: 'Void Melee', value: EquipmentPreset.VOID_MELEE },
    { label: 'Void Ranged', value: EquipmentPreset.VOID_RANGED },
    { label: 'Tank', value: EquipmentPreset.TANK },
  ];

  const onSelect = useCallback((v: { label: string, value: EquipmentPreset } | null | undefined) => {
    let newPlayer: PartialDeep<Player> = {};

    const findItemById = (id: number) => availableEquipment.find((eq) => eq.id === id);

    switch (v?.value) {
      case EquipmentPreset.DHAROKS: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(4716), // Dharok's helm
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(19553), // Amulet of torture
            ammo: findItemById(22947), // Rada's blessing 4
            weapon: findItemById(4718), // Dharok's greataxe
            body: findItemById(4720), // Dharok's platebody
            shield: null,
            legs: findItemById(4722), // Dharok's platelegs
            hands: findItemById(22981), // Ferocious gloves
            feet: findItemById(13239), // Primordial boots
            ring: findItemById(28307), // Ultor ring
          },
        };
        break;
      }
      case EquipmentPreset.MAX_MAGE: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(21018), // Ancestral hat
            cape: findItemById(21791), // Imbued saradomin cape
            neck: findItemById(12002), // Occult necklace
            ammo: findItemById(22947), // Rada's blessing 4
            body: findItemById(21021), // Ancestral robe top
            legs: findItemById(21024), // Ancestral robe bottom
            hands: findItemById(19544), // Tormented bracelet
            feet: findItemById(13235), // Eternal boots
            ring: findItemById(28313), // Magus ring
          },
        };
        break;
      }
      case EquipmentPreset.MAX_MELEE: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(26382), // Torva full helm
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(19553), // Amulet of torture
            ammo: findItemById(22947), // Rada's blessing 4
            body: findItemById(26384), // Torva platebody
            legs: findItemById(26386), // Torva platelegs
            hands: findItemById(22981), // Ferocious gloves
            feet: findItemById(13239), // Primordial boots
            ring: findItemById(28307), // Ultor ring
          },
        };
        break;
      }
      case EquipmentPreset.MAX_RANGED: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(27235), // Masori mask (f)
            cape: findItemById(28955), // Blessed dizana's quiver
            neck: findItemById(19547), // Necklace of anguish
            ammo: findItemById(11212), // Dragon arrow
            body: findItemById(27238), // Masori body (f)
            legs: findItemById(27241), // Masori chaps (f)
            hands: findItemById(26235), // Zaryte vambraces
            feet: findItemById(13237), // Pegasian boots
            ring: findItemById(28310), // Venator ring
          },
        };
        break;
      }
      case EquipmentPreset.MID_LEVEL_MAGE: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(4708), // Ahrim's hood#Undamaged
            cape: findItemById(21791), // Imbued saradomin cape
            neck: findItemById(12002), // Occult necklace
            ammo: findItemById(20229), // Honourable blessing
            body: findItemById(4712), // Ahrim's robetop#Undamaged
            legs: findItemById(4714), // Ahrim's robeskirt#Undamaged
            hands: findItemById(7462), // Barrows gloves
            feet: findItemById(6920), // Infinity boots
            ring: findItemById(11770), // Seers ring (i)
          },
        };
        break;
      }
      case EquipmentPreset.MID_LEVEL_MELEE: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(10828), // Helm of neitiznot
            cape: findItemById(6570), // Fire cape
            neck: findItemById(6585), // Amulet of fury
            ammo: findItemById(20229), // Honourable blessing
            body: findItemById(10551), // Fighter torso#Normal
            legs: findItemById(21304), // Obsidian platelegs
            hands: findItemById(7462), // Barrows gloves
            feet: findItemById(11840), // Dragon boots
            ring: findItemById(11773), // Berserker ring (i)
          },
        };
        break;
      }
      case EquipmentPreset.MID_LEVEL_RANGED: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(12496), // Ancient coif
            cape: findItemById(22109), // Ava's assembler
            neck: findItemById(6585), // Amulet of fury
            ammo: findItemById(11212), // Dragon arrow
            body: findItemById(12492), // Ancient d'hide body
            legs: findItemById(12494), // Ancient chaps
            hands: findItemById(7462), // Barrows gloves
            feet: findItemById(19921), // Ancient d'hide boots
            ring: findItemById(11771), // Archers ring (i)
          },
        };
        break;
      }
      case EquipmentPreset.VOID_MAGE: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(11663), // Void mage helm
            cape: findItemById(21791), // Imbued saradomin cape
            neck: findItemById(12002), // Occult necklace
            ammo: findItemById(22947), // Rada's blessing 4
            body: findItemById(13072), // Elite void top
            legs: findItemById(13073), // Elite void robe
            hands: findItemById(8842), // Void knight gloves
            feet: findItemById(13235), // Eternal boots
            ring: findItemById(28313), // Magus ring
          },
        };
        break;
      }
      case EquipmentPreset.VOID_MELEE: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(11665), // Void melee helm
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(19553), // Amulet of torture
            ammo: findItemById(22947), // Rada's blessing 4
            body: findItemById(13072), // Elite void top
            legs: findItemById(13073), // Elite void robe
            hands: findItemById(8842), // Void knight gloves
            feet: findItemById(13239), // Primordial boots
            ring: findItemById(28307), // Ultor ring
          },
        };
        break;
      }
      case EquipmentPreset.VOID_RANGED: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(11664), // Void ranger helm
            cape: findItemById(22109), // Ava's assembler
            neck: findItemById(19547), // Necklace of anguish
            ammo: findItemById(11212), // Dragon arrow
            body: findItemById(13072), // Elite void top
            legs: findItemById(13073), // Elite void robe
            hands: findItemById(8842), // Void knight gloves
            feet: findItemById(13237), // Pegasian boots
            ring: findItemById(28310), // Venator ring
          },
        };
        break;
      }
      case EquipmentPreset.VERACS: {
        newPlayer = {
          name: v.label,
          equipment: {
            head: findItemById(4753), // Verac's helm
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(19553), // Amulet of torture
            ammo: findItemById(22947), // Rada's blessing 4
            weapon: findItemById(4755), // Verac's flail
            body: findItemById(4757), // Verac's brassard
            shield: null,
            legs: findItemById(4759), // Verac's plateskirt
            hands: findItemById(22981), // Ferocious gloves
            feet: findItemById(13239), // Primordial boots
            ring: findItemById(28307), // Ultor ring
          },
        };
        break;
      }
      case EquipmentPreset.TANK: {
        newPlayer = {
          name: v.label,
          style: getCombatStylesForCategory(EquipmentCategory.BULWARK)[1],
          equipment: {
            head: findItemById(22326), // Justiciar faceguard
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(6585), // Amulet of fury
            ammo: findItemById(22947), // Rada's blessing 4
            weapon: findItemById(21015), // Dinh's bulwark
            body: findItemById(22327), // Justiciar chestguard
            shield: null,
            legs: findItemById(22328), // Justiciar legguards
            hands: findItemById(7462), // Barrows gloves
            feet: findItemById(21733), // Guardian boots
            ring: findItemById(19710), // Ring of suffering (i)
          },
        };
        break;
      }
      default:
        break;
    }

    if (Object.keys(newPlayer).length > 0) {
      store.updatePlayer(newPlayer);
    }
  }, [store]);

  return (
    <Select<{ label: string, value: EquipmentPreset }>
      id="presets"
      items={presets}
      placeholder="Presets"
      resetAfterSelect
      onSelectedItemChange={onSelect}
    />
  );
};

export default EquipmentPresets;
