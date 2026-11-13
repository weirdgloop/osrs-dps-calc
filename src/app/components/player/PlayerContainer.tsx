import React from 'react';
import LoadoutTabs from '@/app/components/player/loadouts/LoadoutTabs';
import PlayerHeader from '@/app/components/player/header/PlayerHeader';
import PlayerInnerContainer from '@/app/components/player/PlayerInnerContainer';

const PlayerContainer: React.FC = () => (
  <div className="flex flex-col w-[350px]">
    <LoadoutTabs />
    <div
      className="bg-tile sm:rounded-b-lg dark:bg-dark-300 text-black dark:text-white shadow-lg flex flex-col"
    >
      <PlayerHeader />
      <PlayerInnerContainer />
    </div>
  </div>
);

export default PlayerContainer;
