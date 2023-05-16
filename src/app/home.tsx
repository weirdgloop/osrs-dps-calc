'use client';

import type {NextPage} from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import {Tooltip} from 'react-tooltip';
import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {ToastContainer} from 'react-toastify';
import PlayerContainer from "@/app/components/player/PlayerContainer";
import ResultsContainer from "@/app/components/results/ResultsContainer";

const PreferencesModal = dynamic(() => import('@/app/components/PreferencesModal'));

const Home: NextPage = observer(() => {
  const store = useStore();
  const {showPreferencesModal} = store.ui;

  useEffect(() => {
    // Load preferences from browser storage if there are any
    store.loadPreferences();
  }, [store])

  return (
    <div>
      <Head>
        <title>OSRS DPS Calculator</title>
      </Head>
      {/* Main container */}
      <div className={'max-w-[1200px] mx-auto sm:my-8'}>
        <div className={'flex gap-4 flex-wrap'}>
          <PlayerContainer />
          <MonsterContainer />
        </div>
        <ResultsContainer />
      </div>
      <Tooltip id={'tooltip'} />
      <ToastContainer hideProgressBar={true} draggable={false} limit={3} closeButton={false} className={'text-sm'} />
        {showPreferencesModal && <PreferencesModal isOpen={showPreferencesModal} />}
    </div>
  )
})

export default Home;
