import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLoadouts } from '@/state/LoadoutStore';
import { PlayerStore } from '@/state/PlayerStore';

interface LoadoutTabProps {
  loadout: PlayerStore;
  index: number;
}

const LoadoutTab: React.FC<LoadoutTabProps> = observer(({ loadout, index }) => {
  const loadouts = useLoadouts();
  const isSelected = loadouts.selectedUuid === loadout.uuid;

  return (
    <button
      type="button"
      className={`min-w-[40px] text-left first:md:rounded-tl px-4 py-1 border-l-2 first:border-l-0 last:rounded-tr border-body-100 dark:border-dark-300 transition-colors ${isSelected ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-400'}`}
      onClick={() => loadouts.select(loadout.uuid)}
    >
      {index + 1}
    </button>
  );
});

export default LoadoutTab;
