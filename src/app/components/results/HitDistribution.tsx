import React from 'react';
import {BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, TooltipProps, CartesianGrid} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';
import hitsplat from '@/public/img/hitsplat.webp';
import zero_hitsplat from '@/public/img/zero_hitsplat.png';
import {HistogramEntry} from "@/types/State";
import {useTheme} from "next-themes";

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isZeroDmg = payload[0].payload.name === 0;

    return (
      <div className={'bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2'}>
        <div>
          <img src={isZeroDmg ? zero_hitsplat.src : hitsplat.src} alt={'Hitpoints'} width={20} />
        </div>
        <div>
          <p>
            <strong>{label}</strong> damage
          </p>
          <p className={'text-gray-400'}>
            <span className={`${isZeroDmg ? 'text-blue' : 'text-red'} font-bold`}>{((payload[0].value! as number) * 100).toFixed(2).toString() + '%'}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}

const HitDistribution: React.FC<{ dist: HistogramEntry[], nonZeros: boolean }> = ({dist, nonZeros}) => {
  const {resolvedTheme} = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <ResponsiveContainer width={'100%'} height={150}>
        <BarChart
          data={nonZeros ? dist.slice(1) : dist}
        >
          <XAxis
            // label={{ value: 'damage', position: 'bottom' }}
            dataKey="name"
            stroke="#777777"
          />
          <YAxis
            // label={{ value: 'chance', angle: -90, position: 'left' }}
            stroke="#777777"
            domain={[0, 'dataMax']}
            tickFormatter={(v: number) => {
              return Math.floor(v * 100).toString() + '%';
            }}
            width={35}
            interval={'equidistantPreserveStart'}
          />
          <CartesianGrid stroke="gray" strokeDasharray="5 5"/>
          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
            cursor={{ fill: isDark ? '#3c3226' : '#b0aa9a' }}
          />
          <Bar dataKey="chance" fill="tan" animationDuration={500} />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

export default HitDistribution;
