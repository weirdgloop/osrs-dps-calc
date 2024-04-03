import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { TOMBS_OF_AMASCUT_MONSTER_IDS, TOMBS_OF_AMASCUT_PATH_MONSTER_IDS } from '@/lib/constants';
import toaRaidLevel from '@/public/img/toa_raidlevel.webp';
import NumberInput from '@/app/components/generic/NumberInput';
import ExtraContainerBase, {
  IMonsterContainerChildProps,
} from '@/app/components/monster/containers/ExtraContainerBase';

const ExtraContainerTombsOfAmascut: React.FC<IMonsterContainerChildProps> = observer((props) => {
  const store = useStore();
  const { monster } = props;
  if (!TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id)) return null;

  return (
    <>
      <ExtraContainerBase
        header={(
          <>
            <img src={toaRaidLevel.src} alt="" className="inline-block" />
            {' '}
            ToA raid level
          </>
        )}
      >
        <NumberInput
          value={monster.inputs.toaInvocationLevel}
          min={0}
          max={600}
          step={5}
          onChange={(v) => store.updateMonster({ inputs: { toaInvocationLevel: v } })}
        />
      </ExtraContainerBase>
      {(TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(monster.id)) && (
        <ExtraContainerBase
          header={(
            <>
              <img src={toaRaidLevel.src} alt="" className="inline-block" />
              {' '}
              ToA path level
            </>
          )}
        >
          <NumberInput
            value={monster.inputs.toaPathLevel}
            min={0}
            max={6}
            step={1}
            onChange={(v) => store.updateMonster({ inputs: { toaPathLevel: v } })}
          />
        </ExtraContainerBase>
      )}
    </>
  );
});

export default ExtraContainerTombsOfAmascut;
