import React from 'react';
import Toggle from '../generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';

const ExtraOptions: React.FC = observer(() => {
  const store = useStore();
  const {player} = store;

  return (
    <div className={'px-6 my-4'}>
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

export default ExtraOptions;
