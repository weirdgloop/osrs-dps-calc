import React, { useMemo } from 'react';
import {
  BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, TooltipProps, CartesianGrid,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import hitsplat from '@/public/img/hitsplat.webp';
import zero_hitsplat from '@/public/img/zero_hitsplat.png';
import { ChartEntry } from '@/types/State';
import { useTheme } from 'next-themes';
import { useStore } from '@/state';
import LazyImage from '@/app/components/generic/LazyImage';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import Toggle from '@/app/components/generic/Toggle';
import { observer } from 'mobx-react-lite';
import { max } from 'd3-array';

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isZeroDmg = payload[0].payload.name === 0;

    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <img src={isZeroDmg ? zero_hitsplat.src : hitsplat.src} alt="Hitpoints" width={20} />
        </div>
        <div>
          <p>
            <strong>{label}</strong>
            {' '}
            damage
          </p>
          <p className="text-gray-400">
            <span className={`${isZeroDmg ? 'text-blue' : 'text-red'} font-bold`}>{`${((payload[0].value! as number) * 100).toFixed(2).toString()}%`}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const HitDistribution: React.FC<{ dist: ChartEntry[] }> = observer(({ dist }) => {
  const store = useStore();
  const { prefs } = store;
  const data = prefs.hitDistsHideZeros ? dist.slice(1) : dist;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [tickCount, domainMax] = useMemo(() => {
    const highest = max(data, (d) => d.value as number)!;
    const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
    const ceilHighest = Math.ceil(1 / stepsize * highest) * stepsize;
    const count = 1 + Math.ceil(1 / stepsize * highest);
    return [count, ceilHighest];
  }, [data]);

  return (
    <SectionAccordion
      defaultIsOpen={prefs.showHitDistribution}
      onIsOpenChanged={(o) => store.updatePreferences({ showHitDistribution: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={hitsplat.src} /></div>
          <h3 className="font-serif font-bold">
            Hit Distribution
            {' '}
            <span className="text-gray-300 text-sm">
              (
              {store.player.name}
              )
            </span>
          </h3>
        </div>
      )}
    >
      <div className="px-6 py-4">
        <Toggle
          checked={prefs.hitDistsHideZeros}
          setChecked={(c) => store.updatePreferences({ hitDistsHideZeros: c })}
          label="Hide 0s"
          className="text-black dark:text-white mb-4"
        />
        <ResponsiveContainer width="100%" height={225}>
          <BarChart
            data={data}
            margin={{ top: 11, left: 25, bottom: 20 }}
          >
            <XAxis
              // label={{ value: 'damage', position: 'bottom' }}
              dataKey="name"
              stroke="#777777"
              interval="equidistantPreserveStart"
              label={{ value: 'Hitsplat', position: 'insideBottom', offset: -15 }}
            />
            <YAxis
              // label={{ value: 'chance', angle: -90, position: 'left' }}
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
              content={(props) => <CustomTooltip {...props} />}
              cursor={{ fill: isDark ? '#3c3226' : '#b0aa9a' }}
            />
            <Bar dataKey="value" fill="tan" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionAccordion>
  );
});

export default HitDistribution;
