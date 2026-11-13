import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { max, min } from 'd3-array';
import { ConditionalKeys } from 'type-fest';
import Spinner from '@/app/components/Spinner';
import ResultCell from '@/app/components/results/table/ResultCell';
import FailedCell from '@/app/components/results/table/FailedCell';
import { ACCURACY_PRECISION, DPS_PRECISION } from '@/lib/constants';
import { ReverseResult, useCalc } from '@/state/CalcStore';
import { useLoadouts } from '@/state/LoadoutStore';

export type ReverseResultKey = ConditionalKeys<ReverseResult, number | undefined>;

interface NPCVersusPlayerResultRowProps {
  calcKey: ReverseResultKey;
  title: string;
}

const formatValue = (value: number | undefined, calcKey: ReverseResultKey): React.ReactNode => {
  if (value === undefined || value === null) {
    return (<p className="text-sm">---</p>);
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

const NPCVersusPlayerResultRow: React.FC<PropsWithChildren<NPCVersusPlayerResultRowProps>> = observer(({
  calcKey, title, children,
}) => {
  const loadouts = useLoadouts();
  const calc = useCalc();

  const results = loadouts.loadouts.map((l) => calc.results.get(l.uuid)?.reverse);
  const aggregator = calcKey === 'playerDefRoll' ? max : min;
  const values = results.flatMap((r) => {
    const value = r?.status === 'success' ? r.value[calcKey] : undefined;
    return value === undefined ? [] : [value];
  });
  const bestValue = aggregator(values.filter((v) => (calcKey === 'avgDmgTaken' ? v !== 0 : true)));

  return (
    <tr>
      <th className="w-50 px-4 border-r bg-btns-400 dark:bg-dark-500 select-none cursor-help underline decoration-dotted decoration-gray-300" title={title}>{children}</th>
      {results.map((result, i) => {
        const { uuid } = loadouts.loadouts[i];

        if (result?.status === 'failed') {
          return <FailedCell key={uuid} error={result.error} />;
        }
        if (result?.status !== 'success') {
          return <ResultCell key={uuid}><Spinner className="w-3" /></ResultCell>;
        }

        const value = result.value[calcKey];
        return (
          <ResultCell key={uuid} isBest={loadouts.loadouts.length > 1 && bestValue === value}>
            {formatValue(value, calcKey)}
          </ResultCell>
        );
      })}
    </tr>
  );
});

export default NPCVersusPlayerResultRow;
