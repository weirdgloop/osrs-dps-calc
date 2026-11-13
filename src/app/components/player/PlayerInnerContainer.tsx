import React, { useState } from 'react';
import combat from '@/public/img/tabs/combat.png';
import skills from '@/public/img/tabs/skills.png';
import equipment from '@/public/img/tabs/equipment.png';
import options from '@/public/img/tabs/options.webp';
import prayer from '@/public/img/tabs/prayer.png';
import PlayerTab from '@/app/components/player/PlayerTab';
import Equipment from '@/app/components/player/Equipment';
import Combat from '@/app/components/player/Combat';
import Skills from '@/app/components/player/Skills';
import Prayers from '@/app/components/player/Prayers';
import ExtraOptions from '@/app/components/player/ExtraOptions';

const TABS = [
  {
    id: 'combat', name: 'Combat', image: combat, Content: Combat,
  },
  {
    id: 'skills', name: 'Skills', image: skills, Content: Skills,
  },
  {
    id: 'equipment', name: 'Equipment', image: equipment, Content: Equipment,
  },
  {
    id: 'prayer', name: 'Prayer', image: prayer, Content: Prayers,
  },
  {
    id: 'options', name: 'Extra options', image: options, Content: ExtraOptions,
  },
] as const;

type TabId = typeof TABS[number]['id'];

const PlayerInnerContainer: React.FC = () => {
  const [selected, setSelected] = useState<TabId>('equipment');
  const { Content } = TABS.find((tab) => tab.id === selected)!;

  return (
    <div className="grow flex flex-col">
      <div className="flex justify-center text-center items-center bg-body-100 dark:bg-dark-400 dark:border-dark-200 px-4 py-[1.25em] gap-1 border-b border-body-400">
        {TABS.map((tab) => (
          <PlayerTab
            key={tab.id}
            name={tab.name}
            isActive={selected === tab.id}
            image={tab.image}
            onClick={() => setSelected(tab.id)}
          />
        ))}
      </div>
      <Content />
    </div>
  );
};

export default PlayerInnerContainer;
