import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import raidsIcon from '@/public/img/raids_icon.webp';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { PARTY_SIZE_REQUIRED_MONSTER_IDS } from '@/lib/constants';
import { useMonster } from '@/state/MonsterStore';

const PartySizeSetting: React.FC = observer(() => {
  const monster = useMonster();

  if (!PARTY_SIZE_REQUIRED_MONSTER_IDS.includes(monster.id) && !monster.definition.attributes.includes(MonsterAttribute.XERICIAN)) {
    return null;
  }

  return (
    <MonsterSetting title="Party size" icon={raidsIcon}>
      <NumberInput
        value={monster.inputs.partySize}
        min={1}
        max={100}
        step={1}
        onChange={(partySize) => monster.updateInputs({ partySize })}
        required
      />
    </MonsterSetting>
  );
});

export default PartySizeSetting;
