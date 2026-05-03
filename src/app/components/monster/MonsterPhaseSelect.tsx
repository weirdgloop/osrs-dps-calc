import React from 'react';
import { observer } from 'mobx-react-lite';
import Select from '@/app/components/generic/Select';
import { useMonster } from '@/state/MonsterStore';
import { MONSTER_PHASES_BY_ID } from '@/lib/constants';

const MonsterPhaseSelect: React.FC = observer(() => {
  const { monster, inputs, updateInputs } = useMonster();

  const phaseOptions = MONSTER_PHASES_BY_ID[monster.id]
    ?.map((phase) => ({ label: phase, value: phase }));

  if (!phaseOptions) {
    return null;
  }

  return (

    <>
      <h4 className="font-bold font-serif">
        Phase
      </h4>
      <div className="mt-2">
        <Select
          id="presets"
          items={phaseOptions}
          placeholder={inputs.phase}
          value={phaseOptions.find((opt) => opt.label === inputs.phase)}
          resetAfterSelect
          onSelectedItemChange={(v) => updateInputs({ phase: v?.label })}
        />
      </div>
    </>
  );
});

export default MonsterPhaseSelect;
