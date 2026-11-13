import React from 'react';
import Select from '@/app/components/generic/Select';
import { EQUIPMENT_PRESETS, getPresetPatch } from '@/app/components/player/equipment/presets';
import { usePlayer } from '@/state/PlayerStore';

const EquipmentPresets: React.FC = () => {
  const player = usePlayer();

  return (
    <Select<typeof EQUIPMENT_PRESETS[number]>
      id="presets"
      items={EQUIPMENT_PRESETS}
      placeholder="Presets"
      resetAfterSelect
      onSelectedItemChange={(preset) => {
        if (preset) player.update(getPresetPatch(player, preset));
      }}
    />
  );
};

export default EquipmentPresets;
