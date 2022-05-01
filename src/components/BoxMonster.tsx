import MonsterSkills from './monster/MonsterSkills';
import MonsterOffensive from './monster/MonsterOffensive';
import MonsterDefensive from './monster/MonsterDefensive';
import {Monster} from '@/types/Monster';
import {useState} from 'react';

const monsters: {
  [monster: string]: Monster
} = {
  'Black demon': {
    combat: {
      hp: 157,
      attack: 145,
      strength: 148,
      defence: 152,
      magic: 1,
      ranged: 1
    },
    offensive: {
      attack: 0,
      strength: 0,
      magic: 0,
      magic_str: 0,
      ranged: 0,
      ranged_str: 0
    },
    defensive: {
      stab: 0,
      slash: 0,
      crush: 0,
      magic: -10,
      ranged: 0
    }
  }
}

export default function BoxMonster() {
  const [selectedMonster, setSelectedMonster] = useState<Monster | undefined>();

  return (
    <div className={''}>
      <div className={'bg-gray-600 rounded p-4 text-white'}>
        <h3 className={'text-center font-semibold'}>
          Monster
        </h3>
      </div>
      <div className={'bg-gray-300 rounded mt-2 p-4'}>
        <select className={'rounded'} onClick={(e) => {
          const m = monsters[e.currentTarget.value];
          if (m) setSelectedMonster(m)
        }}>
          {
            Object.keys(monsters).map((monster) => {
              return <option key={monster} value={monster}>{monster}</option>
            })
          }
        </select>
        <MonsterSkills monster={selectedMonster} />
        <hr className={'mt-3 bg-gray-200 h-0.5 border-0'} />
        <MonsterOffensive monster={selectedMonster} />
        <hr className={'mt-3 bg-gray-200 h-0.5 border-0'} />
        <MonsterDefensive monster={selectedMonster} />
      </div>
    </div>
  )
}