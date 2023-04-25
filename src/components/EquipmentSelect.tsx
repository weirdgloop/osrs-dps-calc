import React from 'react';
import equipment from '@/lib/equipment.json';
import {useStore} from '../state';
import {observer} from 'mobx-react-lite';
import WindowedSelect, {FormatOptionLabelMeta} from 'react-windowed-select';
import {getWikiImage} from '@/lib/utilities';
import {EquipmentCategory} from '@/lib/enums/EquipmentCategory';
import {EquipmentPiece} from '@/types/Player';

interface EquipmentOption {
  label: string;
  value: number;
  version: string;
  slot: string;
  equipment: EquipmentPiece;
}

const EquipmentOptionLabel = (data: EquipmentOption, meta: FormatOptionLabelMeta<unknown>) => {
  return (
    <div className={'flex items-center gap-2'}>
      <div className={'basis-4 flex justify-center'}>
        <img className={'max-h-[20px]'} src={getWikiImage(data.equipment.image)} alt={''} />
      </div>
      <div>
        {data.label}
        {data.version && <span className={'monster-version text-xs text-gray-400'}>#{data.version}</span>}
      </div>
    </div>
  )
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
    <WindowedSelect
      options={options}
      windowThreshold={50}
      placeholder={'Add equipment...'}
      closeMenuOnSelect={false}
      classNames={{
        control: () => 'text-sm',
        menu: () => 'equipment-select-menu',
        option: (state) => `select-option ${state.isSelected ? 'selected' : ''} text-xs`,
        input: () => 'select-input'
      }}
      formatOptionLabel={(data, meta) => EquipmentOptionLabel(data as EquipmentOption, meta)}
      onChange={(v) => {
        const val = v as EquipmentOption;
        store.updatePlayer({
          equipment: {
            [val.slot]: val.equipment
          }
        });
      }}
    />
  )
})

export default EquipmentSelect;