import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {PrayerMap, RUINOUS_PRAYERS, STANDARD_PRAYERS} from '@/enums/Prayer';
import PrayerItem from "@/app/components/player/prayer/PrayerItem";
import Prayer from '@/public/img/tabs/prayer.png';
import Ruinous from '@/public/img/tabs/ruinous.png';

enum PrayerType {
  STANDARD,
  RUINOUS
}

const Prayers: React.FC = observer(() => {
  const [prayerType, setPrayerType] = useState(PrayerType.STANDARD);

  return (
    <>
      <div className={'flex text-center text-sm font-serif font-bold border-b border-body-400 dark:border-dark-200'}>
        <button
          className={`basis-1/2 transition-colors py-2 border-r border-body-400 dark:border-dark-200 ${prayerType === PrayerType.STANDARD ? 'bg-btns-400 dark:bg-dark-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          onClick={() => setPrayerType(PrayerType.STANDARD)}
        >
          <img src={Prayer.src} alt={''} className={'inline-block w-4 mr-1.5 relative top-[-2px]'} />
          Standard
        </button>
        <button
          className={`basis-1/2 transition-colors py-2 ${prayerType === PrayerType.RUINOUS ? 'bg-btns-400 dark:bg-dark-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
          onClick={() => setPrayerType(PrayerType.RUINOUS)}
        >
          <img src={Ruinous.src} alt={''} className={'inline-block w-4 mr-1.5 relative top-[-2px]'} />
          Ruinous
        </button>
      </div>
      <div className={'px-6 mt-4'}>
        <h4 className={`font-bold font-serif`}>
          Prayers
        </h4>
        <div className={'grid grid-cols-4 gap-y-4 mt-4 w-48 m-auto items-center justify-center'}>
          {
            Object.entries(PrayerMap).filter(([k]) => {
              if (prayerType === PrayerType.STANDARD) {
                return STANDARD_PRAYERS.includes(parseInt(k))
              } else {
                return RUINOUS_PRAYERS.includes(parseInt(k))
              }
            }).map(([k, v]) => {
              return <PrayerItem key={k} prayer={parseInt(k)} name={v.name} image={v.image} />
            })
          }
        </div>
        {prayerType === PrayerType.RUINOUS && (
          <p className={'mt-4 text-xs text-orange-500 dark:text-orange-200'}>Ruinous prayers are in beta and subject to change before release.</p>
        )}
      </div>
    </>
  )
})

export default Prayers;