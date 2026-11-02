import React from 'react';
import { observer } from 'mobx-react-lite';
import Toggle from '@/app/components/generic/Toggle';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import coxCmIcon from '@/public/img/cox_challenge_mode.png';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { useMonster } from '@/state/MonsterStore';

const CoxChallengeModeSetting: React.FC = observer(() => {
  const monster = useMonster();

  if (!monster.definition.attributes.includes(MonsterAttribute.XERICIAN)) return null;

  return (
    <MonsterSetting title="Challenge Mode" icon={coxCmIcon}>
      <Toggle
        checked={monster.inputs.isFromCoxCm}
        setChecked={(isFromCoxCm) => monster.updateInputs({ isFromCoxCm })}
      />
    </MonsterSetting>
  );
});

export default CoxChallengeModeSetting;
