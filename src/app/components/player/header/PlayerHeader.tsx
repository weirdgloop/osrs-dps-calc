import { observer } from 'mobx-react-lite';
import React from 'react';
import LoadoutName from '@/app/components/player/header/LoadoutName';
import DeleteLoadoutButton from '@/app/components/player/header/DeleteLoadoutButton';
import CombatLevelLabel from '@/app/components/player/header/CombatLevelLabel';
import WikiSyncButton from '@/app/components/player/header/WikiSyncButton';

const PlayerHeader: React.FC = observer(() => (
  <div
    className="px-5 py-3 border-b-body-400 dark:border-b-dark-200 border-b flex justify-between items-center font-serif"
  >
    <div className="min-w-0">
      <LoadoutName />
      <CombatLevelLabel />
    </div>
    <div className="flex gap-1">
      {/* todo(mobx) */}
      {/* <WikiSyncButton /> */}
      <DeleteLoadoutButton />
    </div>
  </div>
));

export default PlayerHeader;
