import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import { max, min } from 'd3-array';
import { ConditionalKeys } from 'type-fest';
import Spinner from '@/app/components/Spinner';
import ResultCell from '@/app/components/results/table/ResultCell';
import FailedCell from '@/app/components/results/table/FailedCell';
import UserIssueType from '@/enums/UserIssueType';
import { ACCURACY_PRECISION, DPS_PRECISION, EXPECTED_HIT_PRECISION } from '@/lib/constants';
import { BasicResult, useCalc } from '@/state/CalcStore';
import { useLoadouts } from '@/state/LoadoutStore';

export type BasicResultKey = ConditionalKeys<BasicResult, number | undefined>;

interface PlayerVsNPCResultRowProps {
  calcKey: BasicResultKey;
  title: string;
  collapseSpecs?: boolean;
}

const formatValue = (value: number | undefined, calcKey: BasicResultKey): React.ReactNode => {
  if (value === undefined || value === null) {
    return (<p className="text-sm">---</p>);
  }

  switch (calcKey) {
    case 'accuracy':
    case 'specAccuracy':
      return `${(value * 100).toFixed(ACCURACY_PRECISION)}%`;
    case 'dps':
    case 'specMomentDps':
      return value.toFixed(DPS_PRECISION);
    case 'specFullDps':
      return value.toPrecision(DPS_PRECISION);
    case 'expectedHit':
    case 'specExpected':
      return value.toFixed(EXPECTED_HIT_PRECISION);
    case 'ttk':
      return value === 0
        ? '-----'
        : `${value.toFixed(1)}s`;
    default:
      return `${value}`;
  }
};

const PlayerVsNPCResultRow: React.FC<PropsWithChildren<PlayerVsNPCResultRowProps>> = observer(({
  calcKey, title, collapseSpecs, children,
}) => {
  const loadouts = useLoadouts();
  const calc = useCalc();

  const results = loadouts.loadouts.map((l) => calc.results.get(l.uuid)?.basic);
  const aggregator = ['ttk', 'npcDefRoll'].includes(calcKey) ? min : max;
  const values = results.flatMap((r) => {
    const value = r?.status === 'success' ? r.value[calcKey] : undefined;
    return value === undefined ? [] : [value];
  });
  const bestValue = aggregator(values.filter((v) => (calcKey === 'ttk' ? v !== 0 : true)));

  return (
    <tr>
      <th className="w-40 px-4 border-r bg-btns-400 dark:bg-dark-500 select-none cursor-help underline decoration-dotted decoration-gray-300" title={title}>{children}</th>
      {results.map((result, i) => {
        const { uuid } = loadouts.loadouts[i];

        if (result?.status === 'failed') {
          return <FailedCell key={uuid} error={result.error} />;
        }
        if (result?.status !== 'success') {
          return <ResultCell key={uuid}><Spinner className="w-3" /></ResultCell>;
        }

        const value = result.value[calcKey];
        if (calcKey.startsWith('spec') && value === undefined) {
          // results are in, but the weapon has no implemented special attack
          // we colspan on the first entry (specAccuracy) if extended, and just return nothing for the rest
          if (calcKey !== 'specAccuracy' && collapseSpecs) {
            return null;
          }
          const isUnsupported = calc.userIssues.get(uuid)?.some((issue) => issue.type === UserIssueType.EQUIPMENT_SPEC_UNSUPPORTED);
          return (
            <th key={uuid} rowSpan={5} className="w-28 border-r bg-dark-400 text-dark-200 text-center text-xs">
              {isUnsupported ? 'Not implemented' : 'N/A'}
            </th>
          );
        }

        return (
          <ResultCell key={uuid} isBest={loadouts.loadouts.length > 1 && bestValue === value}>
            {formatValue(value, calcKey)}
          </ResultCell>
        );
      })}
    </tr>
  );
});

export default PlayerVsNPCResultRow;
