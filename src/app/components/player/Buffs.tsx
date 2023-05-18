import React, {useEffect, useRef, useState} from 'react';
import Toggle from '../generic/Toggle';
import Image, {StaticImageData} from 'next/image';
import {Potion, PotionMap} from '@/enums/Potion';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {IconCircleCheck, IconCircleCheckFilled} from "@tabler/icons-react";
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';
import LazyImage from "@/app/components/generic/LazyImage";

interface IBuffItemProps {
    potion: Potion;
    name: string;
    image: StaticImageData;
    tooltip?: string;
}

const BuffItem: React.FC<IBuffItemProps> = observer((props) => {
    const {potion, name, tooltip, image} = props;
    const store = useStore();
    const [hovering, setHovering] = useState(false);
    const {buffs} = store.player;
    const active = buffs.potions.includes(potion);

    return (
        <button
            data-tooltip-id={'tooltip'}
            data-tooltip-content={tooltip}
            data-tooltip-place={'right'}
            onClick={() => store.togglePlayerPotion(potion)}
            className={`w-full px-4 py-1 first:mt-0 first:border-0 border-t flex gap-4 items-center`}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={'w-[20px] h-[23px] flex'}>
                <LazyImage responsive={true} src={image.src} alt={name} />
            </div>
            <div className={'text-xs'}>
                {name}
            </div>
            <div className={'ml-auto h-6'}>
                {(hovering || active) && (
                    active ? <IconCircleCheckFilled className={'text-green-400 w-4'}/> :
                        <IconCircleCheck className={'text-gray-300 w-4'}/>
                )}
            </div>
        </button>
    )
})

const Buffs: React.FC = observer(() => {
  const store = useStore();
  const {player, ui} = store;
  const potionsScrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
      // If there is a scroll position saved in the global state, scroll to it for the potions container
      if (potionsScrollContainer.current && ui.potionsScrollPosition > 0) {
          potionsScrollContainer.current?.scrollTo({top: ui.potionsScrollPosition});
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div
            ref={potionsScrollContainer}
            className={'h-[11.5rem] mt-2 bg-white rounded border border-gray-300 overflow-y-scroll'}
            onScroll={(evt) => {
                store.updateUIState({potionsScrollPosition: evt.currentTarget.scrollTop});
            }}
        >
        {
          Object.entries(PotionMap).map(([k, v]) => {
              return <BuffItem key={k} potion={parseInt(k)} name={v.name} image={v.image} tooltip={v.desc} />
          })
        }
        </div>
    </div>

  )
})

export default Buffs;