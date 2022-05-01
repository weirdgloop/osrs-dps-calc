import Image from 'next/image';
import combat from '@/img/combat.png';
import skills from '@/img/skills.png';
import equipment from '@/img/equipment.png';
import potion from '@/img/potion.png';
import prayer from '@/img/prayer.png';
import {useState} from 'react';
import Combat from '@/components/inputs/Combat';
import Skills from '@/components/inputs/Skills';
import Prayers from '@/components/inputs/Prayers';

type SelectedInputType = 'combat' | 'skills' | 'equipment' | 'potions' | 'prayer';

export default function BoxPlayerInputs() {
  const [selected, setSelected] = useState<SelectedInputType>('combat');

  const renderSelected = () => {
    switch (selected) {
      case 'combat':
        return <Combat />
      case 'skills':
        return <Skills />
      case 'prayer':
        return <Prayers />
    }
  }

  return (
    <div className={'basis-full lg:basis-1/2'}>
      <div className={'bg-gray-600 rounded p-4 text-white'}>
        <h3 className={'text-center font-semibold'}>
          Inputs
        </h3>
      </div>
      <div className={'bg-gray-300 rounded mt-2 p-4'}>
        <div className={'flex justify-center text-center items-center bg-gray-200 p-1 shadow rounded'}>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('combat')} data-tip="Combat">
            <Image src={combat} alt={'Combat'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('skills')} data-tip="Skills">
            <Image src={skills} alt={'Skills'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('equipment')} data-tip="Equipment">
            <Image src={equipment} alt={'Worn Equipment'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('potions')} data-tip="Potions">
            <Image src={potion} alt={'Potions'} />
          </div>
          <div className={'grow cursor-pointer'} onClick={() => setSelected('prayer')} data-tip="Prayer">
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