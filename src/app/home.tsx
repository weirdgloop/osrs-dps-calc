'use client';

import type { NextPage } from 'next';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import { Tooltip } from 'react-tooltip';
import React, { Suspense, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { ToastContainer } from 'react-toastify';
import PlayerContainer from '@/app/components/player/PlayerContainer';
import PlayerVsNPCResultsContainer from '@/app/components/results/PlayerVsNPCResultsContainer';
import { IReactionPublic, reaction, toJS } from 'mobx';
import InitialLoad from '@/app/components/InitialLoad';
import LoadoutComparison from '@/app/components/results/LoadoutComparison';
import TtkComparison from '@/app/components/results/TtkComparison';
import ShareModal from '@/app/components/ShareModal';
import DebugPanels from '@/app/components/results/DebugPanels';
import { IconAlertTriangle } from '@tabler/icons-react';
import NPCVersusPlayerResultsContainer from '@/app/components/results/NPCVersusPlayerResultsContainer';
import { CalcProvider, useCalc } from '@/worker/CalcWorker';

const Home: NextPage = observer(() => {
  const calc = useCalc();
  const store = useStore();
  store.debug = process.env && process.env.NODE_ENV === 'development';

  useEffect(() => {
    store.setCalcWorker(calc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const globalKeyDownHandler = (e: KeyboardEvent) => {
    // We only handle events that occur outside <input>, <textarea>, etc
    if (e.target !== document.body) return;

    switch (e.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5': {
        // Handle quickly switching between loadouts (max 5)
        const key = parseInt(e.key) - 1;
        if (store.loadouts[key] !== undefined) {
          store.setSelectedLoadout(key);
        }
        break;
      }
      default:
        return;
    }

    // If we get here, we've handled the event, so prevent it bubbling
    e.preventDefault();
  };

  useEffect(() => {
    // Load preferences from browser storage if there are any
    store.loadPreferences();

    // Setup global event handling
    document.addEventListener('keydown', globalKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', globalKeyDownHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const recompute = () => {
      store.doWorkerRecompute()
        .catch(console.error);
    };

    // When a calculator input changes, trigger a re-compute on the worker
    const triggers: ((r: IReactionPublic) => unknown)[] = [
      () => toJS(store.loadouts),
      () => toJS(store.monster),
      () => store.prefs.showTtkComparison,
      () => store.prefs.showNPCVersusPlayerResults,
    ];
    const reactions = triggers.map((t) => reaction(t, recompute, { fireImmediately: true }));

    return () => {
      for (const r of reactions) {
        r();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {store.prefs.manualMode && (
        <button
          type="button"
          className="w-full bg-orange-500 text-white px-4 py-1 text-sm border-b border-orange-400 flex items-center gap-1"
          onClick={() => store.updatePreferences({ manualMode: false })}
        >
          <IconAlertTriangle className="text-orange-200" />
          Manual mode is enabled! Some things may not function correctly. Click here to disable it.
        </button>
      )}
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
        {/* LoadoutComparison requires its own calc context */}
        <CalcProvider>
          <LoadoutComparison />
        </CalcProvider>
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
      <ShareModal />
    </div>
  );
});

export default Home;
