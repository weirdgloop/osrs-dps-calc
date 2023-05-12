import React from 'react';
import EquipmentSelect from './EquipmentSelect';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {getWikiImage} from '@/utils';
import {IconTrashX} from '@tabler/icons-react';
import {PlayerEquipment} from '@/types/Player';

interface EquipmentGridSlotProps {
  slot: keyof PlayerEquipment;
}

const EquipmentGridSlot: React.FC<EquipmentGridSlotProps> = observer((props) => {
  const store = useStore();
  const {equipment} = store.player;
  const {slot} = props;
  const currentSlot = equipment[slot];
  const isEmpty = !currentSlot.name;

  return (
    <div
      className={`flex justify-center items-center h-[40px] w-[40px] bg-body-100 border border-body-300 rounded ${!isEmpty ? 'cursor-pointer' : ''}`}
      data-slot={slot}
      data-tooltip-id={'tooltip'}
      data-tooltip-content={currentSlot.name}
      onClick={() => {
        if (!isEmpty) store.clearEquipmentSlot(slot);
      }}
    >
      {currentSlot.image &&
        <img src={getWikiImage(currentSlot.image)} alt={currentSlot.name} />
      }
    </div>
  )
})

const EquipmentGrid: React.FC = () => {
  return (
    <>
      <div className={'flex justify-center'}>
        <EquipmentGridSlot slot={'head'} />
      </div>
      <div className={'mt-2 flex justify-center gap-2'}>
        <EquipmentGridSlot slot={'cape'} />
        <EquipmentGridSlot slot={'neck'} />
        <EquipmentGridSlot slot={'ammo'} />
      </div>
      <div className={'mt-2 flex justify-center gap-6'}>
        <EquipmentGridSlot slot={'weapon'} />
        <EquipmentGridSlot slot={'body'} />
        <EquipmentGridSlot slot={'shield'} />
      </div>
      <div className={'mt-2 flex justify-center'}>
        <EquipmentGridSlot slot={'legs'} />
      </div>
      <div className={'mt-2 flex justify-center gap-6'}>
        <EquipmentGridSlot slot={'hands'} />
        <EquipmentGridSlot slot={'feet'} />
        <EquipmentGridSlot slot={'ring'} />
      </div>
    </>
  )
}

const Equipment: React.FC = observer(() => {
  const store = useStore();
  const {equipment} = store.player;

  return (
    <div className={'px-6 mt-4'}>
      <div className={'flex justify-between'}>
        <h4 className={`font-bold font-serif flex justify-between`}>
          Equipment
        </h4>
        <div>
          <button
            className={'text-sm'}
            data-tooltip-id={'tooltip'}
            data-tooltip-content={'Clear'}
            onClick={() => {
              for (let k of Object.keys(equipment)) {
                store.clearEquipmentSlot(k as keyof PlayerEquipment);
              }
            }}
          >
            <IconTrashX className={'w-[20px] text-body-500'} />
          </button>
        </div>
      </div>
      <div className={'mt-4'}>
        <EquipmentGrid />
      </div>
      <div className={'mt-6'}>
        <EquipmentSelect />
      </div>
    </div>

  )
})

export default Equipment;