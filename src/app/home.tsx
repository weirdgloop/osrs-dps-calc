'use client';

import type {NextPage} from 'next';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import {Tooltip} from 'react-tooltip';
import React, {Suspense, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {ToastContainer} from 'react-toastify';
import PlayerContainer from "@/app/components/player/PlayerContainer";
import ResultsContainer from "@/app/components/results/ResultsContainer";
import {WorkerResponses, WorkerResponseType} from "@/types/WorkerData";
import {IReactionPublic, reaction, toJS} from "mobx";
import {WORKER_JSON_REVIVER} from "@/utils";
import PreferencesModal from "@/app/components/PreferencesModal";
import InitialLoad from "@/app/components/InitialLoad";
import LoadoutComparison from "@/app/components/results/LoadoutComparison";
import TtkComparison from "@/app/components/results/TtkComparison";

const Home: NextPage = observer(() => {
  const store = useStore();
  const {showPreferencesModal} = store.ui;

  useEffect(() => {
    // When the page loads, set up the worker and be ready to interpret the responses
    const worker = new Worker(new URL('../worker.ts', import.meta.url));
    worker.onmessage = (evt: MessageEvent<string>) => {
      const data = JSON.parse(evt.data, WORKER_JSON_REVIVER) as WorkerResponses;

      // Depending on the response type, do things...
      switch (data.type) {
        case WorkerResponseType.COMPUTED_VALUES:
          store.updateCalculator({loadouts: data.data});
          break;
        default:
          break;
      }
    }
    store.setWorker(worker);

    return () => {
      // Terminate the worker when we un-mount this component
      worker?.terminate();
      store.setWorker(null);
    }
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
      case '5':
        // Handle quickly switching between loadouts (max 5)
        const key = parseInt(e.key) - 1;
        if (store.loadouts[key] !== undefined) {
          store.setSelectedLoadout(key);
        }
        break
      default:
        return true;
    }

    // If we get here, we've handled the event, so prevent it bubbling
    e.preventDefault();
  }

  useEffect(() => {
    // Load preferences from browser storage if there are any
    store.loadPreferences();

    // Setup global event handling
    document.addEventListener('keydown', globalKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', globalKeyDownHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When equipment bonuses change, set the current equipment bonuses as the player's bonuses.
    store.updatePlayer({
      bonuses: store.equipmentBonuses.bonuses,
      offensive: store.equipmentBonuses.offensive,
      defensive: store.equipmentBonuses.defensive
    })
  }, [store, store.equipmentBonuses]);

  useEffect(() => {
    const recompute = () => store.doWorkerRecompute();

    // When a calculator input changes, trigger a re-compute on the worker
    const triggers: ((r: IReactionPublic) => any)[] = [
      () => toJS(store.loadouts),
      () => toJS(store.monster),
      () => toJS(store.prefs.showTtkComparison),
      () => toJS(store.prefs.hitDistsHideZeros),
    ];
    const reactions = triggers.map(t => reaction(t, recompute, {fireImmediately: true}))

    return () => {
      for (let r of reactions) {
        r();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Suspense>
        <InitialLoad />
      </Suspense>
      {/* Main container */}
      <div className={'max-w-[1420px] mx-auto sm:my-8'}>
        <div className={'flex gap-2 flex-wrap'}>
          <PlayerContainer />
          <MonsterContainer />
          <ResultsContainer />
        </div>
      </div>
      {/* Additional graphs and stuff */}
      {
        (
          store.prefs.showLoadoutComparison
          || store.prefs.showTtkComparison
        ) && (
          <div className={'bg-btns-100 dark:bg-dark-300 border-t-8 border-body-500 dark:border-dark-200 text-white px-4'}>
            <div className={'max-w-[1420px] mx-auto py-6'}>
              {
                store.prefs.showLoadoutComparison ? (
                  <div className={'grow bg-tile dark:bg-dark-500 md:rounded shadow-lg max-w-[100vw] my-4 text-black'}>
                    <div
                      className={'px-6 py-4 bg-btns-200 dark:bg-dark-400 dark:border-dark-200 text-white md:rounded-t border-b-4 border-body-300'}>
                      <h3 className={'font-serif font-bold'}>Loadout Comparison</h3>
                    </div>
                    <div className={'px-6 py-4'}>
                      <LoadoutComparison/>
                    </div>
                  </div>
                ) : <></>
              }
              {
                store.prefs.showTtkComparison ? (
                  <div className={'grow bg-tile dark:bg-dark-500 md:rounded shadow-lg max-w-[100vw] my-4 text-black'}>
                    <div
                      className={'px-6 py-4 bg-btns-200 dark:bg-dark-400 dark:border-dark-200 text-white md:rounded-t border-b-4 border-body-300'}>
                      <h3 className={'font-serif font-bold'}>Time-to-Kill Comparison</h3>
                    </div>
                    <div className={'px-6 py-4'}>
                      <TtkComparison/>
                    </div>
                  </div>
                ) : <></>
              }
            </div>
          </div>
        )
      }
      <Tooltip id={'tooltip'}/>
      <ToastContainer position={'bottom-right'} hideProgressBar={true} draggable={false} limit={3} closeButton={false}
                      className={'text-sm'}/>
      <PreferencesModal isOpen={showPreferencesModal}/>
    </div>
  )
})

export default Home;
