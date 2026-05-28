import React from 'react';
import { observer } from 'mobx-react-lite';
import PlayerHeader from '@/app/components/player/header/PlayerHeader';
import LoadoutTabSelector from '@/app/components/player/LoadoutTabSelector';
import { PlayerTab, useUIState } from '@/state/UIStateStore';
import CombatOptions from '@/app/components/player/combat/CombatOptions';
// import DemonicPactsLeague from '@/app/components/player/demonicPactsLeague/DemonicPactsLeague';
import ExtraOptions from '@/app/components/player/ExtraOptions';
import Prayers from '@/app/components/player/Prayers';
import Equipment from '@/app/components/player/Equipment';
import Skills from '@/app/components/player/skills/Skills';
import { useLoadouts } from '@/state/LoadoutStore';
import PlayerTabSelector from './PlayerTabSelector';

const PlayerInputsContainer: React.FC = observer(() => {
  const { playerTab } = useUIState();

  switch (playerTab) {
    case PlayerTab.COMBAT_OPTIONS:
      return <CombatOptions />;
    case PlayerTab.SKILLS:
      return <Skills />;
    case PlayerTab.EQUIPMENT:
      return <Equipment />;
    case PlayerTab.PRAYER:
      return <Prayers />;
    case PlayerTab.OPTIONS:
      return <ExtraOptions />;
      // todo(mobx)
      // case PlayerTab.LEAGUES:
      //   return <DemonicPactsLeague />;

    default:
      throw new Error(`unknown player tab ${playerTab}`);
  }
});

const LoadoutsContainer: React.FC = observer(() => {
  const { selectedLoadout } = useLoadouts();

  return (
    <div className="flex flex-col w-[350px]" key={selectedLoadout}>
      <LoadoutTabSelector />
      <div
        className="sm:rounded-b-lg bg-dark-300 text-white shadow-lg flex flex-col"
      >
        <PlayerHeader />
        <PlayerTabSelector />
        <PlayerInputsContainer />
      </div>
    </div>

  );
});

export default LoadoutsContainer;
