import { observer } from 'mobx-react-lite';
import React from 'react';
import { useMonster } from '@/state/MonsterStore';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import NumberInput from '@/app/components/generic/NumberInput';

const MonsterCurrentHp: React.FC = observer(() => {
  const {
    scaledMonster,
    inputs,
    updateInputs,
  } = useMonster();

  return (
    <>
      <h4 className="font-bold font-serif">
        <img src={hitpoints.src} alt="" className="inline-block" />
        {' '}
        Monster&apos;s current HP
      </h4>
      <div className="mt-2">
        <NumberInput
          value={inputs.monsterCurrentHp}
          min={0}
          max={scaledMonster.skills.hp}
          step={1}
          onChange={(v) => updateInputs({ monsterCurrentHp: v })}
          required
        />
      </div>
    </>
  );
});

export default MonsterCurrentHp;
