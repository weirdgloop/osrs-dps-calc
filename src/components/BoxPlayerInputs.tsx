import Image from 'next/image';
import combat from '../public/img/combat.png';
import skills from '../public/img/skills.png';
import equipment from '../public/img/equipment.png';
import potion from '../public/img/potion.png';
import prayer from '../public/img/prayer.png';
import {useState} from 'react';
import Combat from './inputs/Combat';

type SelectedInputType = 'combat' | 'skills' | 'equipment' | 'potions' | 'prayer';

export default function BoxPlayerInputs() {
  const [selected, setSelected] = useState<SelectedInputType>('combat');

  const renderSelected = () => {
    switch (selected) {
      case 'combat':
        return <Combat />
    }
  }

  return (
    <div className={'basis-1/2'}>
      <div className={'bg-gray-600 rounded p-4 text-white'}>
        <h3 className={'text-center font-semibold'}>
          Inputs
        </h3>
      </div>
      <div className={'bg-gray-300 rounded mt-2 p-4'}>
        <div className={'flex justify-center text-center items-center bg-gray-200 p-1 shadow rounded'}>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('combat')}>
            <Image src={combat} alt={'Combat'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('skills')}>
            <Image src={skills} alt={'Skills'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('equipment')}>
            <Image src={equipment} alt={'Worn Equipment'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('potions')}>
            <Image src={potion} alt={'Potions'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('prayer')}>
            <Image src={prayer} alt={'Prayer'} />
          </div>
        </div>
      </div>
      <div className={'bg-gray-300 rounded mt-2 p-4'}>
        {renderSelected()}
      </div>
    </div>
  )
}