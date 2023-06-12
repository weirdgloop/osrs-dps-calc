import React from 'react';
import EquipmentSelect from './equipment/EquipmentSelect';
import EquipmentGrid from "@/app/components/player/equipment/EquipmentGrid";

const Equipment: React.FC = () => {
  return (
    <div className={'px-6 mt-4'}>
      <div className={'flex justify-between'}>
        <h4 className={`font-bold font-serif flex justify-between`}>
          Equipment
        </h4>
      </div>
      <div className={'mt-4'}>
        <EquipmentGrid />
      </div>
      <div className={'mt-6'}>
        <EquipmentSelect />
      </div>
    </div>

  )
}

export default Equipment;