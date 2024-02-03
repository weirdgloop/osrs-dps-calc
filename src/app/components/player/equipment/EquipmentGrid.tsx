import React from 'react';
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
import EquipmentGridSlot from '@/app/components/player/equipment/EquipmentGridSlot';
import { EquipmentSlot } from '@/types/Player';

interface EquipmentGridProps {
  selectedSlot: EquipmentSlot | null;
  setSlot: (slot: EquipmentSlot) => void
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ selectedSlot, setSlot }) => (
  <>
    <div className="flex justify-center">
      <EquipmentGridSlot slot="head" selected={selectedSlot === 'head'} placeholder={head.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center gap-2">
      <EquipmentGridSlot slot="cape" selected={selectedSlot === 'cape'} placeholder={cape.src} onClick={setSlot} />
      <EquipmentGridSlot slot="neck" selected={selectedSlot === 'neck'} placeholder={neck.src} onClick={setSlot} />
      <EquipmentGridSlot slot="ammo" selected={selectedSlot === 'ammo'} placeholder={ammo.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center gap-6">
      <EquipmentGridSlot slot="weapon" selected={selectedSlot === 'weapon'} placeholder={weapon.src} onClick={setSlot} />
      <EquipmentGridSlot slot="body" selected={selectedSlot === 'body'} placeholder={body.src} onClick={setSlot} />
      <EquipmentGridSlot slot="shield" selected={selectedSlot === 'shield'} placeholder={shield.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center">
      <EquipmentGridSlot slot="legs" selected={selectedSlot === 'legs'} placeholder={legs.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center gap-6">
      <EquipmentGridSlot slot="hands" selected={selectedSlot === 'hands'} placeholder={hands.src} onClick={setSlot} />
      <EquipmentGridSlot slot="feet" selected={selectedSlot === 'feet'} placeholder={feet.src} onClick={setSlot} />
      <EquipmentGridSlot slot="ring" selected={selectedSlot === 'ring'} placeholder={ring.src} onClick={setSlot} />
    </div>
  </>
);

export default EquipmentGrid;
