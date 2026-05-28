import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import Spinner from '@/app/components/Spinner';
import { ACCURACY_PRECISION, DPS_PRECISION, EXPECTED_HIT_PRECISION } from '@/lib/constants';
import { max, min } from 'd3-array';
import { computed } from 'mobx';
import { FeatureStatus, isDefined } from '@/utils';
import { BasicResult, CalcState } from '@/types/Results';
import { ConditionalKeys } from 'type-fest';
import { useLoadouts } from '@/state/LoadoutStore';
import { LoadoutId } from '@/types/Player';
import { usePreferences } from '@/state/Preferences';
import { IconAlertTriangle } from '@tabler/icons-react';
import { clsx } from 'clsx';

type ResultKey = ConditionalKeys<BasicResult, number | undefined>;

const RowHints: { [k in ResultKey]: string } = {
  maxHit: 'The maximum damage the player can deal in a single attack.',
  expectedHit: 'The average damage per attack, including misses.',
  dps: 'The average damage the player can expect to deal per second.',
  ttk: 'The average time it takes for the player to kill the NPC.',
  accuracy: 'The chance for any given attack to hit the target.',
  maxAttackRoll: 'The maximum attack roll the player can achieve.',
  npcDefRoll: 'The defense roll of the NPC.',
  specMaxHit: 'The maximum damage the player can deal with a special attack.',
  specAccuracy: 'The chance for any given special attack to hit the target.',
  specExpectedHit: 'The amount of damage the player can expect to deal with a special attack.',
  specMaxAttackRoll: 'The maximum attack roll the player can achieve with a special attack.',
  specFullDps: 'The average damage the player can expect to deal per second with a special attack.',
  specMomentDps: 'The average damage the player can expect to deal per second with a special attack, considering momentary effects.',
  specNpcDefRoll: 'The defense roll of the NPC when the player uses a special attack.',
};

const calcKeyToString = (value: number, calcKey: keyof BasicResult): string | React.ReactNode => {
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
    case 'specExpectedHit':
      return value.toFixed(EXPECTED_HIT_PRECISION);
    case 'ttk':
      return value === 0
        ? '-----'
        : `${value.toFixed(1)}s`;
    default:
      return value.toString();
  }
};

const ResultSectionHeader: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <tr>
      <th
        className="px-4 italic pl-6 border-r bg-dark-600 select-none text-body-300"
        colSpan={999}
      >
        {children}
      </th>
    </tr>
  );
};

interface ResultCellProps {
  className?: string;
  rowSpan?: number;
  isBest?: boolean;
}

const Cell: React.FC<React.PropsWithChildren<ResultCellProps>> = observer((props) => {
  const {
    className, rowSpan, isBest, children,
  } = props;

  return (
    <td
      rowSpan={rowSpan ?? 1}
      className={clsx(
        'w-28 border-r text-center',
        isBest ? 'text-green-200' : 'text-body-200',
        className,
      )}
    >
      {children}
    </td>
  );
});

interface BasicResultCellProps {
  selector: ResultKey;
  loadingRowSpan: number;
  noSpecRowSpan?: number;
  loadoutId: LoadoutId;
  bestValue?: number;
}

const ResultCell: React.FC<BasicResultCellProps> = observer((props) => {
  const { loadouts } = useLoadouts();
  const {
    selector, loadingRowSpan, noSpecRowSpan, loadoutId, bestValue,
  } = props;

  const loadout = loadouts.get(loadoutId);
  if (!loadout) {
    return null;
  }

  const result = loadout.results.basic;
  if (result.state !== CalcState.COMPLETE && loadingRowSpan === 0) {
    // already covered by a previous row's rowSpan
    return null;
  }

  const hasSpecData = result.state === CalcState.COMPLETE && result.specStatus === FeatureStatus.IMPLEMENTED;
  if (noSpecRowSpan !== undefined && !hasSpecData) {
    if (noSpecRowSpan === 0) {
      return null;
    }
  }

  if (result.state === CalcState.PENDING) {
    return (
      <Cell rowSpan={loadingRowSpan}>
        <Spinner className="w-3" />
      </Cell>
    );
  }

  if (result.state === CalcState.FAILED) {
    return (
      <Cell rowSpan={loadingRowSpan}>
        <IconAlertTriangle className="w-3 text-red-500" />
      </Cell>
    );
  }

  const value = result.state === CalcState.COMPLETE ? result[selector] : undefined;
  if (value === undefined) {
    return (
      <Cell rowSpan={loadingRowSpan} className="text-dark-200 bg-dark-400 text-xs">
        N/A
      </Cell>
    );
  }

  return (
    <Cell isBest={value === bestValue}>
      {calcKeyToString(value, selector)}
    </Cell>
  );
});

interface ResultRowProps {
  title: string;
  selector: ResultKey;
  aggregator: 'min' | 'max';
  loadingRowSpan: number;
  noSpecRowSpan?: number;
}

const ResultRow: React.FC<ResultRowProps> = observer((props) => {
  const { loadouts, allLoadouts } = useLoadouts();
  const {
    title,
    selector,
    aggregator,
    loadingRowSpan,
    noSpecRowSpan,
  } = props;

  const cellValues = computed(() => allLoadouts.map((loadoutId) => {
    const result = loadouts.get(loadoutId)!.results.basic;
    return ({
      loadoutId,
      value: result.state === CalcState.COMPLETE ? result[selector] : undefined,
    });
  })).get();

  const bestValue = computed(() => {
    if (allLoadouts.length < 2 || !aggregator) {
      return undefined;
    }

    const values = cellValues.map((v) => v.value).filter(isDefined);
    return aggregator === 'min' ? min(values) : max(values);
  }).get();

  return (
    <tr>
      <th
        scope="row"
        className="w-40 px-4 border-r bg-dark-500 select-none cursor-help underline decoration-dotted decoration-gray-300"
        title={title}
        data-tooltip-id="tooltip"
        data-tooltip-content={RowHints[selector]}
      >
        {title}
      </th>
      {allLoadouts.map((loadoutId) => (
        <ResultCell
          key={loadoutId}
          selector={selector}
          loadingRowSpan={loadingRowSpan}
          noSpecRowSpan={noSpecRowSpan}
          loadoutId={loadoutId}
          bestValue={bestValue}
        />
      ))}
    </tr>
  );
});

const CondensedResults: React.FC = () => (
  <>
    <ResultRow title="Max hit" selector="maxHit" aggregator="max" loadingRowSpan={5} />
    <ResultRow title="DPS" selector="dps" aggregator="max" loadingRowSpan={0} />
    <ResultRow title="Avg. TTK" selector="ttk" aggregator="min" loadingRowSpan={0} />
    <ResultRow title="Accuracy" selector="accuracy" aggregator="max" loadingRowSpan={0} />
    <ResultRow title="Spec expected hit" selector="specExpectedHit" aggregator="max" noSpecRowSpan={1} loadingRowSpan={0} />
  </>
);

const ExpandedResults: React.FC = () => (
  <>
    <ResultSectionHeader>Basic Attacks</ResultSectionHeader>
    <ResultRow title="Max hit" selector="maxHit" aggregator="max" loadingRowSpan={5} />
    <ResultRow title="Expected hit" selector="expectedHit" aggregator="max" loadingRowSpan={0} />
    <ResultRow title="DPS" selector="dps" aggregator="max" loadingRowSpan={0} />
    <ResultRow title="Avg. TTK" selector="ttk" aggregator="min" loadingRowSpan={0} />
    <ResultRow title="Accuracy" selector="accuracy" aggregator="max" loadingRowSpan={0} />
    <ResultSectionHeader>Rolls</ResultSectionHeader>
    <ResultRow title="Attack roll" selector="maxAttackRoll" aggregator="max" loadingRowSpan={2} />
    <ResultRow title="NPC Defence roll" selector="npcDefRoll" aggregator="min" loadingRowSpan={0} />
    <ResultSectionHeader>Special Attacks</ResultSectionHeader>
    <ResultRow title="Max hit" selector="specMaxHit" aggregator="max" loadingRowSpan={5} noSpecRowSpan={5} />
    <ResultRow title="Expected hit" selector="specExpectedHit" aggregator="max" loadingRowSpan={0} noSpecRowSpan={0} />
    <ResultRow title="DPS" selector="specMomentDps" aggregator="max" loadingRowSpan={0} noSpecRowSpan={0} />
    <ResultRow title="Spec-only DPS" selector="specFullDps" aggregator="max" loadingRowSpan={0} noSpecRowSpan={0} />
    <ResultRow title="Accuracy" selector="specAccuracy" aggregator="max" loadingRowSpan={0} noSpecRowSpan={0} />
  </>
);

const PlayerVsNPCResultsTable: React.FC = observer(() => {
  const { loadouts, selectedLoadout, selectLoadout } = useLoadouts();
  const { resultsExpanded } = usePreferences();

  return (
    <table>
      <thead>
        <tr>
          <th aria-label="blank" className="border-r bg-dark-500 select-none" />
          {[...loadouts.entries()].map(([loadoutId, loadout]) => (
            <th
              scope="col"
              role="button"
              tabIndex={0}
              key={loadoutId}
              className={clsx(
                'text-center w-28 border-r py-1.5 font-bold font-serif leading-tight text-xs cursor-pointer transition-colors',
                selectedLoadout === loadoutId ? 'bg-orange-700' : 'bg-dark-500',
              )}
              onClick={() => selectLoadout(loadoutId)}
            >
              {loadout.basePlayer.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {resultsExpanded ? <ExpandedResults /> : <CondensedResults />}
      </tbody>
    </table>
  );
});

export default PlayerVsNPCResultsTable;
