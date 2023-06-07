import React, {useMemo} from 'react';
import equipment from '@/lib/equipment.json';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';
import {getCdnImage} from '@/utils';
import {EquipmentPiece} from '@/types/Player';
import Combobox from '../generic/Combobox';
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
    <Combobox
      id={'equipment-select'}
      className={'w-full'}
      items={options}
      resetAfterSelect={true}
      placeholder={'Search for equipment...'}
      onSelectedItemChange={(item) => {
        if (item) {
          const val = item as EquipmentOption;

          store.updatePlayer({
            equipment: {
              [val.equipment.slot]: val.value
            }
          })
        }
      }}
      CustomItemComponent={({item, itemString}) => {
        let i = item as EquipmentOption;

        return (
          <div className={'flex items-center gap-2'}>
            <div className={'basis-4 flex justify-center h-[20px] w-auto'}>
              {i.equipment.image && (<LazyImage responsive={true} src={i.equipment.image ? getCdnImage(`equipment/${i.equipment.image}`) : undefined} alt={''} />)}
            </div>
            <div>
              {itemString}
              {i.version && <span className={'monster-version text-xs text-gray-400'}>#{i.version}</span>}
            </div>
          </div>
        )
      }}
    />
  )
})

export default EquipmentSelect;