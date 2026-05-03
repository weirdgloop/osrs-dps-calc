import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import React from 'react';
import Select from '@/app/components/generic/Select';
import { Monster } from '@/types/Monster';
import { useMonster } from '@/state/MonsterStore';

const COMBAT_STYLE_OPTIONS: { label: string, value: Monster['style'] }[] = [
  {
    label: 'Crush',
    value: 'crush',
  },
  {
    label: 'Stab',
    value: 'stab',
  },
  {
    label: 'Slash',
    value: 'slash',
  },
  {
    label: 'Magic',
    value: 'magic',
  },
  {
    label: 'Ranged',
    value: 'ranged',
  },
];

const MonsterCombatStyle: React.FC = observer(() => {
  const { monster, updateMonster } = useMonster();

  return (
    <>
      <h4 className="font-bold font-serif">
        Combat style
      </h4>
      <div className="mt-2">
        <Select<typeof COMBAT_STYLE_OPTIONS[0]>
          id="monster-combat-style"
          items={COMBAT_STYLE_OPTIONS}
          value={COMBAT_STYLE_OPTIONS.find((v) => v.value === monster.style)}
          onSelectedItemChange={(i) => updateMonster({ style: i?.value })}
        />
      </div>
    </>
  );
});

const MonsterAttackSpeed: React.FC = observer(() => {
  const { monster, updateMonster } = useMonster();

  return (
    <div key="attack-speed">
      <h4 className="font-bold font-serif">
        Attack speed (ticks)
      </h4>
      <div className="mt-2">
        <NumberInput
          value={monster.speed}
          min={1}
          max={20}
          onChange={(s) => updateMonster({ speed: s })}
          required
        />
      </div>
    </div>
  );
});

const MonsterSize: React.FC = observer(() => {
  const { monster, updateMonster } = useMonster();

  return (
    <div key="monster-size">
      <h4 className="font-bold font-serif">
        Size (tiles)
      </h4>
      <div className="mt-2">
        <NumberInput
          value={monster.size}
          min={1}
          max={10}
          onChange={(s) => updateMonster({ size: s })}
          required
        />
      </div>
    </div>
  );
});

const CustomMonsterInputs: React.FC = observer(() => {
  const { isCustomMonster } = useMonster();

  if (!isCustomMonster) {
    return null;
  }

  return (
    <>
      <MonsterCombatStyle />
      <MonsterAttackSpeed />
      <MonsterSize />
    </>
  );
});

export default CustomMonsterInputs;
