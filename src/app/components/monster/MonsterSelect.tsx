import React, { useMemo } from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';

import { Monster } from '@/types/Monster';
import Combobox from '../generic/Combobox';

interface MonsterOption {
  label: string;
  value: number;
  version: string;
  monster: Partial<Monster>;
}

const MonsterSelect: React.FC = observer(() => {
  const store = useStore();
  const { availableMonsters } = store;

  const options: MonsterOption[] = useMemo(() => availableMonsters.map((m, i) => ({
    label: `${m.name}`,
    value: i,
    version: m.version || '',
    monster: {
      ...m,
      monsterCurrentHp: m.skills.hp,
    },
  })), [availableMonsters]);

  return (
    <Combobox<MonsterOption>
      id="monster-select"
      className="w-full"
      items={options}
      placeholder="Search for monster..."
      resetAfterSelect
      blurAfterSelect
      onSelectedItemChange={(item) => {
        if (item) {
          store.updateMonster(item.monster);
        }
      }}
      CustomItemComponent={({ item }) => {
        const i = item;

        return (
          <div>
            {i.label}
            {i.version && (
            <span className="monster-version text-xs text-gray-400 dark:text-gray-300">
              #
              {i.version}
            </span>
            )}
          </div>
        );
      }}
    />
  );
});

export default MonsterSelect;
