import React from 'react';
import monsters from '@/lib/monsters.json';
import {useStore} from '../state/state';
import {observer} from 'mobx-react-lite';
import WindowedSelect, {FormatOptionLabelMeta} from 'react-windowed-select';
import {Monster} from '@/types/State';

interface MonsterOption {
  label: string;
  value: number;
  version: string;
  monster: Monster;
}

const MonsterOptionLabel = (data: MonsterOption, meta: FormatOptionLabelMeta<unknown>) => {
  return (
    <div className={'flex items-center gap-0'}>
      <div>{data.label}</div>
      {data.version && <div className={'monster-version relative top-[1px] text-xs text-gray-400'}>#{data.version}</div>}
    </div>
  )
}

const MonsterSelect: React.FC = observer(() => {
  const store = useStore();

  const options: MonsterOption[] = monsters.map((m, i) => {
    return {
      label: `${m.name}`,
      value: i,
      version: m.version || '',
      monster: {
        name: m.name,
        image: m.image,
        size: m.size,
        skills: {
          atk: m.skills[0],
          def: m.skills[1],
          hp: m.skills[2],
          magic: m.skills[3],
          ranged: m.skills[4],
          str: m.skills[5]
        },
        offensive: {
          atk: m.offensive[0],
          magic: m.offensive[1],
          magic_str: m.offensive[2],
          ranged: m.offensive[3],
          ranged_str: m.offensive[4],
          str: m.offensive[5]
        },
        defensive: {
          crush: m.defensive[0],
          magic: m.defensive[1],
          ranged: m.defensive[2],
          slash: m.defensive[3],
          stab: m.defensive[4]
        },
        attributes: m.attributes
      }
    }
  })

  return (
    <WindowedSelect
      options={options}
      windowThreshold={50}
      placeholder={'Select monster...'}
      classNames={{
        control: () => 'text-sm',
        option: (state) => `select-option ${state.isSelected ? 'selected' : ''} text-xs`,
        input: () => 'select-input'
      }}
      formatOptionLabel={(data, meta) => MonsterOptionLabel(data as MonsterOption, meta)}
      onChange={(v) => {
        store.updateMonster((v as MonsterOption).monster);
      }}
    />
  )
})

export default MonsterSelect;