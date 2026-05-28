import React from 'react';
import { observer } from 'mobx-react-lite';
import Select from '@/app/components/generic/Select';
import { useMonster } from '@/state/MonsterStore';
import { MONSTER_PHASES_BY_ID } from '@/lib/constants';

const MonsterPhaseSelect: React.FC = observer(() => {
  const { monsterBase, updateMonsterBase } = useMonster();

  const phaseOptions = MONSTER_PHASES_BY_ID[monsterBase.id]
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
          placeholder={monsterBase.inputs.phase}
          value={phaseOptions.find((opt) => opt.label === monsterBase.inputs.phase)}
          resetAfterSelect
          onSelectedItemChange={(v) => updateMonsterBase({ inputs: { phase: v?.label } })}
        />
      </div>
    </>
  );
});

export default MonsterPhaseSelect;
