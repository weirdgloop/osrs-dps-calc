import React, { PropsWithChildren, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { CalculatedLoadout } from '@/types/State';
import { max, min } from 'd3-array';
import HitDistribution from '@/app/components/results/HitDistribution';
import Spinner from '@/app/components/Spinner';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/constants';

interface IResultRowProps {
  calcKey: keyof Omit<CalculatedLoadout, 'ttkDist'>;
  title?: string;
}

const calcKeyToString = (value: number, calcKey: keyof CalculatedLoadout): string | React.ReactNode => {
  if (value === undefined || value === null) {
    // if the value has not yet been populated by the worker
    return <Spinner className="w-3" />;
  }

  switch (calcKey) {
    case 'accuracy':
      return `${(value * 100).toFixed(ACCURACY_PRECISION)}%`;
    case 'dps':
      return value.toFixed(DPS_PRECISION);
    case 'ttk':
      return value === 0
        ? '-----'
        : `${value.toFixed(1)}s`;
    default:
      return `${value}`;
  }
};

const ResultRow: React.FC<PropsWithChildren<IResultRowProps>> = observer((props) => {
  const store = useStore();
  const { children, calcKey, title } = props;
  const { calc } = store;

  const cells = useMemo(() => {
    const aggregator = calcKey === 'ttk' ? min : max;
    const bestValue = aggregator(calc.loadouts, (l) => l[calcKey] as number);

    return calc.loadouts.map((l, i) => {
      const value = l[calcKey] as number;
      // eslint-disable-next-line react/no-array-index-key
      return <th className={`text-center w-28 border-r ${((calc.loadouts.length > 1) && bestValue === value) ? 'dark:text-green-200 text-green-800' : 'dark:text-body-200 text-black'}`} key={i}>{calcKeyToString(value, calcKey)}</th>;
    });
  }, [calc.loadouts, calcKey]);

  return (
    <tr>
      <th className="w-32 px-4 border-r bg-btns-400 dark:bg-dark-500 select-none" title={title}>{children}</th>
      {cells}
    </tr>
  );
});

const ResultsTable: React.FC = observer(() => {
  const store = useStore();
  const { selectedLoadout } = store;

  return (
    <table>
      <thead>
        <tr>
          <th aria-label="blank" className="bg-btns-400 border-r dark:bg-dark-500 select-none" />
          {store.loadouts.map((_, i) => (
            <th
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`text-center w-28 border-r font-bold font-serif cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-500'}`}
              onClick={() => store.setSelectedLoadout(i)}
            >
              {i + 1}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <ResultRow calcKey="maxHit" title="The maximum hit that you will deal to the monster">
          Max hit
        </ResultRow>
        <ResultRow calcKey="dps" title="The average damage you will deal per-second">
          DPS
        </ResultRow>
        <ResultRow calcKey="ttk" title="The average time (in seconds) it will take to defeat the monster">
          Avg. TTK
        </ResultRow>
        <ResultRow calcKey="maxAttackRoll" title="The maximum attack roll based on your current gear (higher is better!)">
          Attack roll
        </ResultRow>
        <ResultRow calcKey="npcDefRoll" title={"The NPC's defense roll (lower is better!)"}>
          NPC def roll
        </ResultRow>
        <ResultRow calcKey="accuracy" title="How accurate you are against the monster">
          Accuracy
        </ResultRow>
      </tbody>
    </table>
  );
});

const ResultsContainer = observer(() => {
  const store = useStore();

  return (
    <div className="grow basis-1/4 md:mt-9 flex flex-col">
      <div
        className="sm:rounded shadow-lg bg-tile dark:bg-dark-300"
      >
        <div
          className="px-4 py-3.5 border-b-body-400 bg-body-100 dark:bg-dark-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center"
        >
          <h1 className="font-serif text-lg tracking-tight font-bold">
            Results
          </h1>
        </div>
        <div className="overflow-x-auto max-w-[100vw]">
          <ResultsTable />
        </div>
      </div>
      <HitDistribution dist={store.calc.loadouts[store.selectedLoadout]?.hitDist || []} />
    </div>
  );
});

export default ResultsContainer;
