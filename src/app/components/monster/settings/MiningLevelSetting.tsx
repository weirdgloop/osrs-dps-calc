import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import HelpTooltip from '@/app/components/generic/HelpTooltip';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import mining from '@/public/img/bonuses/mining.png';
import { GUARDIAN_IDS } from '@/lib/constants';
import { useMonster } from '@/state/MonsterStore';

const MiningLevelSetting: React.FC = observer(() => {
  const monster = useMonster();

  if (!GUARDIAN_IDS.includes(monster.id)) return null;

  return (
    <MonsterSetting
      title={(
        <>
          Party&apos;s sum of mining levels
          {' '}
          <HelpTooltip content="Does NOT include 'fake' board-scaling players." />
        </>
      )}
      icon={mining}
    >
      <NumberInput
        value={monster.inputs.partySumMiningLevel}
        min={1}
        max={9900}
        step={1}
        onChange={(partySumMiningLevel) => monster.updateInputs({ partySumMiningLevel })}
        required
      />
    </MonsterSetting>
  );
});

export default MiningLevelSetting;
