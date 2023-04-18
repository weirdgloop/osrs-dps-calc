import Image from 'next/image';

import {PRAYERS} from '@/lib/constants';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../state/state';
import fonts from '../../fonts';
import React from 'react';

const Prayers = observer(() => {
  const store = useStore();

  const onPrayerClick = (name: string) => {
    store.togglePlayerPrayer(name);
  }

  return (
    <div className={'mt-4'}>
      <h4 className={`font-bold ${fonts.jbm.className}`}>
        Prayers
      </h4>
      <div className={'flex flex-wrap gap-5 mt-3 items-center justify-center'}>
        {
          Object.entries(PRAYERS).map(([name, info], i) => {
            return <div
              data-tooltip-id={'tooltip'}
              data-tooltip-content={name}
              key={i}
              onClick={() => onPrayerClick(name)}
              className={`cursor-pointer ${store.playerPrayers.includes(name) ? 'rounded bg-yellow-200 shadow' : ''}`}
            >
              <Image src={info.img} alt={name} />
            </div>
          })
        }
      </div>
    </div>
  )
})

export default Prayers;