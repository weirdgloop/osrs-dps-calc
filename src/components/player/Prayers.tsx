import Image, {StaticImageData} from 'next/image';

import {observer} from 'mobx-react-lite';
import {useStore} from '../../state';
import React from 'react';
import {Prayer, PrayerMap} from '@/lib/enums/Prayer';
import {IconCircleCheckFilled} from '@tabler/icons-react';

interface IPrayerItemProps {
  prayer: Prayer;
  name: string;
  image: string | StaticImageData;
}

const PrayerItem: React.FC<IPrayerItemProps> = observer((props) => {
  const {prayer, name, image} = props;
  const store = useStore();
  const {prayers} = store.player;
  const active = prayers.includes(prayer);

  return (
    <div
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
      onClick={() => store.togglePlayerPrayer(prayer)}
      className={`cursor-pointer w-[28px] h-[23px] flex justify-center items-center`}
    >
      <div className={'relative'}>
        {active && <IconCircleCheckFilled className={'filter drop-shadow absolute top-[-10px] left-[-12px] text-green-400 w-5'} />}
        <Image src={image} alt={name} />
      </div>
    </div>
  )
})

const Prayers = observer(() => {
  const store = useStore();
  const {player} = store;

  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Prayers
      </h4>
      <div className={'grid grid-cols-4 gap-y-4 mt-4 w-48 m-auto items-center justify-center'}>
        {
          Object.entries(PrayerMap).map(([k, v], i) => {
            return <PrayerItem key={k} prayer={parseInt(k)} name={v.name} image={v.image} />
          })
        }
      </div>
    </div>
  )
})

export default Prayers;