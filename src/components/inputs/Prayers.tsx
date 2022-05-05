import Image from 'next/image';

import {PRAYERS} from '@/lib/constants';
import {useState} from 'react';

export default function Prayers() {
  const [selectedPrayers, setSelectedPrayers] = useState<string[]>([]);

  const onPrayerClick = (name: string) => {
    let prayers = [...selectedPrayers];
    const existing = prayers.findIndex((p) => p === name);

    if (existing > -1) {
      prayers.splice(existing, 1);
    } else {
      prayers.push(name);
    }

    setSelectedPrayers(
      Array.from(new Set(prayers))
    );
  }

  return (
    <>
      <h4 className={'font-bold text-center'}>
        Prayers
      </h4>
      <div className={'flex flex-wrap gap-2 mt-3 text-center items-center justify-center'}>
        {
          Object.entries(PRAYERS).map(([name, info], i) => {
            return <div key={i} style={{
              flex: '0 0 20%'
            }} onClick={() => onPrayerClick(name)} className={`cursor-pointer ${selectedPrayers.includes(name) ? 'rounded bg-yellow-200 shadow' : ''}`}>
              <Image src={info.img} alt={name} />
            </div>
          })
        }
      </div>
    </>
  )
}