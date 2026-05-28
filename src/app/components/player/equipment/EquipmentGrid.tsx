import React from 'react';

import EquipmentGridSlot from '@/app/components/player/equipment/EquipmentGridSlot';
import { EquipmentSlot } from '@/types/Player';

const EquipmentGrid: React.FC = () => (
  <>
    <div className="flex justify-center">
      <EquipmentGridSlot slot={EquipmentSlot.HEAD} />
    </div>
    <div className="mt-1 flex justify-center gap-2">
      <EquipmentGridSlot slot={EquipmentSlot.CAPE} />
      <EquipmentGridSlot slot={EquipmentSlot.NECK} />
      <EquipmentGridSlot slot={EquipmentSlot.AMMO} />
    </div>
    <div className="mt-1 flex justify-center gap-6">
      <EquipmentGridSlot slot={EquipmentSlot.WEAPON} />
      <EquipmentGridSlot slot={EquipmentSlot.BODY} />
      <EquipmentGridSlot slot={EquipmentSlot.SHIELD} />
    </div>
    <div className="mt-1 flex justify-center">
      <EquipmentGridSlot slot={EquipmentSlot.LEGS} />
    </div>
    <div className="mt-1 flex justify-center gap-6">
      <EquipmentGridSlot slot={EquipmentSlot.HANDS} />
      <EquipmentGridSlot slot={EquipmentSlot.FEET} />
      <EquipmentGridSlot slot={EquipmentSlot.RING} />
    </div>
  </>
);

export default EquipmentGrid;
