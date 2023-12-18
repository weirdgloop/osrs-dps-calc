import React from 'react';
import Toggle from '../generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';

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
    </div>

  )
})

export default Buffs;
