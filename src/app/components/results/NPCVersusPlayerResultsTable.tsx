import React, { PropsWithChildren, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { NPCVsPlayerCalculatedLoadout } from '@/types/State';
import Spinner from '@/app/components/Spinner';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/lib/constants';
import { max, min } from 'd3-array';
import { toJS } from 'mobx';

interface IResultRowProps {
  calcKey: keyof NPCVsPlayerCalculatedLoadout;
  title?: string;
}

const calcKeyToString = (value: number, calcKey: keyof NPCVsPlayerCalculatedLoadout): string | React.ReactNode => {
  if (value === undefined || value === null) {
    // if the value has not yet been populated by the worker
    return <Spinner className="w-3" />;
  }

  switch (calcKey) {
    case 'npcAccuracy':
      return `${(value * 100).toFixed(ACCURACY_PRECISION)}%`;
    case 'npcDps':
      return value.toFixed(DPS_PRECISION);
    case 'avgDmgTaken':
      return value === 0
        ? '-----'
        : `${value.toFixed(DPS_PRECISION)}`;
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
    const aggregator = calcKey === 'playerDefRoll' ? max : min;
    const bestValue = aggregator(Object.values(loadouts).filter((l) => (calcKey === 'avgDmgTaken' ? l[calcKey] !== 0 : true)), (l) => l[calcKey] as number);

    return Object.values(loadouts).map((l, i) => {
      const value = l[calcKey] as number;
      // eslint-disable-next-line react/no-array-index-key
      return <th className={`text-center w-28 border-r ${((Object.values(loadouts).length > 1) && bestValue === value) ? 'dark:text-green-200 text-green-800' : 'dark:text-body-200 text-black'}`} key={i}>{calcKeyToString(value, calcKey)}</th>;
    });
  }, [loadouts, calcKey]);

  return (
    <tr>
      <th className="w-50 px-4 border-r bg-btns-400 dark:bg-dark-500 select-none cursor-help underline decoration-dotted decoration-gray-300" title={title}>{children}</th>
      {cells}
    </tr>
  );
});

const NPCVersusPlayerResultsTable: React.FC = observer(() => {
  const store = useStore();
  const { selectedLoadout } = store;

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
        <ResultRow calcKey="npcMaxHit" title="The maximum hit that the NPC will do to you">
          NPC max hit
        </ResultRow>
        <ResultRow calcKey="npcDps" title="The average damage the NPC will deal per-second">
          Damage taken per sec
        </ResultRow>
        <ResultRow calcKey="avgDmgTaken" title="The average damage you will receive from this NPC, per kill">
          Avg. damage taken per kill
        </ResultRow>
        <ResultRow calcKey="npcMaxAttackRoll" title="The maximum attack roll for the NPC (lower is better!)">
          NPC attack roll
        </ResultRow>
        <ResultRow calcKey="playerDefRoll" title={"The player's defense roll (higher is better!)"}>
          Player def roll
        </ResultRow>
        <ResultRow calcKey="npcAccuracy" title="How accurate the NPC is against you">
          NPC accuracy
        </ResultRow>
      </tbody>
    </table>
  );
});

export default NPCVersusPlayerResultsTable;
