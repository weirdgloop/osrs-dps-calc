import Image from 'next/image';
import chop from '@/img/styles/chop.png';
import lunge from '@/img/styles/lunge.png';
import slash from '@/img/styles/slash.png';
import block from '@/img/styles/block.png';
import {useState} from 'react';

export default function Combat() {
  const [cbStyle, setCbStyle] = useState('Chop');

  return (
    <>
      <h4 className={'font-bold text-center'}>
        Combat style
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-center'}>
        {
          [
            ['Chop', chop],
            ['Lunge', lunge]
          ].map((s) => (
            <div key={s[0].toString()} className={`grow rounded bg-gray-200 p-2 shadow cursor-pointer hover:bg-gray-50 ${cbStyle === s[0] ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setCbStyle(s[0].toString())}>
              <Image src={s[1]} alt={s[0].toString()}  />
              <span className={'text-sm block'}>{s[0].toString()}</span>
            </div>
          ))
        }
      </div>
      <div className={'flex gap-2 mt-3 text-center items-center'}>
        {
          [
            ['Slash', slash],
            ['Block', block]
          ].map((s) => (
            <div key={s[0] as string} className={`grow rounded bg-gray-200 p-2 shadow cursor-pointer hover:bg-gray-50 ${cbStyle === s[0] ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setCbStyle(s[0].toString())}>
              <Image src={s[1]} alt={s[0] as string}  />
              <span className={'text-sm block'}>{s[0] as string}</span>
            </div>
          ))
        }
      </div>
    </>
  )
}