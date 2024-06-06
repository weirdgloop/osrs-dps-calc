import { MonsterAttribute } from '@/enums/MonsterAttribute';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';

interface PresetAttributeButtonProps {
  attr: MonsterAttribute;
}

const PresetAttributeButton: React.FC<PresetAttributeButtonProps> = observer((props) => {
  const store = useStore();
  const { monster } = store;
  const { attr } = props;

  const isSelected = monster.attributes.includes(attr);
  const isCustomMonster = monster.id === -1;

  return (
    <button
      type="button"
      disabled={!isCustomMonster}
      className={`rounded px-1 transition-[background,color] ${isSelected ? 'bg-blue-600 text-white' : 'bg-body-400 dark:bg-dark-200 opacity-50 dark:opacity-25 hover:enabled:bg-body-200 dark:hover:enabled:bg-dark-200'}`}
      onClick={() => store.toggleMonsterAttribute(attr)}
    >
      {attr}
    </button>
  );
});

export default PresetAttributeButton;
