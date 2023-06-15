import combat from '@/public/img/tabs/combat.png';
import skills from '@/public/img/tabs/skills.png';
import equipment from '@/public/img/tabs/equipment.png';
import potion from '@/public/img/tabs/potion.png';
import prayer from '@/public/img/tabs/prayer.png';
import React, {useState} from 'react';
import PlayerTab from "@/app/components/player/PlayerTab";
import dynamic from "next/dynamic";
import Spinner from "@/app/components/Spinner";
import Equipment from './Equipment';

// Dynamically import the other tabs, because they're only displayed on user click and it's wasteful otherwise
const Combat = dynamic(() => import('./Combat'), {loading: () => <div className={'text-center mt-2'}><Spinner /></div>});
const Skills = dynamic(() => import('./Skills'), {loading: () => <div className={'text-center mt-2'}><Spinner /></div>});
const Prayers = dynamic(() => import('./Prayers'), {loading: () => <div className={'text-center mt-2'}><Spinner /></div>});
const Buffs = dynamic(() => import('./Buffs'), {loading: () => <div className={'text-center mt-2'}><Spinner /></div>});

type SelectedInputType = 'combat' | 'skills' | 'equipment' | 'buffs' | 'prayer';

const PlayerInnerContainer: React.FC = () => {
  const [selected, setSelected] = useState<SelectedInputType>('equipment');

  const renderSelected = () => {
    switch (selected) {
      case 'combat':
        return <Combat />
      case 'skills':
        return <Skills />
      case 'equipment':
        return <Equipment />
      case 'prayer':
        return <Prayers />
      case 'buffs':
        return <Buffs />
    }
  }

  return (
    <div className={'grow sm:border-r border-body-400 dark:border-dark-200 min-h-[490px]'}>
      <div className={'flex justify-center text-center items-center bg-body-100 dark:bg-dark-400 dark:border-dark-200 px-8 py-[1.5em] gap-1 border-b border-body-400'}>
        <PlayerTab name={'Combat'} isActive={selected === 'combat'} image={combat} onClick={() => setSelected('combat')} />
        <PlayerTab name={'Skills'} isActive={selected === 'skills'} image={skills} onClick={() => setSelected('skills')} />
        <PlayerTab name={'Equipment'} isActive={selected === 'equipment'} image={equipment} onClick={() => setSelected('equipment')} />
        <PlayerTab name={'Buffs'} isActive={selected === 'buffs'} image={potion} onClick={() => setSelected('buffs')} />
        <PlayerTab name={'Prayer'} isActive={selected === 'prayer'} image={prayer} onClick={() => setSelected('prayer')} />
      </div>
      <div className={'mb-6'}>
        {renderSelected()}
      </div>
    </div>
  )
}

export default PlayerInnerContainer;