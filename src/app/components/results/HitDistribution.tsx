import React from 'react';
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';
import hitsplat from '@/img/hitsplat.webp';
import zero_hitsplat from '@/img/zero_hitsplat.png';

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

const HitDistribution: React.FC = () => {
  const data = [
    {name: 0, chance: 0.1002},
    {name: 1, chance: 0.001},
    {name: 2, chance: 0.002},
    {name: 3, chance: 0.00042},
    {name: 4, chance: 0.01232},
    {name: 5, chance: 0.02321},
    {name: 6, chance: 0.03},
    {name: 7, chance: 0.001},
    {name: 8, chance: 0.0042},
    {name: 9, chance: 0.00123},
    {name: 10, chance: 0.003}
  ]

  return (
    <>
      <ResponsiveContainer width={'100%'} height={200}>
        <BarChart
          data={data}
        >
          <CartesianGrid strokeDasharray="5 3" />
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
          />
          <Tooltip content={(props) => <CustomTooltip {...props} />} />
          <Bar dataKey="chance" fill="tan" />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

export default HitDistribution;