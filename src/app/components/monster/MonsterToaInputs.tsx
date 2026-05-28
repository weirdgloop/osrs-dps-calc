import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMonster } from '@/state/MonsterStore';
import { TOMBS_OF_AMASCUT_MONSTER_IDS, TOMBS_OF_AMASCUT_PATH_MONSTER_IDS } from '@/lib/constants';
import toaRaidLevel from '@/public/img/toa_raidlevel.webp';
import NumberInput from '@/app/components/generic/NumberInput';

const MonsterToaPathInput: React.FC = observer(() => {
  const { monsterBase, updateMonsterBase } = useMonster();

  if (!TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(monsterBase.id)) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="font-bold font-serif">
        <img src={toaRaidLevel.src} alt="" className="inline-block" />
        {' '}
        ToA path level
      </h4>
      <div className="mt-2">
        <NumberInput
          value={monsterBase.inputs.toaPathLevel}
          min={0}
          max={6}
          step={1}
          onChange={(v) => updateMonsterBase({ inputs: { toaPathLevel: v } })}
          required
        />
      </div>
    </div>
  );
});

const MonsterToaInvocationLevelInput: React.FC = observer(() => {
  const { monsterBase, updateMonsterBase } = useMonster();

  return (
    <div>
      <h4 className="font-bold font-serif">
        <img src={toaRaidLevel.src} alt="" className="inline-block" />
        {' '}
        ToA raid level
      </h4>
      <div className="mt-2">
        <NumberInput
          value={monsterBase.inputs.toaInvocationLevel}
          min={0}
          max={700}
          step={5}
          onChange={(v) => updateMonsterBase({ inputs: { toaInvocationLevel: v } })}
          required
        />
      </div>
    </div>
  );
});

const MonsterToaInputs: React.FC = observer(() => {
  const { monsterBase } = useMonster();

  if (TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monsterBase.id)) {
    return null;
  }

  return (
    <>
      <MonsterToaInvocationLevelInput />
      <MonsterToaPathInput />
    </>
  );
});

export default MonsterToaInputs;
