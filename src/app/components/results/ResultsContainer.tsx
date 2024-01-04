import React, {PropsWithChildren, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {
  IconDice,
  IconShield,
  IconSword,
} from "@tabler/icons-react";
import {useStore} from "@/state";
import {CalculatedLoadout} from "@/types/State";
import {max, min} from "d3-array";

interface IResultRowProps {
  calcKey: keyof Omit<CalculatedLoadout, 'ttkDist'>;
  title?: string;
}

const calcKeyToString = (value: number, calcKey: keyof CalculatedLoadout): string => {
    switch (calcKey) {
      case "accuracy":
        return (value * 100).toFixed(2) + '%';
      case "dps":
        return value.toFixed(3);
      case 'ttk':
        return value.toFixed(3) + 's';
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
    let highestValue = aggregator(calc.loadouts, l => l[calcKey] as number);

    return calc.loadouts.map((l, i) => {
      const value = l[calcKey] as number;
      return <th className={`text-center ${((calc.loadouts.length > 1) && highestValue === value) ? 'font-bold' : ''}`} key={i}>{calcKeyToString(value, calcKey)}</th>
    })
  }, [calc.loadouts, calcKey])

  return (
    <tr>
      <th className={'bg-btns-400 dark:bg-dark-400 w-40 select-none'} title={title}>{children}</th>
      {cells}
    </tr>
  )
})

const ResultsTable: React.FC = observer(() => {
  const store = useStore();
  const {selectedLoadout} = store;

  return (
    <table className={'min-w-[300px] w-auto mx-auto'}>
      <thead>
      <tr>
        <th className={'border-0'}></th>
        {store.loadouts.map((_, i) => (
          <th
            key={i}
            className={`text-center cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-300'}`}
            onClick={() => store.setSelectedLoadout(i)}
          >Loadout {i + 1}</th>
        ))}
      </tr>
      </thead>
      <tbody>
        <ResultRow calcKey={'maxHit'} title={'The maximum hit that you will deal to the monster'}>
          <IconSword className={'inline-block'} /> Max hit
        </ResultRow>
        <ResultRow calcKey={'dps'} title={'The average damage you will deal per-second'}>
          <IconSword className={'inline-block'} /> DPS
        </ResultRow>
        <ResultRow calcKey={'ttk'} title={'The average time (in seconds) it will take to defeat the monster'}>
          <IconSword className={'inline-block'} /> Avg. TTK
        </ResultRow>
        <ResultRow calcKey={'maxAttackRoll'} title={'The maximum attack roll based on your current gear (higher is better!)'}>
          <IconDice className={'inline-block'} /> Attack roll
        </ResultRow>
        <ResultRow calcKey={'npcDefRoll'} title={"The NPC's defense roll (lower is better!)"}>
          <IconShield className={'inline-block'} /> NPC def roll
        </ResultRow>
        <ResultRow calcKey={'accuracy'} title={'How accurate you are against the monster'}>
          <IconShield className={'inline-block'} /> Accuracy
        </ResultRow>
      </tbody>
    </table>
  )
})

const ResultsContainer = observer(() => {
  return (
    <div className={'my-4'}>
      <div className={'mx-2 overflow-x-auto'}>
        <ResultsTable />
      </div>
    </div>
  )
})

export default ResultsContainer;
