'use client';

import type { NextPage } from 'next';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import { Tooltip } from 'react-tooltip';
import React, { Suspense, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { ToastContainer } from 'react-toastify';
import PlayerContainer from '@/app/components/player/PlayerContainer';
import ResultsContainer from '@/app/components/results/ResultsContainer';
import { WorkerResponses, WorkerResponseType } from '@/types/WorkerData';
import { IReactionPublic, reaction, toJS } from 'mobx';
import { WORKER_JSON_REVIVER } from '@/utils';
import PreferencesModal from '@/app/components/PreferencesModal';
import InitialLoad from '@/app/components/InitialLoad';
import LoadoutComparison from '@/app/components/results/LoadoutComparison';
import TtkComparison from '@/app/components/results/TtkComparison';
import ShareModal from '@/app/components/ShareModal';

const Home: NextPage = observer(() => {
  const store = useStore();

  useEffect(() => {
    // When the page loads, set up the worker and be ready to interpret the responses
    const worker = new Worker(new URL('../worker.ts', import.meta.url));
    worker.onmessage = (evt: MessageEvent<string>) => {
      const data = JSON.parse(evt.data, WORKER_JSON_REVIVER) as WorkerResponses;

      // Depending on the response type, do things...
      switch (data.type) {
        case WorkerResponseType.COMPUTED_VALUES:
          store.updateCalculator({ loadouts: data.data });
          break;
        default:
          break;
      }
    };
    store.setWorker(worker);

    return () => {
      // Terminate the worker when we un-mount this component
      worker?.terminate();
      store.setWorker(null);
    };
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
      store.doWorkerRecompute();
      store.doUserIssuesCheck();
    };

    // When a calculator input changes, trigger a re-compute on the worker
    const triggers: ((r: IReactionPublic) => unknown)[] = [
      () => toJS(store.loadouts),
      () => toJS(store.monster),
      () => toJS(store.prefs.showTtkComparison),
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
      <Suspense>
        <InitialLoad />
      </Suspense>
      {/* Main container */}
      <div className="max-w-[1420px] mx-auto mt-8 md:mb-8">
        <div className="flex gap-2 flex-wrap justify-center">
          <PlayerContainer />
          <MonsterContainer />
          <ResultsContainer />
        </div>
      </div>
      {/* Additional graphs and stuff */}
      <div className="max-w-[1420px] mx-auto mb-8">
        <LoadoutComparison />
        <TtkComparison />
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
      <PreferencesModal />
      <ShareModal />
    </div>
  );
});

export default Home;
