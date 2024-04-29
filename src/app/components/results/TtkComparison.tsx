import React, { useCallback, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import { toJS } from 'mobx';
import { useTheme } from 'next-themes';
import { max } from 'd3-array';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import hourglass from '@/public/img/Hourglass.png';
import LazyImage from '@/app/components/generic/LazyImage';

export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  xAxisOption: typeof XAxisOptions[0],
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active, payload, label, xAxisOption,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <p>
            <strong>
              Within
              {' '}
              {label}
              {' '}
              {xAxisOption.label}
            </strong>
          </p>
          {
              payload.map((p) => (
                <div key={p.name} className="flex justify-between w-44 gap-1">
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
                    {p.value === 'NaN' ? '---' : `${p.value}%`}
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

enum XAxisType {
  TICKS,
  SECONDS,
}

const SECONDS_PER_TICK = 0.6;
const XAxisOptions = [
  { label: 'Ticks', value: XAxisType.TICKS },
  { label: 'Seconds', value: XAxisType.SECONDS },
];

const TtkComparison: React.FC = observer(() => {
  const store = useStore();
  const { showTtkComparison } = store.prefs;
  const calcResults = toJS(store.calc.loadouts);
  const loadouts = toJS(store.loadouts);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [xAxisType, setXAxisType] = useState<{ label: string, value: XAxisType } | null | undefined>(XAxisOptions[0]);

  // worth noting that if the worker is behind,
  // ttkDist may not yet be computed for a specific loadout
  // we should not assume it is populated here
  const data = useMemo(() => {
    const xAxis = xAxisType?.value;
    const xLabeller = xAxis === XAxisType.SECONDS
      ? (x: number) => (x * SECONDS_PER_TICK).toFixed(1)
      : (x: number) => x.toString();

    const lines: { name: string, [lKey: string]: string | number }[] = [];
    const uniqueTtks = max(Object.values(calcResults), (r) => max(r.ttkDist?.keys() || [])) || 0;

    const runningTotals: number[] = [];
    for (let ttk = 0; ttk <= uniqueTtks; ttk++) {
      const entry: typeof lines[0] = { name: xLabeller(ttk) };
      Object.values(calcResults).forEach((l, i) => {
        const v = l.ttkDist?.get(ttk);
        if (v) {
          runningTotals[i] = (runningTotals[i] || 0) + v;
        }
        if (loadouts[i]) {
          entry[loadouts[i].name] = (runningTotals[i] * 100).toFixed(2);
        }
      });
      lines.push(entry);
    }
    return lines;
  }, [xAxisType, calcResults, loadouts]);

  const generateLines = useCallback(() => {
    const lines: React.ReactNode[] = [];

    const strokeColours = isDark
      ? ['cyan', 'yellow', 'lime', 'orange', 'pink']
      : ['blue', 'chocolate', 'green', 'sienna', 'purple'];
    for (let i = 0; i < Object.values(calcResults).length; i++) {
      // Make sure that the loadout we're plotting actually exists
      if (!loadouts[i]) continue;

      const colour = strokeColours.shift() || 'red';
      lines.push(<Line key={i} isAnimationActive={false} type="monotone" dataKey={loadouts[i].name} stroke={colour} dot={false} connectNulls />);
      strokeColours.push(colour);
    }
    return lines;
  }, [isDark, calcResults, loadouts]);

  return (
    <SectionAccordion
      defaultIsOpen={showTtkComparison}
      onIsOpenChanged={(o) => store.updatePreferences({ showTtkComparison: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={hourglass.src} /></div>
          <h3 className="font-serif font-bold">
            Time-to-Kill Graph
          </h3>
        </div>
      )}
    >
      {data && (
        <div className="px-6 py-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data}
              margin={{ top: 40, right: 20 }}
            >
              <XAxis
                allowDecimals
                dataKey="name"
                stroke="#777777"
                interval="equidistantPreserveStart"
                tickFormatter={(v: string) => `${parseFloat(v)}`}
                label={{ value: xAxisType?.label, position: 'insideBottom', offset: -15 }}
              />
              <YAxis
                stroke="#777777"
                domain={[0, 100]}
                interval="equidistantPreserveStart"
                tickFormatter={(v: number) => `${v}%`}
                label={{
                  value: 'chance', position: 'insideLeft', angle: -90, style: { textAnchor: 'middle' },
                }}
              />
              <CartesianGrid stroke="gray" strokeDasharray="5 5" />
              <Tooltip
                content={(props) => <CustomTooltip {...props} xAxisOption={xAxisType || XAxisOptions[0]} />}
              />
              <Legend wrapperStyle={{ fontSize: '.9em', top: 0 }} />
              {generateLines()}
            </LineChart>
          </ResponsiveContainer>
          <div className="my-4 flex gap-4 max-w-lg m-auto dark:text-white">
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
          </div>
        </div>
      )}
    </SectionAccordion>
  );
});

export default TtkComparison;
