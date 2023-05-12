import React from 'react';
import monsters from '@/lib/monsters.json';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';

import {Monster} from '@/types/Monster';
import Combobox from '../generic/Combobox';

interface MonsterOption {
  label: string;
  value: number;
  version: string;
  monster: Monster;
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
    <Combobox
      className={'w-full'}
      items={options}
      placeholder={'Search for monster...'}
      resetAfterSelect={true}
      onSelectedItemChange={(item) => {
        if (item) {
          const val = item as MonsterOption;
          store.updateMonster(val.monster)
        }
      }}
      CustomItemComponent={({item}) => {
        let i = item as MonsterOption;

        return (
          <div className={'flex items-center gap-0'}>
            <div>{i.label}</div>
            {i.version && <div className={'monster-version relative top-[1px] text-xs text-gray-400'}>#{i.version}</div>}
          </div>
        )
      }}
    />
  )
})

export default MonsterSelect;