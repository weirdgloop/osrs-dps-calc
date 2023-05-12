import React from 'react';
import equipment from '@/lib/equipment.json';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';
import {getWikiImage} from '@/utils';
import {EquipmentCategory} from '@/enums/EquipmentCategory';
import {EquipmentPiece} from '@/types/Player';
import Combobox from '../generic/Combobox';

interface EquipmentOption {
  label: string;
  value: number;
  version: string;
  slot: string;
  equipment: EquipmentPiece;
}

const EquipmentSelect: React.FC = observer(() => {
  const store = useStore();

  const options: EquipmentOption[] = equipment.map((e, i) => {
    return {
      label: `${e.name}`,
      value: i,
      version: e.version || '',
      slot: e.slot,
      equipment: {
        name: e.name,
        image: e.image,
        category: e.style as EquipmentCategory,
        offensive: {
          crush: e.offensive[0],
          magic_str: e.offensive[1],
          magic: e.offensive[2],
          ranged: e.offensive[3],
          ranged_str: e.offensive[4],
          slash: e.offensive[5],
          stab: e.offensive[6],
          str: e.offensive[7]
        },
        defensive: {
          crush: e.defensive[0],
          magic: e.defensive[1],
          ranged: e.defensive[2],
          slash: e.defensive[3],
          stab: e.defensive[4],
          prayer: e.defensive[5]
        }
      }
    }
  })

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
              [val.slot]: val.equipment
            }
          })
        }
      }}
      CustomItemComponent={({item, itemString}) => {
        let i = item as EquipmentOption;

        return (
          <div className={'flex items-center gap-2'}>
            <div className={'basis-4 flex justify-center max-h-[20px] w-auto'}>
              {i.equipment.image && (<img className={''} src={getWikiImage(i.equipment.image)} alt={''} />)}
            </div>
            <div className={'flex items-center gap-0'}>
              <div>{itemString}</div>
              {i.version && <div className={'monster-version relative top-[1px] text-xs text-gray-400'}>#{i.version}</div>}
            </div>
          </div>
        )
      }}
    />
  )
})

export default EquipmentSelect;