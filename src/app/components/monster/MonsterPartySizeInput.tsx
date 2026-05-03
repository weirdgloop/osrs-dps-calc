import raidsIcon from '@/public/img/raids_icon.webp';
import NumberInput from '@/app/components/generic/NumberInput';
import { PARTY_SIZE_REQUIRED_MONSTER_IDS } from '@/lib/constants';
import { useMonster } from '@/state/MonsterStore';
import { observer } from 'mobx-react-lite';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import React from 'react';

const MonsterPartySizeInput: React.FC = observer(() => {
  const { monster, inputs, updateInputs } = useMonster();

  if (!PARTY_SIZE_REQUIRED_MONSTER_IDS.includes(monster.id)
    && !monster.attributes.includes(MonsterAttribute.XERICIAN)) {
    return null;
  }

  return (
    <>
      <h4 className="font-bold font-serif">
        <img src={raidsIcon.src} alt="" className="inline-block" />
        {' '}
        Party size
      </h4>
      <div className="mt-2">
        <NumberInput
          value={inputs.partySize}
          min={1}
          max={100}
          step={1}
          onChange={(v) => updateInputs({ partySize: v })}
          required
        />
      </div>
    </>
  );
});

export default MonsterPartySizeInput;
