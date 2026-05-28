import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useLoadouts } from '@/state/LoadoutStore';

const LoadoutTabButton: React.FC<{ index: number, loadoutId: number, }> = observer(({ index, loadoutId }) => {
  const { selectedLoadout, selectLoadout } = useLoadouts();

  const active = selectedLoadout === loadoutId;

  return (
    <button
      type="button"
      className={`min-w-[40px] text-left first:md:rounded-tl px-4 py-1 border-l-2 first:border-l-0 last:rounded-tr border-dark-300 transition-colors ${active ? 'bg-orange-700' : 'bg-dark-400'}`}
      onClick={() => selectLoadout(loadoutId)}
    >
      {index + 1}
    </button>
  );
});

const NewLoadoutButton: React.FC = observer(() => {
  const { canCreateLoadout, createLoadout } = useLoadouts();

  return (
    <div>
      <button
        type="button"
        disabled={!canCreateLoadout}
        onClick={() => createLoadout()}
        className="disabled:cursor-not-allowed text-dark-100 disabled:text-dark-500 hover:text-green transition-colors"
        data-tooltip-id="tooltip"
        data-tooltip-content="Add new loadout"
      >
        <IconPlus aria-label="Add new loadout" />
      </button>
    </div>
  );
});

const LoadoutTabSelector: React.FC = observer(() => {
  const { loadouts } = useLoadouts();

  return (
    <div
      className="sm:rounded sm:rounded-b-none text-sm font-bold font-serif flex gap-2 items-center bg-transparent text-white border-b-4 border-orange-700"
    >
      <div className="my-1 flex h-full">
        {[...loadouts.keys()].map((loadoutId, index) => (
          <LoadoutTabButton key={loadoutId} loadoutId={loadoutId} index={index} />
        ))}
      </div>
      <NewLoadoutButton />
    </div>
  );
});

export default LoadoutTabSelector;
