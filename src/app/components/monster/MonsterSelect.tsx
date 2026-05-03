import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconPencilPlus } from '@tabler/icons-react';
import { CUSTOM_MONSTER_ID } from '@/lib/constants';
import { useMonsterDb } from '@/db/MonsterDb';
import { useMonster } from '@/state/MonsterStore';
import Combobox from '../generic/Combobox';

interface MonsterOption {
  label: string;
  value: number;
  version: string;
}

const MonsterSelect: React.FC = observer(() => {
  const { monsterEntries } = useMonsterDb();
  const { loadMonster } = useMonster();

  const options: MonsterOption[] = [
    {
      label: 'Create custom monster',
      value: CUSTOM_MONSTER_ID,
      version: '',
    },
    ...monsterEntries.map(({ name, id }): MonsterOption => ({
      label: `${name}`,
      value: id,
      version: '',
    })),
  ];

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
          loadMonster(item.value);
        }
      }}
      CustomItemComponent={({ item }) => {
        const i = item;

        // Handle custom monster option
        if (i.value === CUSTOM_MONSTER_ID) {
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
