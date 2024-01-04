import React from 'react';
import EquipmentSelect from './equipment/EquipmentSelect';
import EquipmentGrid from "@/app/components/player/equipment/EquipmentGrid";

const Equipment: React.FC = () => {
  return (
    <div className={'px-6 mt-4'}>
      <div className={'mt-4'}>
        <EquipmentSelect />
      </div>
      <div className={'mt-6'}>
        <EquipmentGrid />
      </div>
    </div>

  )
}

export default Equipment;
