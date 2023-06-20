import {observer} from 'mobx-react-lite';
import React from 'react';
import {PrayerMap} from '@/enums/Prayer';
import PrayerItem from "@/app/components/player/prayer/PrayerItem";

const Prayers: React.FC = observer(() => {
  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Prayers
      </h4>
      <div className={'grid grid-cols-4 gap-y-4 mt-4 w-48 m-auto items-center justify-center'}>
        {
          Object.entries(PrayerMap).map(([k, v]) => {
            return <PrayerItem key={k} prayer={parseInt(k)} name={v.name} image={v.image} />
          })
        }
      </div>
    </div>
  )
})

export default Prayers;