import React from 'react';
import { Monster } from '@/types/Monster';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import NumberInput from '@/app/components/generic/NumberInput';
import ExtraContainerBase, {
  IMonsterContainerChildProps,
} from '@/app/components/monster/containers/ExtraContainerBase';

const ExtraContainerMonsterCurrentHp: React.FC<IMonsterContainerChildProps & { displayMonster: Monster }> = observer((props) => {
  const store = useStore();
  const { monster, displayMonster } = props;
  if (!store.usesMonsterCurrentHp) return null;

  return (
    <ExtraContainerBase
      header={(
        <>
          <img src={hitpoints.src} alt="" className="inline-block" />
          {' '}
          Monster&apos;s Current HP
        </>
      )}
    >
      <NumberInput
        value={monster.inputs.monsterCurrentHp}
        min={0}
        max={displayMonster.skills.hp}
        step={1}
        onChange={(v) => store.updateMonster({ inputs: { monsterCurrentHp: v } })}
      />
    </ExtraContainerBase>
  );
});

export default ExtraContainerMonsterCurrentHp;
