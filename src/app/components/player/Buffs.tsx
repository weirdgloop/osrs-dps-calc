import React from 'react';
import Toggle from '../generic/Toggle';
import Image, {StaticImageData} from 'next/image';
import {Potion, PotionMap} from '@/lib/enums/Potion';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../../state';
import {IconCircleCheckFilled} from "@tabler/icons-react";
import slayer from '@/img/misc/slayer.webp';
import skull from '@/img/misc/skull.webp';
import diary from '@/img/misc/diary.png';

interface IBuffItemProps {
    potion: Potion;
    name: string;
    image: string | StaticImageData;
}

const BuffItem: React.FC<IBuffItemProps> = observer((props) => {
    const {potion, name, image} = props;
    const store = useStore();
    const {buffs} = store.player;
    const active = buffs.potions.includes(potion);

    return (
        <div
            data-tooltip-id={'tooltip'}
            data-tooltip-content={name}
            onClick={() => store.togglePlayerPotion(potion)}
            className={`cursor-pointer w-[28px] h-[23px] flex justify-center items-center`}
        >
            <div className={'relative'}>
                {active && <IconCircleCheckFilled className={'filter drop-shadow absolute top-[-10px] left-[-12px] text-green-400 w-5'} />}
                <Image src={image} alt={name} />
            </div>
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
        <Toggle checked={player.buffs.onSlayerTask} setChecked={(c) => store.updatePlayer({buffs: {onSlayerTask: c}})} label={
            <>
                <img src={slayer.src} width={18} className={'inline-block'} alt={''} />{' '}
                On Slayer task
            </>
        } />
        <Toggle checked={player.buffs.inWilderness} setChecked={(c) => store.updatePlayer({buffs: {inWilderness: c}})} label={
            <>
                <img src={skull.src} width={18} className={'inline-block'} alt={''} />{' '}
                In the Wilderness
            </>
        } />
        <Toggle checked={player.buffs.kandarinDiary} setChecked={(c) => store.updatePlayer({buffs: {kandarinDiary: c}})} label={
            <>
                <img src={diary.src} width={18} className={'inline-block'} alt={''} />{' '}
                Kandarin Hard Diary
            </>
        } />
      </div>
      <h4 className={'font-bold font-serif'}>
        Potions
      </h4>
        <div className={'grid grid-cols-4 gap-y-4 mt-4 w-48 m-auto items-center justify-center'}>
        {
          Object.entries(PotionMap).map(([k, v], i) => {
              return <BuffItem key={k} potion={parseInt(k)} name={v.name} image={v.image} />
          })
        }
      </div>
    </div>

  )
})

export default Buffs;