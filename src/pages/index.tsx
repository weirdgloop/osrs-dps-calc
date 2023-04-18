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

const PlayerContainer: React.FC = observer(() => {
  const store = useStore();

  return (
    <div className={'bg-[#1a1b24] md:basis-1/4 basis-auto flex-initial rounded-lg text-white shadow flex flex-col'}>
      <div className={'px-6 py-4 border-b-dracula border-b rounded rounded-bl-none rounded-br-none'}>
        <h1 className={`font-mono text-xl tracking-tight font-bold`}>Player  <span className={'text-gray-500 text-sm'}>(level {calculateCombatLevel(store.playerSkills)})</span></h1>
      </div>
      <div className={'flex grow flex-wrap md:flex-nowrap'}>
        <BoxPlayerInputs />
        <BoxCombatAttributes />
      </div>
    </div>
  )
})

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Needed for rendering tooltips while using SSR
  useEffect(() => {
    setIsMounted(true);
  }, [])

  return (
    <div>
      <Head>
        <title>OSRS DPS Calculator</title>
      </Head>
      {/* Main container */}
      <div className={'max-w-screen-xl mx-auto my-8'}>
        <div className={'flex gap-4 flex-wrap'}>
          <PlayerContainer />
          <div className={'bg-[#1a1b24] flex-1 rounded-lg text-white shadow'}>
            <div className={'px-6 py-4 border-b-orange border-b rounded rounded-bl-none rounded-br-none'}>
              <h1 className={`font-mono text-xl tracking-tight font-bold`}>Monster</h1>
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
    </div>
  )
}

export default Home;
