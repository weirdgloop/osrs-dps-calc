import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import Select from '@/app/components/generic/Select';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import { useMonster } from '@/state/MonsterStore';

const PhaseSetting: React.FC = observer(() => {
  const monster = useMonster();
  const { phases } = monster;
  const { phase } = monster.inputs;
  const options = useMemo(() => phases?.map((label) => ({ label })), [phases]);

  if (!options) return null;

  return (
    <MonsterSetting title="Phase" className="w-full">
      <Select
        id="presets"
        items={options}
        placeholder={phase}
        value={options.find((opt) => opt.label === phase)}
        resetAfterSelect
        onSelectedItemChange={(v) => monster.updateInputs({ phase: v?.label })}
      />
    </MonsterSetting>
  );
});

export default PhaseSetting;
