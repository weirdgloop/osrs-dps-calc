import React from 'react';
import EquipmentSelect from './equipment/EquipmentSelect';
import EquipmentGrid from "@/app/components/player/equipment/EquipmentGrid";
import Bonuses from "@/app/components/player/Bonuses";

const Equipment: React.FC = () => {
  return (
    <div className={'px-4 mt-4'}>
      <div className={'mt-4'}>
        <EquipmentSelect />
      </div>
      <div className={'mt-4'}>
        <EquipmentGrid />
      </div>
      <div>
        <Bonuses/>
      </div>
    </div>

  )
}

export default Equipment;
