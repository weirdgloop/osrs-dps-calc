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
              {label}
              {' '}
              {xAxisOption.label}
            </strong>
          </p>
          {
              payload.map((p) => (
                <div key={p.name} className="flex justify-between w-32">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 inline-block border border-gray-400 rounded-lg" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </div>
                  <span className="text-gray-400 font-bold">{p.value}</span>
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
  const calcResults = toJS(store.calc.loadouts);

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
    const uniqueTtks = max(calcResults, (r) => max(r.ttkDist?.keys() || [])) || 0;

    for (let ttk = 0; ttk <= uniqueTtks; ttk++) {
      const entry: typeof lines[0] = { name: xLabeller(ttk) };
      calcResults.forEach((l, i) => {
        const v = l.ttkDist?.get(ttk);
        if (v) {
          entry[`Loadout ${i + 1}`] = v.toFixed(4);
        }
      });
      lines.push(entry);
    }
    return lines;
  }, [xAxisType, calcResults]);

  const generateLines = useCallback(() => {
    const lines: React.ReactNode[] = [];

    const strokeColours = isDark
      ? ['cyan', 'yellow', 'lime', 'orange', 'pink']
      : ['blue', 'chocolate', 'green', 'sienna', 'purple'];
    for (let i = 0; i < calcResults.length; i++) {
      const colour = strokeColours.shift() || 'red';
      lines.push(<Line key={i} isAnimationActive={false} type="monotone" dataKey={`Loadout ${i + 1}`} stroke={colour} dot={false} connectNulls />);
      strokeColours.push(colour);
    }
    return lines;
  }, [isDark, calcResults.length]);

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
        >
          <XAxis
            allowDecimals
            dataKey="name"
            stroke="#777777"
            interval="equidistantPreserveStart"
          />
          <YAxis
            stroke="#777777"
            domain={[0, 'dataMax']}
            interval="equidistantPreserveStart"
          />
          <CartesianGrid stroke="gray" strokeDasharray="5 5" />
          <Tooltip
            content={(props) => <CustomTooltip {...props} xAxisOption={xAxisType || XAxisOptions[0]} />}
          />
          <Legend wrapperStyle={{ fontSize: '.9em' }} />
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
    </>
  );
});

export default TtkComparison;
