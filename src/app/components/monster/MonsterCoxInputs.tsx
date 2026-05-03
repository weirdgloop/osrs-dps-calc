import mining from '@/public/img/bonuses/mining.png';
import raidsIcon from '@/public/img/raids_icon.webp';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMonster } from '@/state/MonsterStore';
import NumberInput from '@/app/components/generic/NumberInput';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import coxCmIcon from '@/public/img/cox_challenge_mode.png';
import Toggle from '@/app/components/generic/Toggle';
import { GUARDIAN_IDS } from '@/lib/constants';

const MonsterCoxCmToggle: React.FC = observer(() => {
  const { inputs, updateInputs } = useMonster();

  return (
    <div>
      <h4 className="font-bold font-serif">
        <img src={coxCmIcon.src} alt="" className="inline-block" />
        {' '}
        Challenge Mode
      </h4>
      <div className="mt-2">
        <Toggle
          checked={inputs.isFromCoxCm}
          setChecked={(c) => updateInputs({ isFromCoxCm: c })}
        />
      </div>
    </div>
  );
});

const MonsterCoxCombatLevelInput: React.FC = observer(() => {
  const { inputs, updateInputs } = useMonster();

  return (
    <>
      <h4 className="font-bold font-serif">
        <img src={raidsIcon.src} alt="" className="inline-block" />
        {' '}
        Party&apos;s highest combat level
      </h4>
      <div className="mt-2">
        <NumberInput
          value={inputs.partyMaxCombatLevel}
          min={3}
          max={126}
          step={1}
          onChange={(v) => updateInputs({ partyMaxCombatLevel: v })}
          required
        />
      </div>
    </>
  );
});

const MonsterCoxMaxHpInput: React.FC = observer(() => {
  const { inputs, updateInputs } = useMonster();

  return (
    <>
      <h4 className="font-bold font-serif">
        <img src={raidsIcon.src} alt="" className="inline-block" />
        {' '}
        Party&apos;s highest HP level
      </h4>
      <div className="mt-2">
        <NumberInput
          value={inputs.partyMaxHpLevel}
          min={1}
          max={99}
          step={1}
          onChange={(v) => updateInputs({ partyMaxHpLevel: v })}
          required
        />
      </div>
    </>
  );
});

const MonsterCoxMiningLevelsInput: React.FC = observer(() => {
  const { monster, inputs, updateInputs } = useMonster();

  if (!GUARDIAN_IDS.includes(monster.id)) {
    return null;
  }

  return (
    <>
      <h4 className="font-bold font-serif">
        <img src={mining.src} alt="" className="inline-block" />
        {' '}
        Party&apos;s sum of mining levels
        {' '}
        <span
          className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
          data-tooltip-id="tooltip"
          data-tooltip-content="Does NOT include 'fake' board-scaling players."
        >
          ?
        </span>
      </h4>
      <div className="mt-2">
        <NumberInput
          value={inputs.partySumMiningLevel}
          min={1}
          max={9900}
          step={1}
          onChange={(v) => updateInputs({ partySumMiningLevel: v })}
          required
        />
      </div>
    </>
  );
});

const MonsterCoxInputs: React.FC = observer(() => {
  const { monster } = useMonster();

  if (!monster.attributes.includes(MonsterAttribute.XERICIAN)) {
    return null;
  }

  return (
    <>
      <MonsterCoxCmToggle />
      <MonsterCoxCombatLevelInput />
      <MonsterCoxMaxHpInput />
      <MonsterCoxMiningLevelsInput />
    </>
  );
});

export default MonsterCoxInputs;
