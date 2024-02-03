import React, { useEffect, useRef, useState } from 'react';
import EquipmentGrid from '@/app/components/player/equipment/EquipmentGrid';
import Bonuses from '@/app/components/player/Bonuses';
import EquipmentPresets from '@/app/components/player/equipment/EquipmentPresets';
import { EquipmentSlot } from '@/types/Player';
import EquipmentSelect from './equipment/EquipmentSelect';

const Equipment: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [slot, setSlot] = useState<EquipmentSlot | null>(null);

  const updateSlot = (newSlot: EquipmentSlot) => {
    if (newSlot === slot) {
      setSlot(null);
    } else {
      setSlot(newSlot);
    }
  };

  useEffect(() => {
    if (slot) {
      inputRef.current?.focus();
    }
  }, [slot]);

  return (
    <div className="px-4">
      <div className="mt-4">
        <EquipmentGrid selectedSlot={slot} setSlot={updateSlot} />
      </div>
      <div className="mt-4 flex grow gap-0.5">
        <div className="basis-full">
          <EquipmentSelect slot={slot} inputRef={inputRef} onSelect={() => setSlot(null)} />
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
