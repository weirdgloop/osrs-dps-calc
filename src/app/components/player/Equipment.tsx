import React, { useCallback } from 'react';
import EquipmentGrid from '@/app/components/player/equipment/EquipmentGrid';
import EquipmentPresets from '@/app/components/player/equipment/EquipmentPresets';
import { usePlayer } from '@/state/LoadoutStore';
import { observer } from 'mobx-react-lite';
import EquipmentStats from '@/app/components/player/equipment/EquipmentStats';
import { EquipmentPiece } from '@/types/Player';
import EquipmentSelect from './equipment/EquipmentSelect';

const Equipment: React.FC = observer(() => {
  const { updateBasePlayer } = usePlayer();
  const onSelect = useCallback((eq: EquipmentPiece | null | undefined) => {
    if (eq) {
      updateBasePlayer({ equipment: { [eq.slot]: eq } });
    }
  }, [updateBasePlayer]);

  return (
    <div className="px-4">
      <div className="mt-4">
        <EquipmentGrid />
      </div>
      <div className="mt-4 flex grow gap-0.5">
        <div className="basis-full">
          <EquipmentSelect onSelect={onSelect} />
        </div>
        <div className="basis-32">
          <EquipmentPresets />
        </div>
      </div>
      <div>
        <EquipmentStats />
      </div>
    </div>

  );
});

export default Equipment;
