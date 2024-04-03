import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import coxCmIcon from '@/public/img/cox_challenge_mode.png';
import Toggle from '@/app/components/generic/Toggle';
import raidsIcon from '@/public/img/raids_icon.webp';
import NumberInput from '@/app/components/generic/NumberInput';
import { GUARDIAN_IDS } from '@/lib/constants';
import mining from '@/public/img/bonuses/mining.png';
import ExtraContainerBase, {
  IMonsterContainerChildProps,
} from '@/app/components/monster/containers/ExtraContainerBase';

const ExtraContainerChambersOfXeric: React.FC<IMonsterContainerChildProps> = observer((props) => {
  const store = useStore();
  const { monster } = props;
  if (!monster.attributes.includes(MonsterAttribute.XERICIAN)) return null;

  return (
    <>
      <ExtraContainerBase
        header={(
          <>
            <img src={coxCmIcon.src} alt="" className="inline-block" />
            {' '}
            Challenge Mode
          </>
        )}
      >
        <Toggle
          checked={monster.inputs.isFromCoxCm}
          setChecked={(c) => store.updateMonster({ inputs: { isFromCoxCm: c } })}
        />
      </ExtraContainerBase>
      <ExtraContainerBase
        header={(
          <>
            <img src={raidsIcon.src} alt="" className="inline-block" />
            {' '}
            Party&apos;s highest combat level
          </>
        )}
      >
        <NumberInput
          value={monster.inputs.partyMaxCombatLevel}
          min={3}
          max={126}
          step={1}
          onChange={(v) => store.updateMonster({ inputs: { partyMaxCombatLevel: v } })}
        />
      </ExtraContainerBase>
      <ExtraContainerBase
        header={(
          <>
            <img src={raidsIcon.src} alt="" className="inline-block" />
            {' '}
            Party&apos;s highest HP level
          </>
        )}
      >
        <NumberInput
          value={monster.inputs.partyMaxHpLevel}
          min={1}
          max={99}
          step={1}
          onChange={(v) => store.updateMonster({ inputs: { partyMaxHpLevel: v } })}
        />
      </ExtraContainerBase>
      {(GUARDIAN_IDS.includes(monster.id)) && (
        <ExtraContainerBase
          header={(
            <>
              <img src={mining.src} alt="" className="inline-block" />
              {' '}
              Party&apos;s average mining level
            </>
          )}
        >
          <NumberInput
            value={monster.inputs.partyAvgMiningLevel}
            min={1}
            max={99}
            step={1}
            onChange={(v) => store.updateMonster({ inputs: { partyAvgMiningLevel: v } })}
          />
        </ExtraContainerBase>
      )}
    </>
  );
});

export default ExtraContainerChambersOfXeric;
