import { observer } from 'mobx-react-lite';
import React from 'react';
import { useMonster } from '@/state/MonsterStore';
import NumberInput from '@/app/components/generic/NumberInput';
import demon from '@/public/img/bonuses/demon.png';
import { MonsterAttribute } from '@/enums/MonsterAttribute';

const MonsterDemonbaneInput: React.FC = observer(() => {
  const {
    monster, inputs, isCustomMonster, updateInputs,
  } = useMonster();

  if (!monster.attributes.includes(MonsterAttribute.DEMON)) {
    return null;
  }

  return (
    <>
      <h4 className="font-bold font-serif">
        <img src={demon.src} alt="" className="inline-block" />
        {' '}
        Demonbane effectiveness
      </h4>
      <div className="mt-2">
        <NumberInput
          disabled={!isCustomMonster}
          value={inputs.demonbaneVulnerability ?? 100}
          min={0}
          max={1000}
          step={1}
          onChange={(v) => updateInputs({ demonbaneVulnerability: v })}
        />
        %
      </div>
    </>
  );
});

export default MonsterDemonbaneInput;
