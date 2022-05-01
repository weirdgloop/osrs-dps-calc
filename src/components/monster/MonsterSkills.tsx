import Image from 'next/image';
import hitpoints from '@/img/hitpoints.png';
import attack from '@/img/attack.png';
import strength from '@/img/strength.png';
import defence from '@/img/defence.png';
import magic from '@/img/magic.png';
import ranged from '@/img/ranged.png';
import {Monster, MonsterCombat} from '@/types/Monster';
import {useEffect, useState} from 'react';

interface MonsterSkillsProps {
  monster?: Monster
}

export default function MonsterSkills(props: MonsterSkillsProps) {
  const [skills, setSkills] = useState<MonsterCombat>({
    attack: 0,
    defence: 0,
    hp: 0,
    magic: 0,
    ranged: 0,
    strength: 0
  })

  useEffect(() => {
    if (props.monster) {
      setSkills(props.monster.combat);
    }
  }, [props.monster])

  return (
    <>
      <h4 className={'font-bold text-center'}>
        Skills
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-end'}>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={hitpoints} alt={'Hitpoints'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={skills.hp} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={attack} alt={'Attack'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={skills.attack} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={strength} alt={'Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={skills.strength} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={defence} alt={'Defence'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={skills.defence} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={magic} alt={'Magic'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={skills.magic} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={ranged} alt={'Ranged'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} value={skills.ranged} />
        </div>
      </div>
    </>
  )
}