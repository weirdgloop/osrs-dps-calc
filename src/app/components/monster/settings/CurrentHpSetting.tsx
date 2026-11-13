import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import { useMonster } from '@/state/MonsterStore';

const CurrentHpSetting: React.FC = observer(() => {
  const monster = useMonster();

  return (
    <MonsterSetting title="Monster's current HP" icon={hitpoints}>
      <NumberInput
        value={monster.inputs.monsterCurrentHp}
        min={0}
        max={monster.maxHp}
        step={1}
        onChange={(monsterCurrentHp) => monster.updateInputs({ monsterCurrentHp })}
        required
      />
    </MonsterSetting>
  );
});

export default CurrentHpSetting;
