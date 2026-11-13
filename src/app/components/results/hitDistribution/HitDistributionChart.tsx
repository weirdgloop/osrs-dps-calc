import React from 'react';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { max } from 'd3-array';
import HitDistributionTooltip from '@/app/components/results/hitDistribution/HitDistributionTooltip';
import { ChartEntry } from '@/types/Charts';

const trimTail = (data: ChartEntry[]): ChartEntry[] => {
  if (data.length < 50) {
    return data;
  }

  const aboveThreshold = data.filter((d) => (d.value as number) > 0.0001);
  if (aboveThreshold.length === 0) {
    return data;
  }

  const xMax = parseInt(aboveThreshold[aboveThreshold.length - 1].name as string);
  return data.slice(0, xMax + 1);
};

const HitDistributionChart: React.FC<{ data: ChartEntry[] }> = ({ data }) => {
  const highest = max(data, (d) => d.value as number)!;
  const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
  const domainMax = Math.ceil(1 / stepsize * highest) * stepsize;
  const tickCount = 1 + Math.ceil(1 / stepsize * highest);

  return (
    <ResponsiveContainer width="100%" height={225}>
      <BarChart
        data={trimTail(data)}
        margin={{ top: 11, left: 25, bottom: 20 }}
      >
        <XAxis
          dataKey="name"
          stroke="#777777"
          interval="equidistantPreserveStart"
          label={{ value: 'Hitsplat', position: 'insideBottom', offset: -15 }}
        />
        <YAxis
          stroke="#777777"
          domain={[0, domainMax]}
          tickCount={tickCount}
          tickFormatter={(v: number) => `${parseFloat((v * 100).toFixed(2))}%`}
          width={35}
          interval="equidistantPreserveStart"
          label={{
            value: 'chance', position: 'insideLeft', angle: -90, offset: -20, style: { textAnchor: 'middle' },
          }}
        />
        <CartesianGrid stroke="gray" strokeDasharray="5 5" />
        <Tooltip
          content={(props) => <HitDistributionTooltip {...props} />}
          cursor={{ fill: '#3c3226' }}
        />
        <Bar dataKey="value" fill="tan" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HitDistributionChart;
