import {PlayerEquipment} from "@/types/Player";
import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {getCdnImage} from "@/utils";

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
      className={`flex justify-center items-center h-[40px] w-[40px] bg-body-100 dark:bg-dark-400 dark:border-dark-400 border border-body-300 transition-colors rounded ${!isEmpty ? 'cursor-pointer hover:border-red' : ''}`}
      data-slot={slot}
      data-tooltip-id={'tooltip'}
      data-tooltip-content={currentSlot?.name}
      onClick={() => {
        if (!isEmpty) store.clearEquipmentSlot(slot);
      }}
    >
      {currentSlot?.image ? (
        <img src={getCdnImage(`equipment/${currentSlot.image}`)} alt={currentSlot.name}/>
      ) : (
        placeholder && (
          <img className={'opacity-30 dark:filter dark:invert'} src={placeholder} alt={slot}/>
        )
      )}
    </div>
  )
})

export default EquipmentGridSlot;