import React from 'react';
import { IconPencilPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMonster } from '@/state/MonsterStore';
import Combobox from '@/app/components/generic/Combobox';
import { MONSTER_GROUPS, monsterGroupFor, MonsterGroup } from '@/lib/MonsterForms';

interface MonsterOption {
  label: string;
  version?: string;
  value: number;
  // null for custom monster
  group: MonsterGroup | null;
}

const CUSTOM_OPTION_VALUE = -1;

const MONSTER_OPTIONS: MonsterOption[] = [
  {
    label: 'Create custom monster',
    value: CUSTOM_OPTION_VALUE,
    group: null,
  },
  ...MONSTER_GROUPS.map((group, i) => ({
    label: group.name,
    version: group.searchText,
    value: i,
    group,
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

  return <div>{item.label}</div>;
};

const MonsterSelect: React.FC = observer(() => {
  const monster = useMonster();

  return (
    <Combobox<MonsterOption>
      id="monster-select"
      className="w-full"
      items={MONSTER_OPTIONS}
      value={monster.isCustom ? '' : monsterGroupFor(monster.definition.name)?.name ?? ''}
      placeholder="Search for monster..."
      blurAfterSelect
      customFilter={(items, iv) => {
        if (!iv) return items;
        // When searching, don't show the custom monster option in the results
        return items.filter((i) => i.value !== CUSTOM_OPTION_VALUE);
      }}
      onSelectedItemChange={(item) => {
        if (!item) return;
        if (item.group) {
          monster.select(item.group.forms[0].monster);
        } else {
          monster.selectCustom();
        }
      }}
      CustomItemComponent={MonsterOptionLabel}
    />
  );
});

export default MonsterSelect;
