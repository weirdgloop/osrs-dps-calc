import Select from '@/app/components/generic/Select';
import React from 'react';
import { EquipmentPreset } from '@/types/EquipmentPreset';
import { observer } from 'mobx-react-lite';
import { usePlayer } from '@/state/LoadoutStore';

// todo(mobx)
const EquipmentPresets: React.FC = observer(() => {
  const { equipPreset } = usePlayer();

  const presets = [
    { label: 'Bowfa + Crystal', value: EquipmentPreset.BOWFA },
    { label: 'Blood moon set', value: EquipmentPreset.BLOOD_MOON },
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

  return (
    <Select
      id="presets"
      items={presets}
      placeholder="Presets"
      resetAfterSelect
      onSelectedItemChange={(item) => {
        if (item) {
          equipPreset(item.value);
        }
      }}
    />
  );
});

export default EquipmentPresets;
