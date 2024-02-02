import React, { useEffect, useRef, useState } from 'react';
import EquipmentGrid from '@/app/components/player/equipment/EquipmentGrid';
import Bonuses from '@/app/components/player/Bonuses';
import EquipmentPresets from '@/app/components/player/equipment/EquipmentPresets';
import { EquipmentSlot } from '@/types/Player';
import EquipmentSelect from './equipment/EquipmentSelect';

const Equipment: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [slot, setSlot] = useState<EquipmentSlot | null>(null);

  useEffect(() => {
    if (slot) {
      inputRef.current?.focus();
    }
  }, [slot]);

  return (
    <div className="px-4">
      <div className="mt-4">
        <EquipmentGrid setSlot={setSlot} />
      </div>
      <div className="mt-4 flex grow gap-0.5">
        <div className="basis-full">
          <EquipmentSelect slot={slot} inputRef={inputRef} />
        </div>
        <div className="basis-32">
          <EquipmentPresets />
        </div>
      </div>
      <div>
        <Bonuses />
      </div>
    </div>

  );
};

export default Equipment;
