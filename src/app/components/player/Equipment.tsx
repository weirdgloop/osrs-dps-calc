import React from 'react';
import EquipmentSelect from './equipment/EquipmentSelect';
import EquipmentGrid from "@/app/components/player/equipment/EquipmentGrid";
import Bonuses from "@/app/components/player/Bonuses";
import Select from "@/app/components/generic/Select";
import EquipmentPresets from "@/app/components/player/equipment/EquipmentPresets";

const Equipment: React.FC = () => {
  return (
    <div className={'px-4'}>
      <div className={'mt-4'}>
        <EquipmentGrid/>
      </div>
      <div className={'mt-4 flex grow gap-0.5'}>
        <div className={'basis-full'}>
          <EquipmentSelect />
        </div>
        <div className={'basis-32'}>
          <EquipmentPresets />
        </div>
      </div>
      <div>
        <Bonuses/>
      </div>
    </div>

  )
}

export default Equipment;
