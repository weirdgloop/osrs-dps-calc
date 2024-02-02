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
  setSlot: (slot: EquipmentSlot) => void
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ setSlot }) => (
  <>
    <div className="flex justify-center">
      <EquipmentGridSlot slot="head" placeholder={head.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center gap-2">
      <EquipmentGridSlot slot="cape" placeholder={cape.src} onClick={setSlot} />
      <EquipmentGridSlot slot="neck" placeholder={neck.src} onClick={setSlot} />
      <EquipmentGridSlot slot="ammo" placeholder={ammo.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center gap-6">
      <EquipmentGridSlot slot="weapon" placeholder={weapon.src} onClick={setSlot} />
      <EquipmentGridSlot slot="body" placeholder={body.src} onClick={setSlot} />
      <EquipmentGridSlot slot="shield" placeholder={shield.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center">
      <EquipmentGridSlot slot="legs" placeholder={legs.src} onClick={setSlot} />
    </div>
    <div className="mt-1 flex justify-center gap-6">
      <EquipmentGridSlot slot="hands" placeholder={hands.src} onClick={setSlot} />
      <EquipmentGridSlot slot="feet" placeholder={feet.src} onClick={setSlot} />
      <EquipmentGridSlot slot="ring" placeholder={ring.src} onClick={setSlot} />
    </div>
  </>
);

export default EquipmentGrid;
