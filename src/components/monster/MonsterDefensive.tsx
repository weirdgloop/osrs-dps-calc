import Image from 'next/image';
import magic from '@/img/magic.png';
import ranged from '@/img/ranged.png';
import dagger from '@/img/dagger.png';
import scimitar from '@/img/scimitar.png';
import warhammer from '@/img/warhammer.png';
import {Monster, MonsterDefensive as MonsterDefensiveType} from '@/types/Monster';
import {useEffect, useState} from 'react';

interface MonsterDefensiveProps {
  monster?: Monster
}

export default function MonsterDefensive(props: MonsterDefensiveProps) {
  const [defensive, setDefensive] = useState<MonsterDefensiveType>({
    crush: 0,
    magic: 0,
    ranged: 0,
    slash: 0,
    stab: 0
  })

  useEffect(() => {
    if (props.monster) {
      setDefensive(props.monster.defensive);
    }
  }, [props.monster])

  return (
    <>
      <h4 className={'font-bold text-center mt-3'}>
        Defensive bonuses
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-end'}>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={dagger} alt={'Dagger'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} value={defensive.stab} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={scimitar} alt={'Scimitar'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} value={defensive.slash} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={warhammer} alt={'Warhammer'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} value={defensive.crush} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={magic} alt={'Magic'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} value={defensive.magic} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={ranged} alt={'Ranged'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} value={defensive.ranged} />
        </div>
      </div>
    </>
  )
}