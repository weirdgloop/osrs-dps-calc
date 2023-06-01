'use client';

import type {NextPage} from 'next';
import Head from 'next/head';
import MonsterContainer from '@/app/components/monster/MonsterContainer';
import {Tooltip} from 'react-tooltip';
import React, {useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import {ToastContainer} from 'react-toastify';
import PlayerContainer from "@/app/components/player/PlayerContainer";
import ResultsContainer from "@/app/components/results/ResultsContainer";
import {IconChartBar} from "@tabler/icons-react";
import LoadoutComparison from "@/app/components/results/LoadoutComparison";
import {RecomputeValuesRequest, WorkerRequestType, WorkerResponses, WorkerResponseType} from "@/types/WorkerData";
import {reaction, toJS} from "mobx";
import {Player} from "@/types/Player";
import {Monster} from "@/types/Monster";
import localforage from "localforage";
import {getEquipmentForLoadout} from "@/utils";
import {useSearchParams} from "next/navigation";
import PreferencesModal from "@/app/components/PreferencesModal";

const Home: NextPage = observer(() => {
  const store = useStore();
  const searchParams = useSearchParams();
  const {showPreferencesModal} = store.ui;

  const workerRef = useRef<Worker>();

  const doWorkerRecompute = (p: Player[], m: Monster) => {
    if (workerRef.current) {
      const loadouts = p.map((i) => {
        return {
          ...i,
          equipment: getEquipmentForLoadout(i)
        }
      });

      workerRef.current?.postMessage(JSON.stringify({
        type: WorkerRequestType.RECOMPUTE_VALUES,
        data: {
          loadouts,
          monster: m
        }
      } as RecomputeValuesRequest))
    }
  }

  useEffect(() => {
    // When the page loads, set up the worker and be ready to interpret the responses
    workerRef.current = new Worker(new URL('../worker.ts', import.meta.url));
    workerRef.current.onmessage = (evt: MessageEvent<string>) => {
      const data = JSON.parse(evt.data) as WorkerResponses;

      // Depending on the response type, do things...
      switch (data.type) {
        case WorkerResponseType.COMPUTED_VALUES:
          store.updateCalculator({loadouts: data.data});
          break;
        default:
          break;
      }
    }

    return () => {
      // Terminate the worker when we un-mount this component
      workerRef.current?.terminate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Load preferences from browser storage if there are any
    store.loadPreferences();
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
    // When any of store.player or store.monster changes, run a re-compute of the calculator
    const r1 = reaction(() => toJS(store.loadouts), (data) => { doWorkerRecompute(data, store.monster) })
    const r2 = reaction(() => toJS(store.monster), (data) => { doWorkerRecompute(store.loadouts, data) })

    return () => {
      r1();
      r2();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      // If there was a share ID provided, load the data for it into the calculator
      store.loadShortlink(id);
    } else {
      // Else, load username from browser storage if there is one and lookup stats
      localforage.getItem('dps-calc-username').then((u) => {
        store.updateUIState({username: u as string});
        if (u !== '') store.fetchCurrentPlayerSkills();
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
        {/* Additional graphs and stuff */}
        <div className={'bg-btns-100 border-t-8 border-body-500 text-white px-4'}>
            <div className={'max-w-[1200px] mx-auto py-6'}>
                <h1 className={'font-bold mb-2 text-white text-xl font-serif'}>
                    <IconChartBar className={'inline-block mr-1'} />
                    Additional data and graphs
                </h1>
              {
                store.prefs.showLoadoutComparison ? (
                  <div className={'grow bg-tile md:rounded shadow-lg max-w-[100vw] my-4 text-black'}>
                    <div className={'px-6 py-4 bg-btns-200 text-white md:rounded-t border-b-4 border-body-300'}>
                      <h3 className={'font-serif font-bold'}>Loadout Comparison</h3>
                    </div>
                    <div className={'px-6 py-4'}>
                      <LoadoutComparison />
                    </div>
                  </div>
                ) : (
                  <p className={'text-sm'}>You can enable additional outputs by <button className={'underline'} onClick={() => store.updateUIState({showPreferencesModal: true})}>changing your preferences</button>.</p>
                )
              }
            </div>
        </div>
      <Tooltip id={'tooltip'} />
      <ToastContainer position={'bottom-right'} hideProgressBar={true} draggable={false} limit={3} closeButton={false} className={'text-sm'} />
      {showPreferencesModal && <PreferencesModal isOpen={showPreferencesModal} />}
    </div>
  )
})

export default Home;
