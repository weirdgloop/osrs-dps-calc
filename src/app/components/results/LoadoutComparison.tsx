import React, {
  useCallback, useEffect, useMemo,
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
import {
  makeAutoObservable, toJS,
} from 'mobx';
import { useTheme } from 'next-themes';
import equipmentStats from '@/public/img/Equipment Stats.png';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import { CompareResult, CompareXAxis, CompareYAxis } from '@/lib/Comparator';
import { CompareRequest, WorkerRequestType } from '@/worker/CalcWorkerTypes';
import { Debouncer, keys } from '@/utils';
import { ChartAnnotation } from '@/types/State';
import CalcWorker from '@/worker/CalcWorker';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';

class ComparisonStore {
  private readonly debouncer: Debouncer;

  private readonly worker: CalcWorker;

  private sequenceId: number = -1;

  _result?: CompareResult;

  get result() { return this._result; }

  set result(v) { this._result = v; }

  _xAxis: { label: string, axisLabel?: string, value: CompareXAxis } = { label: 'Monster defence level', axisLabel: 'Level', value: CompareXAxis.MONSTER_DEF };

  get xAxis() { return this._xAxis; }

  set xAxis(v) { this._xAxis = v; }

  _yAxis: { label: string, axisLabel?: string, value: CompareYAxis } = { label: 'Player damage-per-second', axisLabel: 'DPS', value: CompareYAxis.PLAYER_DPS };

  get yAxis() { return this._yAxis; }

  set yAxis(v) { this._yAxis = v; }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.debouncer = new Debouncer(250);
    this.worker = new CalcWorker();
    this.worker.initWorker();
  }

  async recompute(loadouts: Player[], monster: Monster) {
    await this.debouncer.debounce();
    const req: CompareRequest = {
      type: WorkerRequestType.COMPARE,
      data: {
        loadouts,
        monster,
        axes: {
          x: this.xAxis.value,
          y: this.yAxis.value,
        },
      },
    };
    const { sequenceId, promise } = this.worker.do(req);
    this.sequenceId = sequenceId;

    await promise.then((resp) => {
      if (resp.sequenceId === this.sequenceId && !resp.error) {
        this.result = resp.payload;
      }
    });
  }
}
const comparisonStore = new ComparisonStore();

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

function stringToHash(string) {
  let hash = 0;

  if (string.length === 0) return hash;

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash;
  }

  return hash;
}

const LoadoutComparison: React.FC = observer(() => {
  const store = useStore();
  const { monster } = store;
  const { showLoadoutComparison } = store.prefs;
  const loadouts = toJS(store.loadouts);
  console.log(stringToHash(JSON.stringify(loadouts)));

  const compareData = toJS(comparisonStore.result);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const YAxisOptions = useMemo(() => {
    const opts = [
      { label: 'Player damage-per-second', axisLabel: 'DPS', value: CompareYAxis.PLAYER_DPS },
      { label: 'Player expected hit', axisLabel: 'Hit', value: CompareYAxis.PLAYER_EXPECTED_HIT },
      // {label: 'Time-to-kill', value: YAxisType.TTK},
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

  useEffect(() => {
    // If the list of Y axis options changes, and the option we have selected no longer exists, reset to the first one
    if (!YAxisOptions.find((opt) => opt.value === comparisonStore.yAxis.value)) {
      comparisonStore.yAxis = YAxisOptions[0];
    }
  }, [YAxisOptions]);

  useEffect(() => {
    if (!showLoadoutComparison) {
      comparisonStore.result = undefined;
      return;
    }

    comparisonStore.recompute(loadouts, monster)
      .catch(console.error);
  }, [showLoadoutComparison, loadouts, monster]);

  const [tickCount, domainMax] = useMemo(() => {
    if (!compareData?.domainMax) {
      return [1, 1];
    }

    const highest = compareData.domainMax;
    const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
    const ceilHighest = Math.ceil(1 / stepsize * highest) * stepsize - 1 / 1e9;
    const count = 1 + Math.ceil(1 / stepsize * highest);
    return [count, ceilHighest];
  }, [compareData]);

  const generateChartLines = useCallback(() => {
    if (!compareData?.entries.length) {
      return [];
    }

    const strokeColours = isDark
      ? ['cyan', 'yellow', 'lime', 'orange', 'pink']
      : ['blue', 'chocolate', 'green', 'sienna', 'purple'];

    const lines: React.ReactNode[] = [];
    keys(compareData.entries[0]).forEach((k) => {
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
  }, [compareData, isDark]);

  const generateAnnotations = useCallback((): React.ReactNode[] => {
    if (!compareData) {
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
      ...compareData.annotations.x.map((a) => toRecharts(a, true)),
      ...compareData.annotations.x.map((a) => toRecharts(a, false)),
    ];
  }, [compareData, isDark]);

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
      {compareData && (
        <div className="px-6 py-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={compareData.entries}
              margin={{ top: 40, right: 20 }}
            >
              <XAxis
                allowDecimals
                dataKey="name"
                stroke="#777777"
                interval="equidistantPreserveStart"
                label={{ value: comparisonStore.xAxis.axisLabel, position: 'insideBottom', offset: -15 }}
              />
              <YAxis
                stroke="#777777"
                domain={[0, domainMax]}
                tickCount={tickCount}
                tickFormatter={(v: number) => `${parseFloat(v.toFixed(2))}`}
                interval="equidistantPreserveStart"
                label={{
                  value: comparisonStore.yAxis.axisLabel, position: 'insideLeft', angle: -90, style: { textAnchor: 'middle' },
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
                value={comparisonStore.xAxis}
                onSelectedItemChange={(i) => {
                  comparisonStore.xAxis = i!;
                }}
              />
            </div>
            <div className="basis-full md:basis-1/2">
              <h3 className="font-serif font-bold mb-2">Y axis</h3>
              <Select
                id="loadout-comparison-y"
                items={YAxisOptions}
                value={comparisonStore.yAxis}
                onSelectedItemChange={(i) => {
                  comparisonStore.yAxis = i!;
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
