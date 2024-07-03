import React, { PropsWithChildren, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { PlayerVsNPCCalculatedLoadout } from '@/types/State';
import Spinner from '@/app/components/Spinner';
import { ACCURACY_PRECISION, DPS_PRECISION, EXPECTED_HIT_PRECISION } from '@/lib/constants';
import { max, min } from 'd3-array';
import { toJS } from 'mobx';

interface IResultRowProps {
  calcKey: keyof Omit<PlayerVsNPCCalculatedLoadout, 'ttkDist'>;
  title?: string;
}

const calcKeyToString = (value: number, calcKey: keyof PlayerVsNPCCalculatedLoadout): string | React.ReactNode => {
  if (value === undefined || value === null) {
    // if the value has not yet been populated by the worker
    return <Spinner className="w-3" />;
  }

  switch (calcKey) {
    case 'accuracy':
      return `${(value * 100).toFixed(ACCURACY_PRECISION)}%`;
    case 'dps':
      return value.toFixed(DPS_PRECISION);
    case 'expectedHit':
      return value.toFixed(EXPECTED_HIT_PRECISION);
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
  const loadouts = toJS(calc.loadouts);

  const cells = useMemo(() => {
    const aggregator = ['ttk', 'npcDefRoll'].includes(calcKey) ? min : max;
    const bestValue = aggregator(Object.values(loadouts).filter((l) => (calcKey === 'ttk' ? l[calcKey] !== 0 : true)), (l) => l[calcKey] as number);

    return Object.values(loadouts).map((l, i) => {
      const value = l[calcKey] as number;
      // eslint-disable-next-line react/no-array-index-key
      return <th className={`text-center w-28 border-r ${((Object.values(loadouts).length > 1) && bestValue === value) ? 'dark:text-green-200 text-green-800' : 'dark:text-body-200 text-black'}`} key={i}>{calcKeyToString(value, calcKey)}</th>;
    });
  }, [loadouts, calcKey]);

  return (
    <tr>
      <th className="w-36 px-4 border-r bg-btns-400 dark:bg-dark-500 select-none cursor-help" title={title}>{children}</th>
      {cells}
    </tr>
  );
});

const PlayerVsNPCResultsTable: React.FC = observer(() => {
  const store = useStore();
  const { selectedLoadout } = store;
  const { resultsExpanded } = store.prefs;

  return (
    <table>
      <thead>
        <tr>
          <th aria-label="blank" className="bg-btns-400 border-r dark:bg-dark-500 select-none" />
          {store.loadouts.map(({ name }, i) => (
            <th
            // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={`text-center w-28 border-r py-1.5 font-bold font-serif leading-tight text-xs cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-500'}`}
              onClick={() => store.setSelectedLoadout(i)}
            >
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <ResultRow calcKey="maxHit" title="The maximum hit that you will deal to the monster">
          Max hit
        </ResultRow>
        {resultsExpanded && (
          <ResultRow calcKey="expectedHit" title="The average damage per attack, including misses.">
            Expected hit
          </ResultRow>
        )}
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

export default PlayerVsNPCResultsTable;
