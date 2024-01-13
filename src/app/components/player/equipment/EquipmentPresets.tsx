import Select from "@/app/components/generic/Select";
import React, {useCallback} from "react";
import {EquipmentPreset} from "@/enums/EquipmentPreset";
import {useStore} from "@/state";
import {PartialDeep} from "type-fest";
import {Player} from "@/types/Player";

const EquipmentPresets: React.FC = () => {
  const store = useStore();
  const {availableEquipment} = store;

  const presets = [
    {label: 'Dharok\'s equipment', value: EquipmentPreset.DHAROKS},
    {label: 'Max Melee', value: EquipmentPreset.MAX_MELEE},
    {label: 'Max Ranged', value: EquipmentPreset.MAX_RANGED},
    {label: 'Void (Melee)', value: EquipmentPreset.VOID_MELEE},
    {label: 'Void (Ranged)', value: EquipmentPreset.VOID_RANGED},
    {label: 'Verac\'s equipment', value: EquipmentPreset.VERACS},
  ]

  const onSelect = useCallback((v: {label: string, value: EquipmentPreset} | null | undefined) => {
    let newPlayer: PartialDeep<Player> = {};

    const findItemById = (id: number) => {
      return availableEquipment.find((eq) => eq.id === id);
    }

    switch (v?.value) {
      case EquipmentPreset.DHAROKS: {
        newPlayer = {
          equipment: {
            head: findItemById(4880), // Dharok's helm
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(19553), // Amulet of torture
            body: findItemById(4892), // Dharok's platebody
            legs: findItemById(4898), // Dharok's platelegs
            hands: findItemById(22981), // Ferocious gloves
            feet: findItemById(13239), // Primordial boots
            ring: findItemById(28307), // Ultor ring
            ammo: null,
            shield: null
          }
        }
        break;
      }
      case EquipmentPreset.MAX_MELEE: {
        newPlayer = {
          equipment: {
            head: findItemById(26382), // Torva full helm
            cape: findItemById(21295), // Infernal cape
            neck: findItemById(19553), // Amulet of torture
            body: findItemById(26384), // Torva platebody
            legs: findItemById(26386), // Torva platelegs
            hands: findItemById(22981), // Ferocious gloves
            feet: findItemById(13239), // Primordial boots
            ring: findItemById(28307), // Ultor ring
            ammo: null,
            shield: null
          }
        }
        break;
      }
      case EquipmentPreset.MAX_RANGED: {
        newPlayer = {
          equipment: {
            head: findItemById(27235), // Masori mask (f)
            cape: findItemById(22109), // Ava's assembler
            neck: findItemById(19547), // Necklace of anguish
            body: findItemById(27238), // Masori body (f)
            legs: findItemById(27241), // Masori chaps (f)
            hands: findItemById(26235), // Zaryte vambraces
            feet: findItemById(13237), // Pegasian boots
            ring: findItemById(28310), // Venator ring
            ammo: findItemById(11212), // Dragon arrow
            shield: null
          }
        }
        break;
      }
      case EquipmentPreset.VOID_MELEE: {
        newPlayer = {
          equipment: {
            head: findItemById(11665), // Void melee helm
            cape: null,
            neck: null,
            body: findItemById(13072), // Elite void top
            legs: findItemById(13073), // Elite void robe
            hands: findItemById(8842), // Void knight gloves
            feet: null,
            ring: null,
            ammo: null,
            shield: null
          }
        }
        break;
      }
      case EquipmentPreset.VOID_RANGED: {
        newPlayer = {
          equipment: {
            head: findItemById(11664), // Void ranger helm
            cape: null,
            neck: null,
            body: findItemById(13072), // Elite void top
            legs: findItemById(13073), // Elite void robe
            hands: findItemById(8842), // Void knight gloves
            feet: null,
            ring: null,
            ammo: null,
            shield: null
          }
        }
        break;
      }
      case EquipmentPreset.VERACS: {
        newPlayer = {
          equipment: {
            head: findItemById(4976), // Verac's helm
            cape: null,
            neck: null,
            body: findItemById(4988), // Verac's brassard
            legs: findItemById(4994), // Verac's plateskirt
            hands: findItemById(7462), // Barrows gloves
            feet: null,
            ring: null,
            ammo: null,
            shield: null
          }
        }
        break;
      }
    }

    if (Object.keys(newPlayer).length > 0) {
      store.updatePlayer(newPlayer)
    }
  }, [store, availableEquipment])

  return (
    <Select
      id={'presets'}
      items={presets}
      placeholder={'Presets'}
      resetAfterSelect={true}
      onSelectedItemChange={onSelect}
    />
  )
}

export default EquipmentPresets;
