import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import Select from '@/app/components/generic/Select';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useTheme } from 'next-themes';
import equipmentStats from '@/public/img/Equipment Stats.png';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import { CompareResult, CompareXAxis, CompareYAxis } from '@/lib/Comparator';
import { CompareRequest, WorkerRequestType } from '@/worker/CalcWorkerTypes';
import { keys } from '@/utils';
import { ChartAnnotation } from '@/types/State';
import { useCalc } from '@/worker/CalcWorker';
import Toggle from '../generic/Toggle';

const XAxisOptions = [
  { label: 'Monster defence level', axisLabel: 'Level', value: CompareXAxis.MONSTER_DEF },
  { label: 'Monster magic level', axisLabel: 'Level', value: CompareXAxis.MONSTER_MAGIC },
  { label: 'Monster HP', axisLabel: 'Hitpoints', value: CompareXAxis.MONSTER_HP },
  { label: 'Player attack level', axisLabel: 'Level', value: CompareXAxis.PLAYER_ATTACK_LEVEL },
  { label: 'Player strength level', axisLabel: 'Level', value: CompareXAxis.PLAYER_STRENGTH_LEVEL },
  { label: 'Player defence level', axisLabel: 'Level', value: CompareXAxis.PLAYER_DEFENCE_LEVEL },
  { label: 'Player ranged level', axisLabel: 'Level', value: CompareXAxis.PLAYER_RANGED_LEVEL },
  { label: 'Player magic level', axisLabel: 'Level', value: CompareXAxis.PLAYER_MAGIC_LEVEL },
  { label: 'Player stat decay', axisLabel: 'Minutes after boost', value: CompareXAxis.STAT_DECAY_RESTORE },
];

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <p>
            <strong>
              {label}
            </strong>
          </p>
          {
            payload.map((p) => (
              <div key={p.name} className="flex justify-between w-40 gap-2">
                <div className="flex items-center gap-1 leading-3 overflow-hidden">
                  <div>
                    <div
                      className="w-3 h-3 inline-block border border-gray-400 rounded-lg"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                  {p.name}
                </div>
                <span className="text-gray-400 font-bold">
                  {p.value === 'NaN' ? '---' : `${p.value}`}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return null;
};

const LoadoutComparison: React.FC = observer(() => {
  const calc = useCalc();
  const store = useStore();
  const monster = JSON.stringify(store.monster);
  const { showLoadoutComparison } = store.prefs;
  const loadouts = JSON.stringify(store.loadouts);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [compareResult, setCompareResult] = useState<CompareResult>();
  const [xAxisType, setXAxisType] = useState<{ label: string, axisLabel?: string, value: CompareXAxis } | null | undefined>(XAxisOptions[0]);
  const [yAxisType, setYAxisType] = useState<{ label: string, axisLabel?: string, value: CompareYAxis } | null | undefined>({ label: 'Player damage-per-second', axisLabel: 'DPS', value: CompareYAxis.PLAYER_DPS });
  const [yAxisFromZero, setYAxisFromZero] = useState(true);

  // recompute the valid y axis options if the monster has reverse dps support
  const YAxisOptions = useMemo(() => {
    const opts = [
      { label: 'Player damage-per-second', axisLabel: 'DPS', value: CompareYAxis.PLAYER_DPS },
      { label: 'Player expected hit', axisLabel: 'Hit', value: CompareYAxis.PLAYER_EXPECTED_HIT },
      { label: 'Time-to-kill', axisLabel: 'Seconds', value: CompareYAxis.PLAYER_TTK },
      // {label: 'Damage taken', value: YAxisType.DAMAGE_TAKEN}
    ];

    if (!store.isNonStandardMonster) {
      opts.push(
        { label: 'Player damage taken per sec', axisLabel: 'DPS', value: CompareYAxis.MONSTER_DPS },
        { label: 'Player damage taken per kill', axisLabel: 'Damage', value: CompareYAxis.DAMAGE_TAKEN },
      );
    }

    return opts;
  }, [store.isNonStandardMonster]);

  // If the list of Y axis options changes, and the option we have selected no longer exists, reset to the first one
  useEffect(() => {
    if (!YAxisOptions.find((opt) => opt.value === yAxisType?.value)) {
      setYAxisType(YAxisOptions[0]);
    }
  }, [yAxisType, YAxisOptions]);

  // recompute results hook
  useEffect(() => {
    if (!showLoadoutComparison || !xAxisType || !yAxisType || !calc.isReady()) {
      setCompareResult(undefined);
      return;
    }

    const req: CompareRequest = {
      type: WorkerRequestType.COMPARE,
      data: {
        loadouts: JSON.parse(loadouts),
        monster: JSON.parse(monster),
        axes: {
          x: xAxisType.value,
          y: yAxisType.value,
        },
      },
    };
    calc.do(req).then((resp) => {
      setCompareResult(resp.payload);
    }).catch((e: unknown) => {
      console.error('[LoadoutComparison] Failed to compute compare results', e);
    });
  }, [showLoadoutComparison, loadouts, monster, xAxisType, yAxisType, calc]);

  const [tickCount, domainMin, domainMax] = useMemo(() => {
    if (!compareResult?.domainMax) {
      return [1, 0, 1];
    }

    const lowest = Math.floor(compareResult.domainMin);
    const highest = Math.ceil(compareResult.domainMax);
    const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
    const ceilHighest = Math.ceil(1 / stepsize * highest) * stepsize - 1 / 1e9;
    const count = 1 + Math.ceil(1 / stepsize * highest);
    return [count, lowest, ceilHighest];
  }, [compareResult]);

  const generateChartLines = useCallback(() => {
    if (!compareResult?.entries.length) {
      return [];
    }

    const strokeColours = isDark
      ? ['cyan', 'yellow', 'lime', 'orange', 'pink']
      : ['blue', 'chocolate', 'green', 'sienna', 'purple'];

    const lines: React.ReactNode[] = [];
    keys(compareResult.entries[0]).forEach((k) => {
      if (k !== 'name') {
        const colour = strokeColours.shift() || 'red';
        lines.push(<Line
          key={k}
          type="monotone"
          dataKey={k}
          stroke={colour}
          dot={false}
          isAnimationActive={false}
        />);
        strokeColours.push(colour);
      }
    });
    return lines;
  }, [compareResult, isDark]);

  const generateAnnotations = useCallback((): React.ReactNode[] => {
    if (!compareResult) {
      return [];
    }

    const toRecharts = (a: ChartAnnotation, x: boolean): React.ReactNode => (
      <ReferenceLine
        key={a.label}
        label={{
          value: a.label, angle: (x ? 90 : 0), fontSize: 12, fill: isDark ? 'white' : 'black',
        }}
        x={x ? a.value : undefined}
        y={!x ? a.value : undefined}
        stroke="red"
        strokeDasharray="6 6"
      />
    );

    return [
      ...compareResult.annotations.x.map((a) => toRecharts(a, true)),
      ...compareResult.annotations.y.map((a) => toRecharts(a, false)),
    ];
  }, [compareResult, isDark]);

  return (
    <SectionAccordion
      defaultIsOpen={showLoadoutComparison}
      onIsOpenChanged={(o) => store.updatePreferences({ showLoadoutComparison: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={equipmentStats.src} /></div>
          <h3 className="font-serif font-bold">
            Loadout Comparison Graph
          </h3>
        </div>
      )}
    >
      {compareResult && (
        <div className="px-6 py-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={compareResult.entries}
              margin={{ top: 40, right: 20 }}
            >
              <XAxis
                allowDecimals
                dataKey="name"
                stroke="#777777"
                interval="equidistantPreserveStart"
                label={{ value: xAxisType?.axisLabel, position: 'insideBottom', offset: -15 }}
              />
              <YAxis
                stroke="#777777"
                domain={[yAxisFromZero ? 0 : domainMin, domainMax]}
                tickCount={tickCount}
                tickFormatter={(v: number) => `${parseFloat(v.toFixed(2))}`}
                interval="equidistantPreserveStart"
                label={{
                  value: yAxisType?.axisLabel, position: 'insideLeft', angle: -90, style: { textAnchor: 'middle' },
                }}
              />
              <CartesianGrid stroke="gray" strokeDasharray="5 5" />
              <Tooltip
                content={(props) => <CustomTooltip {...props} />}
              />
              <Legend wrapperStyle={{ fontSize: '.9em', top: 0 }} />
              {generateChartLines()}
              {generateAnnotations()}
            </LineChart>
          </ResponsiveContainer>
          <div className="my-4 flex flex-wrap md:flex-nowrap gap-4 max-w-lg m-auto dark:text-white">
            <div className="basis-full md:basis-1/2">
              <h3 className="font-serif font-bold mb-2">X axis</h3>
              <Select
                id="loadout-comparison-x"
                items={XAxisOptions}
                value={xAxisType || undefined}
                onSelectedItemChange={(i) => {
                  setXAxisType(i);
                }}
              />
            </div>
            <div className="basis-full md:basis-1/2">
              <div className="flex flex-nowrap gap-4">
                <h3 className="font-serif font-bold mb-2 basis-full">Y axis</h3>
                <Toggle
                  className="shrink-0"
                  checked={yAxisFromZero}
                  setChecked={setYAxisFromZero}
                  label="Start from 0"
                />
              </div>
              <Select
                id="loadout-comparison-y"
                items={YAxisOptions}
                value={yAxisType || undefined}
                onSelectedItemChange={(i) => {
                  setYAxisType(i);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </SectionAccordion>
  );
});

export default LoadoutComparison;
