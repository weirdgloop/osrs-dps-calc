import React from 'react';
import EquipmentSelect from './EquipmentSelect';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {getCdnImage, getWikiImage} from '@/utils';
import {PlayerEquipment} from '@/types/Player';

import head from '@/public/img/slots/head.png';
import cape from '@/public/img/slots/cape.png';
import neck from '@/public/img/slots/neck.png';
import ammo from '@/public/img/slots/ammo.png';
import weapon from '@/public/img/slots/weapon.png';
import body from '@/public/img/slots/body.png';
import shield from '@/public/img/slots/shield.png';
import legs from '@/public/img/slots/legs.png';
import hands from '@/public/img/slots/hands.png';
import feet from '@/public/img/slots/feet.png';
import ring from '@/public/img/slots/ring.png';

interface EquipmentGridSlotProps {
  slot: keyof PlayerEquipment;
  placeholder?: string;
}

const EquipmentGridSlot: React.FC<EquipmentGridSlotProps> = observer((props) => {
  const store = useStore();
  const {slot, placeholder} = props;
  const currentSlot = store.equipmentData[slot];
  const isEmpty = !currentSlot;

  return (
    <div
      className={`flex justify-center items-center h-[40px] w-[40px] bg-body-100 border border-body-300 transition-colors rounded ${!isEmpty ? 'cursor-pointer hover:border-red' : ''}`}
      data-slot={slot}
      data-tooltip-id={'tooltip'}
      data-tooltip-content={currentSlot?.name}
      onClick={() => {
        if (!isEmpty) store.clearEquipmentSlot(slot);
      }}
    >
      {currentSlot?.image ? (
          <img src={getCdnImage(`equipment/${currentSlot.image}`)} alt={currentSlot.name} />
      ) : (
          placeholder && (
              <img className={'opacity-30'} src={placeholder} alt={slot} />
          )
      )}
    </div>
  )
})

const EquipmentGrid: React.FC = () => {
  return (
    <>
      <div className={'flex justify-center'}>
        <EquipmentGridSlot slot={'head'} placeholder={head.src} />
      </div>
      <div className={'mt-2 flex justify-center gap-2'}>
        <EquipmentGridSlot slot={'cape'} placeholder={cape.src} />
        <EquipmentGridSlot slot={'neck'} placeholder={neck.src} />
        <EquipmentGridSlot slot={'ammo'} placeholder={ammo.src} />
      </div>
      <div className={'mt-2 flex justify-center gap-6'}>
        <EquipmentGridSlot slot={'weapon'} placeholder={weapon.src} />
        <EquipmentGridSlot slot={'body'} placeholder={body.src} />
        <EquipmentGridSlot slot={'shield'} placeholder={shield.src} />
      </div>
      <div className={'mt-2 flex justify-center'}>
        <EquipmentGridSlot slot={'legs'} placeholder={legs.src} />
      </div>
      <div className={'mt-2 flex justify-center gap-6'}>
        <EquipmentGridSlot slot={'hands'} placeholder={hands.src} />
        <EquipmentGridSlot slot={'feet'} placeholder={feet.src} />
        <EquipmentGridSlot slot={'ring'} placeholder={ring.src} />
      </div>
    </>
  )
}

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