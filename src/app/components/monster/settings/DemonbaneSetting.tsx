import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import demon from '@/public/img/bonuses/demon.png';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { useMonster } from '@/state/MonsterStore';

const DemonbaneSetting: React.FC = observer(() => {
  const monster = useMonster();

  if (!monster.isCustom || !monster.definition.attributes.includes(MonsterAttribute.DEMON)) return null;

  return (
    <MonsterSetting title="Demonbane effectiveness" icon={demon}>
      <NumberInput
        value={monster.inputs.demonbaneVulnerability || 100}
        min={0}
        max={10000}
        step={1}
        onChange={(demonbaneVulnerability) => monster.updateInputs({ demonbaneVulnerability })}
      />
      %
    </MonsterSetting>
  );
});

export default DemonbaneSetting;
