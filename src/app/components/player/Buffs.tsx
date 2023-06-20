import React, {useEffect, useRef} from 'react';
import Toggle from '../generic/Toggle';
import {PotionMap} from '@/enums/Potion';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';
import BuffItem from "@/app/components/player/buffs/BuffItem";

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
            className={'h-[11.5rem] mt-2 bg-white dark:bg-dark-500 dark:border-dark-200 rounded border border-gray-300 overflow-y-scroll'}
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