import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import raidsIcon from '@/public/img/raids_icon.webp';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { useMonster } from '@/state/MonsterStore';

const CoxPartyLevelSettings: React.FC = observer(() => {
  const monster = useMonster();

  if (!monster.definition.attributes.includes(MonsterAttribute.XERICIAN)) return null;

  return (
    <>
      <MonsterSetting title="Party's highest combat level" icon={raidsIcon}>
        <NumberInput
          value={monster.inputs.partyMaxCombatLevel}
          min={3}
          max={126}
          step={1}
          onChange={(partyMaxCombatLevel) => monster.updateInputs({ partyMaxCombatLevel })}
          required
        />
      </MonsterSetting>
      <MonsterSetting title="Party's highest HP level" icon={raidsIcon}>
        <NumberInput
          value={monster.inputs.partyMaxHpLevel}
          min={1}
          max={99}
          step={1}
          onChange={(partyMaxHpLevel) => monster.updateInputs({ partyMaxHpLevel })}
          required
        />
      </MonsterSetting>
    </>
  );
});

export default CoxPartyLevelSettings;
