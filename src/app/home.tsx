'use client';

import type { NextPage } from 'next';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import { Tooltip } from 'react-tooltip';
import React, { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { ToastContainer } from 'react-toastify';
import InitialLoad from '@/app/components/InitialLoad';
import { IconAlertTriangle } from '@tabler/icons-react';
import { usePreferences } from '@/state/Preferences';
import GlobalReactions from '@/app/components/GlobalReactions';
import GlobalHotkeys from '@/app/components/GlobalHotkeys';
import Footer from '@/app/components/Footer';
import HitDistribution from '@/app/components/results/HitDistribution';
import DebugPanels from '@/app/components/debug/DebugPanels';
import PlayerVsNPCResultsContainer from '@/app/components/results/PlayerVsNPCResultsContainer';
import LoadoutsContainer from './components/player/LoadoutsContainer';
import Header from './components/header/Header';

const Home: NextPage = observer(() => {
  const { manualMode, updatePreferences } = usePreferences();

  return (
    <div className="flex flex-col h-[100vh]">
      <div>
        <Header />
      </div>
      <div className="grow">
        <div>
          <GlobalReactions />
          <GlobalHotkeys />
          {manualMode && (
            <button
              type="button"
              className="w-full bg-orange-500 text-white px-4 py-1 text-sm border-b border-orange-400 flex items-center gap-1"
              onClick={() => updatePreferences({ manualMode: false })}
            >
              <IconAlertTriangle className="text-orange-200" />
              Manual mode is enabled! Some things may not function correctly. Click here to disable it.
            </button>
          )}
          <Suspense>
            {/* todo(mobx) */}
            {/* <InitialLoad /> */}
          </Suspense>
          {/* Main container */}
          <div className="max-w-[1420px] mx-auto mt-4 md:mb-8">
            <div className="flex gap-2 flex-wrap justify-center text-white">
              <LoadoutsContainer />
              <MonsterContainer />
              <PlayerVsNPCResultsContainer />
            </div>
          </div>
          {/* Additional graphs and stuff */}
          <div className="max-w-[1420px] mx-auto mb-8">
            {/* <LoadoutComparison /> */}
            {/* <TtkComparison /> */}
            {/* <NPCVersusPlayerResultsContainer /> */}
            <DebugPanels />
          </div>
          <Tooltip id="tooltip" />
          <Tooltip id="tooltip-warning" />
          <ToastContainer
            position="bottom-right"
            hideProgressBar
            draggable={false}
            limit={3}
            closeButton={false}
            className="text-sm"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
});

export default Home;
