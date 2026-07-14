import React from 'react';
import EquipmentGrid from '@/app/components/player/equipment/EquipmentGrid';
import Bonuses from '@/app/components/player/Bonuses';
import EquipmentPresets from '@/app/components/player/equipment/EquipmentPresets';
import EquipmentSelect from './equipment/EquipmentSelect';

const Equipment: React.FC = () => (
  <div className="px-4">
    <span
      className="underline decoration-dotted float-right cursor-help"
      title="Left click to remove, ctrl click to open wiki"
    >
      ?
    </span>
    <div className="mt-4">
      <EquipmentGrid />
    </div>
    <div className="mt-4 flex grow gap-0.5">
      <div className="basis-full">
        <EquipmentSelect />
      </div>
      <div className="basis-32">
        <EquipmentPresets />
      </div>
    </div>
    <div>
      <Bonuses />
    </div>
  </div>

);

export default Equipment;
