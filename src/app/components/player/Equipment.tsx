import React from 'react';
import EquipmentGrid from '@/app/components/player/equipment/EquipmentGrid';
import EquipmentSelect from '@/app/components/player/equipment/EquipmentSelect';
import EquipmentPresets from '@/app/components/player/equipment/EquipmentPresets';
import Bonuses from '@/app/components/player/Bonuses';

const Equipment: React.FC = () => (
  <div className="px-4">
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
