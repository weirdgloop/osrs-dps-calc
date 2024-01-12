import React, {useMemo} from 'react';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';

import Combobox from '../generic/Combobox';
import {getMonsterOptions, MonsterOption} from "@/lib/MonsterOptions";

const MonsterSelect: React.FC = observer(() => {
  const store = useStore();

  const options: MonsterOption[] = useMemo(() => getMonsterOptions(), [])

  return (
    <Combobox<MonsterOption>
      id={'monster-select'}
      className={'w-full'}
      items={options}
      placeholder={'Search for monster...'}
      resetAfterSelect={true}
      blurAfterSelect={true}
      onSelectedItemChange={(item) => {
        if (item) {
          store.updateMonster(item.monster)
        }
      }}
      CustomItemComponent={({item}) => {
        let i = item;

        return (
            <div>
              {i.label}
              {i.version && <span className={'monster-version text-xs text-gray-400 dark:text-gray-300'}>#{i.version}</span>}
            </div>
        )
      }}
    />
  )
})

export default MonsterSelect;
