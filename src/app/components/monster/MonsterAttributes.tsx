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
    monster,
    isCustomMonster,
    updateMonster,
  } = useMonster();

  const isSelected = monster.attributes.includes(attr);

  return (
    <button
      type="button"
      disabled={!isCustomMonster}
      className={`rounded px-1 transition-[background,color] ${isSelected ? 'bg-blue-600 text-white' : 'bg-body-400 dark:bg-dark-200 opacity-50 dark:opacity-25 hover:enabled:bg-body-200 dark:hover:enabled:bg-dark-200'}`}
      onClick={() => updateMonster({ attributes: toggleArrayMembership(monster.attributes, attr) })}
    >
      {attr}
    </button>
  );
});

const MonsterAttributes: React.FC = observer(() => (
  <>
    {Object.values(MonsterAttribute)
      .map((attr) => (
        <MonsterAttributeButton key={attr} attr={attr} />
      ))}
  </>
));

export default MonsterAttributes;
