import React, {PropsWithChildren, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from "@/state";
import {CalculatedLoadout} from "@/types/State";
import {max, min} from "d3-array";
import Toggle from "@/app/components/generic/Toggle";
import HitDistribution from "@/app/components/results/HitDistribution";
import Spinner from "@/app/components/Spinner";

interface IResultRowProps {
  calcKey: keyof Omit<CalculatedLoadout, 'ttkDist'>;
  title?: string;
}

const calcKeyToString = (value: number, calcKey: keyof CalculatedLoadout): string | React.ReactNode => {
  if (!value) {
    // if the value has not yet been populated by the worker
    return <Spinner className={'w-3'} />;
  }

  switch (calcKey) {
    case "accuracy":
      return (value * 100).toFixed(2) + '%';
    case "dps":
      return value.toFixed(3);
    case 'ttk':
      return value.toFixed(1) + 's';
    default:
      return "" + value;
  }
}

const ResultRow: React.FC<PropsWithChildren<IResultRowProps>> = observer((props) => {
  const store = useStore();
  const {children, calcKey, title} = props;
  const {calc} = store;

  const cells = useMemo(() => {
    const aggregator = calcKey === 'ttk' ? min : max;
    let bestValue = aggregator(calc.loadouts, l => l[calcKey] as number);

    return calc.loadouts.map((l, i) => {
      const value = l[calcKey] as number;
      return <th className={`text-center w-28 border-r ${((calc.loadouts.length > 1) && bestValue === value) ? 'dark:text-green-200 text-green-800' : 'dark:text-body-200 text-black'}`} key={i}>{calcKeyToString(value, calcKey)}</th>
    })
  }, [calc.loadouts, calcKey])

  return (
    <tr>
      <th className={'w-32 px-4 border-r bg-btns-400 dark:bg-dark-400 select-none'} title={title}>{children}</th>
      {cells}
    </tr>
  )
})

const ResultsTable: React.FC = observer(() => {
  const store = useStore();
  const {selectedLoadout} = store;

  return (
    <table>
      <thead>
      <tr>
        <th className={'bg-btns-400 border-r dark:bg-dark-400 select-none'} />
        {store.loadouts.map((_, i) => (
          <th
            key={i}
            className={`text-center w-28 border-r font-bold font-serif cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-300'}`}
            onClick={() => store.setSelectedLoadout(i)}
          >{i + 1}</th>
        ))}
      </tr>
      </thead>
      <tbody>
        <ResultRow calcKey={'maxHit'} title={'The maximum hit that you will deal to the monster'}>
          Max hit
        </ResultRow>
        <ResultRow calcKey={'dps'} title={'The average damage you will deal per-second'}>
          DPS
        </ResultRow>
        <ResultRow calcKey={'ttk'} title={'The average time (in seconds) it will take to defeat the monster'}>
          Avg. TTK
        </ResultRow>
        <ResultRow calcKey={'maxAttackRoll'} title={'The maximum attack roll based on your current gear (higher is better!)'}>
          Attack roll
        </ResultRow>
        <ResultRow calcKey={'npcDefRoll'} title={"The NPC's defense roll (lower is better!)"}>
          NPC def roll
        </ResultRow>
        <ResultRow calcKey={'accuracy'} title={'How accurate you are against the monster'}>
          Accuracy
        </ResultRow>
      </tbody>
    </table>
  )
})

const ResultsContainer = observer(() => {
  const store = useStore();
  const {prefs} = store;

  return (
    <div className={'grow basis-1/4 md:mt-9 flex flex-col'}>
      <div
        className={'sm:rounded shadow-lg bg-body-100 dark:bg-dark-400'}>
        <div
          className={'px-4 py-3.5 border-b-body-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center'}
        >
          <h1 className={`font-serif text-lg tracking-tight font-bold`}>
            Results
          </h1>
        </div>
        <div className={'overflow-x-auto max-w-[100vw]'}>
          <ResultsTable/>
        </div>
      </div>
      {
        prefs.showHitDistribution && (
          <div className={'my-3 sm:rounded shadow-lg bg-body-100 dark:bg-dark-400'}>
            <div
              className={'px-4 py-3.5 border-b-body-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center'}
            >
              <h1 className={`font-serif text-lg tracking-tight font-bold`}>
                Hit Distribution (Loadout {store.selectedLoadout + 1})
              </h1>
              <div>
                <Toggle
                  checked={prefs.hitDistsHideZeros}
                  setChecked={(c) => store.updatePreferences({hitDistsHideZeros: c})}
                  label={"Hide 0s"}
                />
              </div>
            </div>
            <div>
              <div className={'mt-2 px-2'}>
                <HitDistribution dist={store.calc.loadouts[store.selectedLoadout]?.hitDist || []}/>
              </div>
            </div>
          </div>
        )
      }
      <div className={'text-xs my-3 mx-1 text-dark-300 dark:text-body-200 text-center'}>
        To display additional output graphs,{' '}
        <a href={'#'} onClick={() => store.updateUIState({showPreferencesModal: true})}>change your preferences</a>.
      </div>
    </div>
  )
})

export default ResultsContainer;
