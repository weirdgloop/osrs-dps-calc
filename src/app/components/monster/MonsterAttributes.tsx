import React from 'react';
import { observer } from 'mobx-react-lite';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { useMonster } from '@/state/MonsterStore';
import { toggleArrayMembership } from '@/utils';

interface PresetAttributeButtonProps {
  attr: MonsterAttribute;
}

const MonsterAttributeButton: React.FC<PresetAttributeButtonProps> = observer(({ attr }) => {
  const {
    monsterBase,
    isCustomMonster,
    updateMonsterBase,
  } = useMonster();

  const isSelected = monsterBase.attributes.includes(attr);

  return (
    <button
      type="button"
      disabled={!isCustomMonster}
      className={`rounded px-1 transition-[background,color] ${isSelected ? 'bg-blue-600 text-white' : 'bg-dark-200 opacity-25 hover:enabled:bg-dark-200'}`}
      onClick={() => updateMonsterBase({ attributes: toggleArrayMembership(monsterBase.attributes, attr) })}
    >
      {attr}
    </button>
  );
});

const MonsterAttributes: React.FC = observer(() => (
  <div className="py-2 px-2 flex flex-wrap gap-1.5">
    {Object.values(MonsterAttribute)
      .map((attr) => (
        <MonsterAttributeButton key={attr} attr={attr} />
      ))}
  </div>
));

export default MonsterAttributes;
