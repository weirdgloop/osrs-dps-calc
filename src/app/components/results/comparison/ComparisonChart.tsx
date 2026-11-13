import React from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import ComparisonTooltip from '@/app/components/results/comparison/ComparisonTooltip';
import { X_AXIS_OPTIONS, Y_AXIS_OPTIONS } from '@/app/components/results/comparison/comparisonAxes';
import LINE_COLOURS from '@/app/components/results/chartColours';
import { CompareResult } from '@/lib/Comparator';
import { useUI } from '@/state/UIStore';
import { ChartAnnotation } from '@/types/Charts';

const annotationLine = (annotation: ChartAnnotation, isXAxis: boolean) => (
  <ReferenceLine
    key={annotation.label}
    label={{
      value: annotation.label, angle: (isXAxis ? 90 : 0), fontSize: 12, fill: 'white',
    }}
    x={isXAxis ? annotation.value : undefined}
    y={!isXAxis ? annotation.value : undefined}
    stroke="red"
    strokeDasharray="6 6"
  />
);

const axisTicks = (domainMax: number | undefined): [number, number] => {
  if (!domainMax) {
    return [1, 1];
  }

  const highest = Math.ceil(domainMax);
  const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
  const ceilHighest = Math.ceil(1 / stepsize * highest) * stepsize - 1 / 1e9;
  const count = 1 + Math.ceil(1 / stepsize * highest);
  return [count, ceilHighest];
};

const ComparisonChart: React.FC<{ result: CompareResult }> = observer(({ result }) => {
  const ui = useUI();
  const xAxisLabel = X_AXIS_OPTIONS.find((o) => o.value === ui.compareXAxis)?.axisLabel;
  const [tickCount, domainMax] = axisTicks(result.domainMax);
  const lineKeys = Object.keys(result.entries[0] ?? {}).filter((k) => k !== 'name');

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={result.entries}
        margin={{ top: 40, right: 20 }}
      >
        <XAxis
          allowDecimals
          dataKey="name"
          stroke="#777777"
          interval="equidistantPreserveStart"
          label={{ value: xAxisLabel, position: 'insideBottom', offset: -15 }}
        />
        <YAxis
          stroke="#777777"
          domain={[0, domainMax]}
          tickCount={tickCount}
          tickFormatter={(v: number) => `${parseFloat(v.toFixed(2))}`}
          interval="equidistantPreserveStart"
          label={{
            value: Y_AXIS_OPTIONS[ui.compareY].axisLabel, position: 'insideLeft', angle: -90, style: { textAnchor: 'middle' },
          }}
        />
        <CartesianGrid stroke="gray" strokeDasharray="5 5" />
        <Tooltip
          content={(props) => <ComparisonTooltip {...props} />}
        />
        <Legend wrapperStyle={{ fontSize: '.9em', top: 0 }} />
        {lineKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
            dot={false}
            isAnimationActive={false}
          />
        ))}
        {result.annotations.x.map((a) => annotationLine(a, true))}
        {result.annotations.y.map((a) => annotationLine(a, false))}
      </LineChart>
    </ResponsiveContainer>
  );
});

export default ComparisonChart;
