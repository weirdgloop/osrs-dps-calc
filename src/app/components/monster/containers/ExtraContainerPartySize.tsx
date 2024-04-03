import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { PARTY_SIZE_REQUIRED_MONSTER_IDS } from '@/lib/constants';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import raidsIcon from '@/public/img/raids_icon.webp';
import NumberInput from '@/app/components/generic/NumberInput';
import ExtraContainerBase, {
  IMonsterContainerChildProps,
} from '@/app/components/monster/containers/ExtraContainerBase';

const ExtraContainerPartySize: React.FC<IMonsterContainerChildProps> = observer((props) => {
  const store = useStore();
  const { monster } = props;
  if (!(PARTY_SIZE_REQUIRED_MONSTER_IDS.includes(monster.id)) || monster.attributes.includes(MonsterAttribute.XERICIAN)) return null;

  return (
    <ExtraContainerBase
      header={(
        <>
          <img src={raidsIcon.src} alt="" className="inline-block" />
          {' '}
          Party size
        </>
      )}
    >
      <NumberInput
        value={monster.inputs.partySize}
        min={1}
        max={100}
        step={1}
        onChange={(v) => store.updateMonster({ inputs: { partySize: v } })}
      />
    </ExtraContainerBase>
  );
});

export default ExtraContainerPartySize;
