import React from 'react';

const EquipmentGridSlot: React.FC = () => {
  return (
    <div className={'h-[40px] w-[40px] bg-darker-800 rounded'}>

    </div>
  )
}

const EquipmentGrid: React.FC = () => {
  return (
    <>
      <div className={'flex justify-center'}>
        <EquipmentGridSlot />
      </div>
      <div className={'mt-2 flex justify-center gap-2'}>
        <EquipmentGridSlot />
        <EquipmentGridSlot />
        <EquipmentGridSlot />
      </div>
      <div className={'mt-2 flex justify-center gap-6'}>
        <EquipmentGridSlot />
        <EquipmentGridSlot />
        <EquipmentGridSlot />
      </div>
      <div className={'mt-2 flex justify-center'}>
        <EquipmentGridSlot />
      </div>
      <div className={'mt-2 flex justify-center gap-6'}>
        <EquipmentGridSlot />
        <EquipmentGridSlot />
        <EquipmentGridSlot />
      </div>
    </>
  )
}

const Equipment: React.FC = () => {
  return (
    <div className={'mt-4'}>
      <h4 className={`font-bold font-mono`}>
        Equipment
      </h4>
      <div className={'mt-4'}>
        <EquipmentGrid />
      </div>
    </div>

  )
}

export default Equipment;