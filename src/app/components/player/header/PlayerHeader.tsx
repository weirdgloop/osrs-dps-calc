import React from 'react';
import { observer } from 'mobx-react-lite';
import LoadoutName from '@/app/components/player/header/LoadoutName';
import CombatLevelLabel from '@/app/components/player/header/CombatLevelLabel';
import WikiSync from '@/app/components/player/header/WikiSync';
import DeleteLoadoutButton from '@/app/components/player/header/DeleteLoadoutButton';
import { usePlayer } from '@/state/PlayerStore';

const PlayerHeader: React.FC = observer(() => {
  const player = usePlayer();

  return (
    <div
      className="px-5 py-3 border-b-body-400 dark:border-b-dark-200 border-b flex justify-between items-center font-serif"
    >
      <div className="min-w-0">
        {/* the key discards any half-finished rename when another loadout is selected */}
        <LoadoutName key={player.uuid} />
        <CombatLevelLabel />
      </div>
      <div className="flex gap-1">
        <WikiSync />
        <DeleteLoadoutButton />
      </div>
    </div>
  );
});

export default PlayerHeader;
