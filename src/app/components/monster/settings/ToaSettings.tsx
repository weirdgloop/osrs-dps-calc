import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import MonsterSetting from '@/app/components/monster/settings/MonsterSetting';
import toaRaidLevel from '@/public/img/toa_raidlevel.webp';
import { TOMBS_OF_AMASCUT_MONSTER_IDS, TOMBS_OF_AMASCUT_PATH_MONSTER_IDS } from '@/lib/constants';
import { useMonster } from '@/state/MonsterStore';

const ToaSettings: React.FC = observer(() => {
  const monster = useMonster();

  if (!TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id) && !monster.isCustom) return null;

  return (
    <>
      <MonsterSetting title="ToA raid level" icon={toaRaidLevel}>
        <NumberInput
          value={monster.inputs.toaInvocationLevel}
          min={0}
          max={700}
          step={5}
          onChange={(toaInvocationLevel) => monster.updateInputs({ toaInvocationLevel })}
          required
        />
      </MonsterSetting>
      {TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(monster.id) && (
        <MonsterSetting title="ToA path level" icon={toaRaidLevel} className="mt-4">
          <NumberInput
            value={monster.inputs.toaPathLevel}
            min={0}
            max={6}
            step={1}
            onChange={(toaPathLevel) => monster.updateInputs({ toaPathLevel })}
            required
          />
        </MonsterSetting>
      )}
    </>
  );
});

export default ToaSettings;
