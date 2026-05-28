import { observer } from 'mobx-react-lite';
import React from 'react';
import { useUIState, PlayerTab } from '@/state/UIStateStore';
import combat from '@/public/img/tabs/combat.png';
import skills from '@/public/img/tabs/skills.png';
import equipment from '@/public/img/tabs/equipment.png';
import options from '@/public/img/tabs/options.webp';
import prayer from '@/public/img/tabs/prayer.png';
import league from '@/public/img/tabs/league.png';
import Image, { StaticImageData } from 'next/image';

interface IPlayerTabRenderData {
  name: string;
  image: StaticImageData;
}

const PlayerTabButtonRenderData: { [tab in PlayerTab]: IPlayerTabRenderData } = {
  [PlayerTab.COMBAT_OPTIONS]: {
    name: 'Combat',
    image: combat,
  },
  [PlayerTab.SKILLS]: {
    name: 'Skills',
    image: skills,
  },
  [PlayerTab.EQUIPMENT]: {
    name: 'Equipment',
    image: equipment,
  },
  [PlayerTab.PRAYER]: {
    name: 'Prayer',
    image: prayer,
  },
  [PlayerTab.OPTIONS]: {
    name: 'Extra options',
    image: options,
  },
  [PlayerTab.LEAGUES]: {
    name: 'Demonic Pacts League',
    image: league,
  },
};

const PlayerTabButton: React.FC<{ tab: PlayerTab }> = observer(({ tab }) => {
  const { playerTab, updateUIState } = useUIState();
  const { name, image } = PlayerTabButtonRenderData[tab];

  const isActive = playerTab === tab;

  return (
    <button
      type="button"
      className={`flex flex-initial shadow w-10 h-10 cursor-pointer justify-center items-center rounded transition-[background] ${isActive ? ' bg-dark-100' : 'hover:bg-dark-100 bg-dark-200'}`}
      onClick={() => updateUIState({ playerTab: tab })}
      data-tooltip-id="tooltip"
      data-tooltip-content={name}
    >
      <Image src={image} alt={name} className="max-w-8" />
    </button>
  );
});

const PlayerTabSelector: React.FC = observer(() => (
  <div className="flex justify-center text-center items-center bg-body-100 dark:bg-dark-400 dark:border-dark-200 px-4 py-[1.25em] gap-1 border-b border-body-400">
    <PlayerTabButton tab={PlayerTab.COMBAT_OPTIONS} />
    <PlayerTabButton tab={PlayerTab.SKILLS} />
    <PlayerTabButton tab={PlayerTab.EQUIPMENT} />
    <PlayerTabButton tab={PlayerTab.PRAYER} />
    <PlayerTabButton tab={PlayerTab.OPTIONS} />
    <PlayerTabButton tab={PlayerTab.LEAGUES} />
  </div>
));

export default PlayerTabSelector;
