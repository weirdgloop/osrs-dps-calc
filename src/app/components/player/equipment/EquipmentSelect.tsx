import React, {useMemo} from 'react';
import equipment from '@/lib/equipment.json';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';
import {getCdnImage} from '@/utils';
import {EquipmentPiece} from '@/types/Player';
import Combobox from '../../generic/Combobox';
import LazyImage from "@/app/components/generic/LazyImage";

interface EquipmentOption {
  label: string;
  value: string;
  version: string;
  slot: string;
  equipment: EquipmentPiece;
}

const EquipmentSelect: React.FC = observer(() => {
  const store = useStore();

  const options: EquipmentOption[] = useMemo(() => Object.entries(equipment).map(([k, v]) => {
    return {
      label: `${v.name}`,
      value: k,
      version: v.version || '',
      slot: v.slot,
      equipment: {
        ...(v as EquipmentPiece)
      }
    }
  }), [])

  return (
    <Combobox<EquipmentOption>
      id={'equipment-select'}
      className={'w-full'}
      items={options}
      resetAfterSelect={true}
      placeholder={'Search for equipment...'}
      onSelectedItemChange={(item) => {
        if (item) {
          store.updatePlayer({
            equipment: {
              [item.equipment.slot]: item.value
            }
          })
        }
      }}
      CustomItemComponent={({item, itemString}) => {
        return (
          <div className={'flex items-center gap-2'}>
            <div className={'basis-4 flex justify-center h-[20px] w-auto'}>
              {item.equipment.image && (<LazyImage responsive={true} src={item.equipment.image ? getCdnImage(`equipment/${item.equipment.image}`) : undefined} alt={''} />)}
            </div>
            <div>
              {itemString}
              {item.version && <span className={'monster-version text-xs text-gray-400 dark:text-gray-300'}>#{item.version}</span>}
            </div>
          </div>
        )
      }}
    />
  )
})

export default EquipmentSelect;