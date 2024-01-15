import combat from '@/public/img/tabs/combat.png';
import skills from '@/public/img/tabs/skills.png';
import equipment from '@/public/img/tabs/equipment.png';
import options from '@/public/img/tabs/options.webp';
import prayer from '@/public/img/tabs/prayer.png';
import React, { useState } from 'react';
import PlayerTab from '@/app/components/player/PlayerTab';
import Equipment from './Equipment';
import Combat from './Combat';
import Skills from './Skills';
import Prayers from './Prayers';
import ExtraOptions from './ExtraOptions';

type SelectedInputType = 'combat' | 'skills' | 'equipment' | 'options' | 'prayer' | 'league';

const PlayerInnerContainer: React.FC = () => {
  const [selected, setSelected] = useState<SelectedInputType>('equipment');

  const renderSelected = () => {
    switch (selected) {
      case 'combat':
        return <Combat />;
      case 'skills':
        return <Skills />;
      case 'equipment':
        return <Equipment />;
      case 'prayer':
        return <Prayers />;
      case 'options':
        return <ExtraOptions />;
      default:
        break;
    }

    return null;
  };

  return (
    <div className="grow flex flex-col">
      <div className="flex justify-center text-center items-center bg-body-100 dark:bg-dark-400 dark:border-dark-200 px-4 py-[1.25em] gap-1 border-b border-body-400">
        <PlayerTab name="Combat" isActive={selected === 'combat'} image={combat} onClick={() => setSelected('combat')} />
        <PlayerTab name="Skills" isActive={selected === 'skills'} image={skills} onClick={() => setSelected('skills')} />
        <PlayerTab name="Equipment" isActive={selected === 'equipment'} image={equipment} onClick={() => setSelected('equipment')} />
        <PlayerTab name="Prayer" isActive={selected === 'prayer'} image={prayer} onClick={() => setSelected('prayer')} />
        <PlayerTab name="Extra options" isActive={selected === 'options'} image={options} onClick={() => setSelected('options')} />
      </div>
      {renderSelected()}
    </div>
  );
};

export default PlayerInnerContainer;
