import Image from 'next/image';

import {observer} from 'mobx-react-lite';
import {useStore} from '../../state/state';
import React from 'react';
import {PrayerMap} from '@/lib/enums/Prayer';

const Prayers = observer(() => {
  const store = useStore();
  const {player} = store;

  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Prayers
      </h4>
      <div className={'flex flex-wrap gap-2 mt-3 items-center justify-center'}>
        {
          Object.entries(PrayerMap).map(([k, v], i) => {
            return <div
              key={i}
              data-tooltip-id={'tooltip'}
              data-tooltip-content={v.name}
              onClick={() => store.togglePlayerPrayer(k)}
              className={`cursor-pointer w-10 ${player.prayers.includes(k) ? 'rounded bg-yellow-200 shadow' : ''}`}
            >
              <Image src={v.image} alt={v.name} />
            </div>
          })
        }
      </div>
    </div>
  )
})

export default Prayers;