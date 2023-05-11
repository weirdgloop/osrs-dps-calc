import Image, {StaticImageData} from 'next/image';
import combat from '@/img/tabs/combat.png';
import skills from '@/img/tabs/skills.png';
import equipment from '@/img/tabs/equipment.png';
import potion from '@/img/tabs/potion.png';
import prayer from '@/img/tabs/prayer.png';
import spells from '@/img/tabs/spells.png';
import React, {useState} from 'react';
import Combat from './player/Combat';
import Skills from './player/Skills';
import Prayers from './player/Prayers';
import Equipment from './player/Equipment';
import Buffs from './player/Buffs';
import Spells from './player/Spells';

type SelectedInputType = 'combat' | 'skills' | 'equipment' | 'buffs' | 'prayer' | 'spells';

interface InputNavItemProps {
  name: string;
  image: string | StaticImageData;
  onClick?: () => void;
  isActive?: boolean;
}

const InputNavItem: React.FC<InputNavItemProps> = (props) => {
  const {name, image, onClick, isActive} = props;
  return (
    <div
      className={`flex flex-initial shadow w-10 h-10 cursor-pointer justify-center items-center rounded transition-[background] ${isActive ? ' bg-tile' : 'bg-body-400'}`}
      onClick={onClick}
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
    >
      <Image src={image} alt={name} className={''} />
    </div>
  )
}

export default function BoxPlayerInputs() {
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
      case 'spells':
        return <Spells />
    }
  }

  return (
    <div className={'grow md:border-r border-body-400'}>
      <div className={'flex justify-center text-center items-center bg-body-100 px-4 py-[1.5em] gap-1 border-b border-body-400  '}>
        <InputNavItem name={'Combat'} isActive={selected === 'combat'} image={combat} onClick={() => setSelected('combat')} />
        <InputNavItem name={'Skills'} isActive={selected === 'skills'} image={skills} onClick={() => setSelected('skills')} />
        <InputNavItem name={'Equipment'} isActive={selected === 'equipment'} image={equipment} onClick={() => setSelected('equipment')} />
        <InputNavItem name={'Buffs'} isActive={selected === 'buffs'} image={potion} onClick={() => setSelected('buffs')} />
        <InputNavItem name={'Prayer'} isActive={selected === 'prayer'} image={prayer} onClick={() => setSelected('prayer')} />
        <InputNavItem name={'Spells'} isActive={selected === 'spells'} image={spells} onClick={() => setSelected('spells')} />
      </div>
      <div className={'mb-6'}>
        {renderSelected()}
      </div>
    </div>
  )
}