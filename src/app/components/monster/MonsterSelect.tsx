import React from 'react';
import { IconPencilPlus } from '@tabler/icons-react';
import { availableMonsters, MonsterDefinition, useMonster } from '@/state/MonsterStore';
import Combobox from '@/app/components/generic/Combobox';

interface MonsterOption {
  label: string;
  value: number;
  version: string;
  // null for custom monster
  monster: MonsterDefinition | null;
}

const CUSTOM_OPTION_VALUE = -1;

const MONSTER_OPTIONS: MonsterOption[] = [
  {
    label: 'Create custom monster',
    value: CUSTOM_OPTION_VALUE,
    version: '',
    monster: null,
  },
  ...availableMonsters.map((m, i) => ({
    label: `${m.name}`,
    value: i,
    version: m.version || '',
    monster: m,
  })),
];

const MonsterOptionLabel: React.FC<{ item: MonsterOption }> = ({ item }) => {
  if (item.value === CUSTOM_OPTION_VALUE) {
    return (
      <div className="text-gray-300 flex gap-1 items-center italic">
        <IconPencilPlus size={14} />
        {item.label}
      </div>
    );
  }

  return (
    <div>
      {item.label}
      {item.version && (
        <span className="monster-version text-xs text-gray-400 dark:text-gray-300">
          #
          {item.version}
        </span>
      )}
    </div>
  );
};

const MonsterSelect: React.FC = () => {
  const monster = useMonster();

  return (
    <Combobox<MonsterOption>
      id="monster-select"
      className="w-full"
      items={MONSTER_OPTIONS}
      placeholder="Search for monster..."
      resetAfterSelect
      blurAfterSelect
      customFilter={(items, iv) => {
        if (!iv) return items;
        // When searching, don't show the custom monster option in the results
        return items.filter((i) => i.value !== CUSTOM_OPTION_VALUE);
      }}
      onSelectedItemChange={(item) => {
        if (!item) return;
        if (item.monster) {
          monster.select(item.monster);
        } else {
          monster.selectCustom();
        }
      }}
      CustomItemComponent={MonsterOptionLabel}
    />
  );
};

export default MonsterSelect;
