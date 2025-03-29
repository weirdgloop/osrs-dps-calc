import React, { useMemo } from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';

import { Monster } from '@/types/Monster';
import { CUSTOM_MONSTER_BASE } from '@/lib/Monsters';
import { IconPencilPlus } from '@tabler/icons-react';
import monsterAliases from '@/lib/MonsterAliases';
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
        const remainingVariantGroups: { [k: number]: number[] } = {};
        const remainingVariantMemberships: { [k: number]: number } = {}; // reverse map

        for (const monster of items) {
          if (monster.value === -1) continue;
          const mId = monster.monster.id;
          if (mId === undefined) continue;
          for (const [base, vars] of Object.entries(monsterAliases)) {
            const baseId = parseInt(base);
            if (baseId === mId || vars.includes(mId)) {
              remainingVariantGroups[baseId] = remainingVariantGroups[baseId] ? [...remainingVariantGroups[baseId], mId] : [mId];
              remainingVariantMemberships[mId] = baseId;
            }
          }
        }
        return items.filter((mOpt) => {
          // If there is a search query do not show custom monster
          if (mOpt.value === -1) return !iv;
          const mId = mOpt.monster.id;
          if (mId === undefined) return true;
          const baseId: number | undefined = remainingVariantMemberships[mId];
          if (baseId === mId) return true;
          if (baseId !== undefined) {
            const group = remainingVariantGroups[baseId];
            if (group.includes(mId)) {
              return group.indexOf(mId) === 0 && !items.find((o) => o.monster.id === baseId);
            }
          }
          return true;
        });
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
