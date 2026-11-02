'use client';

import type { NextPage } from 'next';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import { Tooltip } from 'react-tooltip';
import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import PlayerContainer from '@/app/components/player/PlayerContainer';
import PlayerVsNPCResultsContainer from '@/app/components/results/PlayerVsNPCResultsContainer';
import InitialLoad from '@/app/components/InitialLoad';
import GlobalHotkeys from '@/app/components/GlobalHotkeys';
import ManualModeBanner from '@/app/components/manual/ManualModeBanner';
import LoadoutComparison from '@/app/components/results/LoadoutComparison';
import TtkComparison from '@/app/components/results/TtkComparison';
import DebugPanels from '@/app/components/results/DebugPanels';
import NPCVersusPlayerResultsContainer from '@/app/components/results/NPCVersusPlayerResultsContainer';

const Home: NextPage = () => (
  <div>
    <ManualModeBanner />
    <GlobalHotkeys />
    <Suspense>
      <InitialLoad />
    </Suspense>
    {/* Main container */}
    <div className="max-w-[1420px] mx-auto mt-4 md:mb-8">
      <div className="flex gap-2 flex-wrap justify-center">
        <PlayerContainer />
        <MonsterContainer />
        <PlayerVsNPCResultsContainer />
      </div>
    </div>
    {/* Additional graphs and stuff */}
    <div className="max-w-[1420px] mx-auto mb-8">
      <LoadoutComparison />
      <TtkComparison />
      <NPCVersusPlayerResultsContainer />
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
);

export default Home;
