import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import Select from '@/app/components/generic/Select';
import HelpTooltip from '@/app/components/generic/HelpTooltip';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import { useMonster } from '@/state/MonsterStore';
import { MonsterCombatStyle } from '@/types/Monster';

const COMBAT_STYLE_OPTIONS: { label: string, value: MonsterCombatStyle }[] = [
  { label: 'Crush', value: 'crush' },
  { label: 'Stab', value: 'stab' },
  { label: 'Slash', value: 'slash' },
  { label: 'Magic', value: 'magic' },
  { label: 'Ranged', value: 'ranged' },
];

const CustomMonsterSettings: React.FC = observer(() => {
  const monster = useMonster();
  const {
    style, speed, maxHit, size,
  } = monster.definition;

  if (!monster.isCustom) return null;

  return (
    <>
      <MonsterSetting title="Combat style">
        <Select<typeof COMBAT_STYLE_OPTIONS[0]>
          id="monster-combat-style"
          items={COMBAT_STYLE_OPTIONS}
          value={COMBAT_STYLE_OPTIONS.find((v) => v.value === style)}
          onSelectedItemChange={(i) => monster.updateDefinition({ style: i?.value })}
        />
      </MonsterSetting>
      <MonsterSetting title="Attack speed (ticks)">
        <NumberInput
          value={speed}
          min={1}
          max={20}
          onChange={(s) => monster.updateDefinition({ speed: s })}
          required
        />
      </MonsterSetting>
      <MonsterSetting
        title={(
          <>
            Max hit
            <HelpTooltip content="Overrides the calculated max hit based on the combat stats. Set to 0 to use the calculated value." />
          </>
        )}
      >
        <NumberInput
          value={maxHit || 0}
          min={0}
          max={200}
          onChange={(h) => monster.updateDefinition({ maxHit: h })}
          required
        />
      </MonsterSetting>
      <MonsterSetting title="Size (tiles)">
        <NumberInput
          value={size}
          min={1}
          max={10}
          onChange={(s) => monster.updateDefinition({ size: s })}
          required
        />
      </MonsterSetting>
    </>
  );
});

export default CustomMonsterSettings;
