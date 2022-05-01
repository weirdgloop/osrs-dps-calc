import {useState} from 'react';
import Image from 'next/image';

import attack from '@/img/attack.png'
import strength from '@/img/strength.png';
import defence from '@/img/defence.png';
import ranged from '@/img/ranged.png';
import magic from '@/img/magic.png';
import hitpoints from '@/img/hitpoints.png';
import prayer from '@/img/prayer.png';

export default function Skills() {
  const [username, setUsername] = useState('');

  return (
    <>
      <h4 className={'font-bold text-center'}>
        Skills
      </h4>
      <div className={'flex items-center mt-2'}>
        <input type={'text'} className={'rounded w-full text-center mt-auto'} placeholder={'Username'} value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
        <button type={'button'} className={'bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-2 ml-1 rounded'}>
          Lookup
        </button>
      </div>
      <table className={'table-auto w-full mt-2'}>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={attack} alt={'Attack'} />
          </td>
          <td>Attack</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={strength} alt={'Strength'} />
          </td>
          <td>Strength</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={defence} alt={'Defence'} />
          </td>
          <td>Defence</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={hitpoints} alt={'Hitpoints'} />
          </td>
          <td>Hitpoints</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={ranged} alt={'Ranged'} />
          </td>
          <td>Ranged</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={magic} alt={'Magic'} />
          </td>
          <td>Magic</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
        <tr>
          <td className={'w-5 align-bottom'}>
            <Image src={prayer} alt={'Prayer'} />
          </td>
          <td>Prayer</td>
          <td className={'w-1/3 text-right'}>
            <input type={'text'} className={'w-3/4 h-8 rounded'} />
          </td>
        </tr>
      </table>
    </>
  )
}