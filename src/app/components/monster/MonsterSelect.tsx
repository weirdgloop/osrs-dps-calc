import React, { useMemo } from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';

import { Monster } from '@/types/Monster';
import { CUSTOM_MONSTER_BASE } from '@/lib/Monsters';
import { IconPencilPlus } from '@tabler/icons-react';
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

  const options: MonsterOption[] = useMemo(() => [
    {
      label: 'Create custom monster',
      value: -1,
      version: '',
      monster: { ...CUSTOM_MONSTER_BASE },
    },
    ...availableMonsters.map((m, i) => ({
      label: `${m.name}`,
      value: i,
      version: m.version || '',
      monster: {
        ...m,
      },
    })),
  ], [availableMonsters]);

  return (
    <Combobox<MonsterOption>
      id="monster-select"
      className="w-full"
      items={options}
      placeholder="Search for monster..."
      resetAfterSelect
      blurAfterSelect
      customFilter={(items, iv) => {
        if (!iv) return items;
        // When searching, don't show the custom monster option in the results
        return items.filter((i) => i.value !== -1);
      }}
      onSelectedItemChange={(item) => {
        if (item) {
          store.updateMonster(item.monster);
        }
      }}
      CustomItemComponent={({ item }) => {
        const i = item;

        // Handle custom monster option
        if (i.value === -1) {
          return (
            <div className="text-gray-300 flex gap-1 items-center italic">
              <IconPencilPlus size={14} />
              {i.label}
            </div>
          );
        }

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
