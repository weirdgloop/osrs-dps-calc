import React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { max } from 'd3-array';
import Select from '@/app/components/generic/Select';
import TtkTooltip from '@/app/components/results/ttk/TtkTooltip';
import { TTK_X_AXES, TtkXAxis } from '@/app/components/results/ttk/ttkXAxes';
import LINE_COLOURS from '@/app/components/results/chartColours';
import { useCalc } from '@/state/CalcStore';
import { useLoadouts } from '@/state/LoadoutStore';

interface TtkChartProps {
  xAxis: TtkXAxis;
  setXAxis: (xAxis: TtkXAxis) => void;
}

/**
 * The cumulative chance to have killed the monster by each tick, for every loadout.
 */
const TtkChart: React.FC<TtkChartProps> = observer(({ xAxis, setXAxis }) => {
  const calc = useCalc();
  const loadouts = useLoadouts();

  // worth noting that if the worker is behind,
  // ttkDist may not yet be computed for a specific loadout
  // we should not assume it is populated here
  const distributions = loadouts.loadouts.map((l) => {
    const ttk = calc.results.get(l.uuid)?.ttk;
    return ttk?.status === 'success' ? ttk.value.ttkDist : undefined;
  });
  const longestTtk = max(distributions, (dist) => max(dist?.keys() ?? [])) || 0;

  const runningTotals: number[] = [];
  const data: { name: string, [loadoutId: string]: string }[] = [];
  for (let ttk = 0; ttk <= longestTtk; ttk++) {
    const entry: typeof data[0] = { name: xAxis.toLabel(ttk) };
    distributions.forEach((dist, i) => {
      const chance = dist?.get(ttk);
      if (chance) {
        runningTotals[i] = (runningTotals[i] || 0) + chance;
      }
      entry[loadouts.loadouts[i].uuid] = (runningTotals[i] * 100).toFixed(2);
    });
    data.push(entry);
  }

  return (
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
            label={{ value: xAxis.label, position: 'insideBottom', offset: -15 }}
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
            content={(props) => <TtkTooltip {...props} xAxisLabel={xAxis.label} />}
          />
          <Legend wrapperStyle={{ fontSize: '.9em', top: 0 }} />
          {loadouts.loadouts.map(({ uuid, name }, i) => (
            <Line
              key={uuid}
              isAnimationActive={false}
              type="monotone"
              dataKey={uuid}
              name={name}
              stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="my-4 flex gap-4 max-w-lg m-auto dark:text-white">
        <div className="basis-full md:basis-1/2">
          <h3 className="font-serif font-bold mb-2">X axis</h3>
          <Select
            id="loadout-comparison-x"
            items={TTK_X_AXES}
            value={xAxis}
            onSelectedItemChange={(axis) => axis && setXAxis(axis)}
          />
        </div>
      </div>
    </div>
  );
});

export default TtkChart;
