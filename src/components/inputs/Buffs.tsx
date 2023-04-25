import React from 'react';
import Toggle from '@/components/generic/Toggle';
import Image, {StaticImageData} from 'next/image';
import {Potion as PotionEnum, PotionMap} from '@/lib/enums/Potion';

import {observer} from 'mobx-react-lite';
import {useStore} from '../../state';

interface PotionProps {
  name: PotionEnum;
  img: StaticImageData | string;
}

const Potion: React.FC<PotionProps> = observer((props) => {
  const store = useStore();
  const {player} = store;
  const {name, img} = props;

  return (
    <div
      className={`w-10 flex justify-center cursor-pointer`}
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
      onClick={() => store.togglePlayerPotion(name)}
    >
      <Image className={`${player.buffs.potions.includes(name) ? 'filter drop-shadow-[0_0_5px_#000]' : ''}`} src={img} alt={name} />
    </div>
  )
})

const Buffs: React.FC = observer(() => {
  const store = useStore();
  const {player} = store;

  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Buffs
      </h4>
      <div className={'mt-2 mb-4'}>
        <Toggle checked={player.buffs.onSlayerTask} setChecked={(c) => store.updatePlayer({buffs: {onSlayerTask: c}})} label={'On Slayer task'} />
        <Toggle checked={player.buffs.inWilderness} setChecked={(c) => store.updatePlayer({buffs: {inWilderness: c}})} label={'In the Wilderness'} />
        <Toggle checked={player.buffs.kandarinDiary} setChecked={(c) => store.updatePlayer({buffs: {kandarinDiary: c}})} label={'Kandarin Hard Diary'} />
      </div>
      <h4 className={'font-bold font-serif'}>
        Potions
      </h4>
      <div className={'mt-4 flex flex-wrap grow justify-center items-center gap-4'}>
        {
          Object.entries(PotionMap).map(([k, v], i) => {
            return <div
              key={i}
              data-tooltip-id={'tooltip'}
              data-tooltip-content={v.name}
              onClick={() => store.togglePlayerPotion(k)}
              className={`w-10 flex justify-center cursor-pointer ${player.buffs.potions.includes(k) ? 'rounded bg-yellow-200 shadow' : ''}`}
            >
              <Image src={v.image} alt={v.name} />
            </div>
          })
        }
      </div>
    </div>

  )
})

export default Buffs;