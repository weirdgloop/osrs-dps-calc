import React from 'react';
import { observer } from 'mobx-react-lite';
import UserIssueWarning from '@/app/components/generic/UserIssueWarning';
import { BLOWPIPE_IDS } from '@/lib/constants';
import { useCalc } from '@/state/CalcStore';
import { usePlayer } from '@/state/PlayerStore';
import { PlayerEquipment } from '@/types/Player';
import { getCdnImage, isMac } from '@/utils';

interface EquipmentGridSlotProps {
  slot: keyof PlayerEquipment;
  placeholder?: string;
}

const EquipmentGridSlot: React.FC<EquipmentGridSlotProps> = observer(({ slot, placeholder }) => {
  const calc = useCalc();
  const player = usePlayer();
  const piece = player.equipment[slot];
  const isEmpty = !piece;

  // Determine whether there's any issues with this element
  const issue = calc.userIssues.get(player.uuid)?.find((i) => i.type.startsWith(`equipment_slot_${slot}`));

  const tooltip = piece && BLOWPIPE_IDS.includes(piece.id)
    ? `${piece.name} (${piece.itemVars?.blowpipeDartName?.replace(' dart', '') || 'Unknown dart'})`
    : piece?.name;

  /**
   * If ctrl key is pressed, open the wiki page for the item, otherwise clear the equipment slot
   */
  const mouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!piece) return;

    if (isMac ? e.metaKey : e.ctrlKey) {
      e.preventDefault();
      window.open(`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${piece.id}`, '_blank');
    } else {
      player.setEquipment({ [slot]: null });
    }
  };

  return (
    <div className="h-[40px] w-[40px] relative">
      {issue && (
        <UserIssueWarning className="absolute top-[-10px] right-[-10px]" issue={issue} />
      )}
      <button
        type="button"
        className={`flex justify-center items-center h-[40px] w-[40px] bg-body-100 dark:bg-dark-400 dark:border-dark-400 border border-body-300 transition-colors rounded ${!isEmpty ? 'cursor-pointer hover:border-red' : ''}`}
        data-slot={slot}
        data-tooltip-id="tooltip"
        data-tooltip-content={tooltip}
        onMouseDown={mouseDown}
      >
        {piece?.image ? (
          <img src={getCdnImage(`equipment/${piece.image}`)} alt={piece.name} />
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
