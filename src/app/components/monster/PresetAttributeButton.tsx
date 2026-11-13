import React from 'react';
import { observer } from 'mobx-react-lite';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { useMonster } from '@/state/MonsterStore';

interface PresetAttributeButtonProps {
  attr: MonsterAttribute;
}

const PresetAttributeButton: React.FC<PresetAttributeButtonProps> = observer(({ attr }) => {
  const monster = useMonster();
  const isSelected = monster.definition.attributes.includes(attr);

  return (
    <button
      type="button"
      disabled={!monster.isCustom}
      className={`rounded px-1 transition-[background,color] ${isSelected ? 'bg-blue-600 text-white' : 'bg-body-400 dark:bg-dark-200 opacity-50 dark:opacity-25 hover:enabled:bg-body-200 dark:hover:enabled:bg-dark-200'}`}
      onClick={() => monster.toggleAttribute(attr)}
    >
      {attr}
    </button>
  );
});

export default PresetAttributeButton;
