import React from 'react';
import { observer } from 'mobx-react-lite';
import LoadoutTab from '@/app/components/player/loadouts/LoadoutTab';
import AddLoadoutButton from '@/app/components/player/loadouts/AddLoadoutButton';
import { useLoadouts } from '@/state/LoadoutStore';

const LoadoutTabs: React.FC = observer(() => {
  const loadouts = useLoadouts();

  return (
    <div
      className="sm:rounded sm:rounded-b-none text-sm font-bold font-serif flex gap-2 items-center bg-transparent text-white border-b-4 border-orange-300 dark:border-orange-700"
    >
      <div className="my-1 flex h-full">
        {loadouts.loadouts.map((loadout, index) => (
          <LoadoutTab key={loadout.uuid} loadout={loadout} index={index} />
        ))}
      </div>
      <div>
        <AddLoadoutButton />
      </div>
    </div>
  );
});

export default LoadoutTabs;
