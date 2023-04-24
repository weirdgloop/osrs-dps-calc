import type { NextPage } from 'next'
import Head from 'next/head';
import BoxPlayerInputs from '../components/BoxPlayerInputs';
import BoxCombatAttributes from '../components/BoxCombatAttributes';
import BoxMonster from '../components/BoxMonster';
import {Tooltip} from 'react-tooltip';
import React, {useEffect, useState} from 'react';
import BoxResults from '@/components/BoxResults';
import {observer} from 'mobx-react-lite';
import {useStore} from '../state/state';
import {calculateCombatLevel} from '@/lib/utilities';
import PreferencesModal from '@/components/PreferencesModal';
import {ToastContainer} from 'react-toastify';

const PlayerContainer: React.FC = observer(() => {
  const store = useStore();
  const {player} = store;

  return (
    <div className={'bg-tile md:basis-1/4 basis-auto flex-initial rounded-lg text-black shadow flex flex-col'}>
      <div className={'px-6 py-4 border-b-body-400 border-b rounded rounded-bl-none rounded-br-none flex justify-between items-center'}>
        <h1 className={`font-serif text-xl tracking-tight font-bold`}>Player</h1>
        <span className={'text-gray-500 font-bold font-serif text-sm'}>Level {calculateCombatLevel(player.skills)}</span>
      </div>
      <div className={'flex grow flex-wrap md:flex-nowrap'}>
        <BoxPlayerInputs />
        <BoxCombatAttributes />
      </div>
    </div>
  )
})

const Home: NextPage = () => {
  const store = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Needed for rendering tooltips while using SSR
    setIsMounted(true);

    // Load preferences from browser storage if there are any
    store.loadPreferences();
  }, [])

  return (
    <div>
      <Head>
        <title>OSRS DPS Calculator</title>
      </Head>
      {/* Main container */}
      <div className={'max-w-[1200px] mx-auto my-8'}>
        <div className={'flex gap-4 flex-wrap'}>
          <PlayerContainer />
          <div className={'bg-tile flex-1 rounded-lg text-black shadow'}>
            <div className={'px-6 py-4 border-b-body-400 border-b rounded rounded-bl-none rounded-br-none'}>
              <h1 className={`font-serif text-xl tracking-tight font-bold`}>Monster</h1>
            </div>
            <div className={'p-6'}>
              <BoxMonster />
            </div>
          </div>
        </div>
        <BoxResults />
      </div>
      {isMounted && <Tooltip
        id={'tooltip'}
      />}
      <ToastContainer hideProgressBar={true} draggable={false} limit={3} closeButton={false} className={'text-sm'} />
      <PreferencesModal />
    </div>
  )
}

export default Home;
