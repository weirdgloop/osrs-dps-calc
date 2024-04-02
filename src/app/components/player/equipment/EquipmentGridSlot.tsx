import { PlayerEquipment } from '@/types/Player';
import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { getCdnImage } from '@/utils';
import UserIssueWarning from '@/app/components/generic/UserIssueWarning';

interface EquipmentGridSlotProps {
  slot: keyof PlayerEquipment;
  placeholder?: string;
}

const EquipmentGridSlot: React.FC<EquipmentGridSlotProps> = observer((props) => {
  const store = useStore();
  const { slot, placeholder } = props;
  const currentSlot = store.equipmentData[slot];
  const isEmpty = !currentSlot;

  // Determine whether there's any issues with this element
  const issues = useMemo(() => store.userIssues.filter((i) => i.type.startsWith(`equipment_slot_${slot}`) && i.loadout === `${store.selectedLoadout + 1}`), [store.userIssues, store.selectedLoadout, slot]);

  return (
    <div className="h-[40px] w-[40px] relative">
      {
        issues.length > 0 && (
          <UserIssueWarning className="absolute top-[-10px] right-[-10px]" issue={issues[0]} />
        )
      }
      <button
        type="button"
        className={`flex justify-center items-center h-[40px] w-[40px] bg-body-100 dark:bg-dark-400 dark:border-dark-400 border border-body-300 transition-colors rounded ${!isEmpty ? 'cursor-pointer hover:border-red' : ''}`}
        data-slot={slot}
        data-tooltip-id="tooltip"
        data-tooltip-content={currentSlot?.name}
        onMouseDown={() => {
          if (!isEmpty) store.player.clearEquipmentSlot(slot);
        }}
      >
        {currentSlot?.image ? (
          <img src={getCdnImage(`equipment/${currentSlot.image}`)} alt={currentSlot.name} />
        ) : (
          placeholder && (
            <img className="opacity-30 dark:filter dark:invert" src={placeholder} alt={slot} draggable={false} />
          )
        )}
      </button>
    </div>
  );
});

export default EquipmentGridSlot;
