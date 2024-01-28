import Select from '@/app/components/generic/Select';
import React, { useCallback } from 'react';
import EquipmentPreset from '@/enums/EquipmentPreset';
import { useStore } from '@/state';
import { PartialDeep } from 'type-fest';
import { Player } from '@/types/Player';
import { availableEquipment } from '@/lib/Equipment';

const EquipmentPresets: React.FC = () => {
  const store = useStore();

  const presets = [
    { label: 'Dharok\'s equipment', value: EquipmentPreset.DHAROKS },
    { label: 'Max Mage', value: EquipmentPreset.MAX_MAGE },
    { label: 'Max Melee', value: EquipmentPreset.MAX_MELEE },
    { label: 'Max Ranged', value: EquipmentPreset.MAX_RANGED },
    { label: 'Verac\'s equipment', value: EquipmentPreset.VERACS },
    { label: 'Void (Mage)', value: EquipmentPreset.VOID_MAGE },
    { label: 'Void (Melee)', value: EquipmentPreset.VOID_MELEE },
    { label: 'Void (Ranged)', value: EquipmentPreset.VOID_RANGED },
  ];

  const onSelect = useCallback((v: { label: string, value: EquipmentPreset } | null | undefined) => {
    let newPlayer: PartialDeep<Player> = {};

    const findItemById = (id: number) => availableEquipment.find((eq) => eq.id === id);

    switch (v?.value) {
      case EquipmentPreset.DHAROKS: {
        newPlayer = {
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
          equipment: {
            head: findItemById(27235), // Masori mask (f)
            cape: findItemById(22109), // Ava's assembler
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
      case EquipmentPreset.VOID_MAGE: {
        newPlayer = {
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
      default:
        break;
    }

    if (Object.keys(newPlayer).length > 0) {
      store.updatePlayer(newPlayer);
    }
  }, [store, availableEquipment]);

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
