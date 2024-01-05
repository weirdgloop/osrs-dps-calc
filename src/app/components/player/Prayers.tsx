import {observer} from 'mobx-react-lite';
import React from 'react';
import {Prayer, PrayerMap} from '@/enums/Prayer';
import {useStore} from "@/state";
import GridItem from "@/app/components/generic/GridItem";

const Prayers: React.FC = observer(() => {
  const store = useStore();
  const {prayers} = store.player;

  return (
    <div className={'px-4 mb-8'}>
      <div className={'grid grid-cols-4 gap-y-4 mt-6 w-48 m-auto items-center justify-center'}>
        {
          Object.entries(PrayerMap).map(([k, v]) => {
            return <GridItem
              key={k}
              item={parseInt(k)}
              name={v.name}
              image={v.image}
              active={prayers.includes(parseInt(k))}
              onClick={(p: Prayer) => store.togglePlayerPrayer(p)}
            />
          })
        }
      </div>
    </div>
  )
})

export default Prayers;
