import Image from 'next/image';
import attack from '@/img/attack.png';
import strength from '@/img/strength.png';
import magic from '@/img/magic.png';
import magicStrength from '@/img/magic_strength.png';
import ranged from '@/img/ranged.png';
import rangedStrength from '@/img/ranged_strength.png';
import {Monster, MonsterOffensive as MonsterOffensiveType} from '@/types/Monster';
import {useEffect, useState} from 'react';

interface MonsterOffensiveProps {
  monster?: Monster
}

export default function MonsterOffensive(props: MonsterOffensiveProps) {
  const [offensive, setOffensive] = useState<MonsterOffensiveType>({
    attack: 0,
    magic: 0,
    magic_str: 0,
    ranged: 0,
    ranged_str: 0,
    strength: 0
  })

  useEffect(() => {
    if (props.monster) {
      setOffensive(props.monster.offensive);
    }
  }, [props.monster])

  return (
    <>
      <h4 className={'font-bold text-center mt-3'}>
        Offensive bonuses
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-end'}>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={attack} alt={'Attack'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={offensive.attack} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={strength} alt={'Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={offensive.strength} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={magic} alt={'Magic'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={offensive.magic} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={magicStrength} alt={'Magic Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={offensive.magic_str} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={ranged} alt={'Ranged'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={offensive.ranged} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={rangedStrength} alt={'Ranged Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={offensive.ranged_str} />
        </div>
      </div>
    </>
  )
}