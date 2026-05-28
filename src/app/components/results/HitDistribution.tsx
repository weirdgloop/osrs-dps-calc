import React from 'react';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import hitsplat from '@/public/img/hitsplat.webp';
import zero_hitsplat from '@/public/img/zero_hitsplat.png';
import LazyImage from '@/app/components/generic/LazyImage';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import Toggle from '@/app/components/generic/Toggle';
import { observer } from 'mobx-react-lite';
import { max } from 'd3-array';
import { computed, toJS } from 'mobx';
import { usePlayer } from '@/state/LoadoutStore';
import { CalcState } from '@/types/Results';
import { usePreferences } from '@/state/Preferences';
import { isDefined } from '@/utils';
import { TooltipContentProps } from 'recharts/types/component/Tooltip';

const CustomTooltip: React.FC<TooltipContentProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const isZeroDmg = parseInt(payload[0].payload.name) === 0;
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
};

const HitDistSpecToggle: React.FC = observer(() => {
  const { results } = usePlayer();
  const { hitDistShowSpec, updatePreferences } = usePreferences();

  return (
    <Toggle
      disabled={results.basic.state !== CalcState.COMPLETE || !results.basic.specHitDist}
      checked={hitDistShowSpec}
      setChecked={(c) => updatePreferences({ hitDistShowSpec: c })}
      label="Show special attack"
      className="text-black dark:text-white mb-4"
    />
  );
});

const HitDistMissToggle: React.FC = observer(() => {
  const { hitDistsHideZeros, updatePreferences } = usePreferences();

  return (
    <Toggle
      checked={hitDistsHideZeros}
      setChecked={(c) => updatePreferences({ hitDistsHideZeros: c })}
      label="Hide misses"
      className="text-black dark:text-white mb-4"
    />
  );
});

const HitDistChart: React.FC = observer(() => {
  const { results } = usePlayer();
  const { hitDistShowSpec, hitDistsHideZeros } = usePreferences();

  const data = computed(() => {
    const result = results.basic;
    if (result.state !== CalcState.COMPLETE) {
      return [];
    }

    const dist = (hitDistShowSpec && isDefined(result.specHitDist)) ? result.specHitDist : result.hitDist;
    return hitDistsHideZeros ? dist.filter((e) => e.accurate) : dist;
  }).get();

  const [domainMax, tickCount] = computed(() => {
    const highest = max(data, (e) => e.probability)!;
    const stepsize = 10 ** Math.floor(Math.log10(highest) - 1);
    return [
      Math.ceil(1 / stepsize * highest) * stepsize,
      1 + Math.ceil(1 / stepsize * highest),
    ];
  }).get();

  const dataSliced = computed(() => {
    // for datasets with more than 50 entries, only go up to the first damage value above 0.0001 probability
    if (data.length < 50) {
      return data;
    }

    const aboveThreshold = data.filter((e) => e.probability > 0.0001);
    if (aboveThreshold.length === 0) {
      return data;
    }

    const xMax = max(aboveThreshold, (e) => e.damage)!;
    return data.slice(0, xMax + 1);
  }).get();

  console.debug({ data: toJS(data), dataSliced: toJS(dataSliced) });

  return (
    <ResponsiveContainer width="100%" height={225}>
      <BarChart
        data={toJS(dataSliced)}
        margin={{ top: 11, left: 25, bottom: 20 }}
      >
        <XAxis
          dataKey={(e: typeof dataSliced[number]) => e.damage}
          stroke="#777777"
          interval="equidistantPreserveStart"
          label={{ value: 'Hitsplat', position: 'insideBottom', offset: -15 }}
        />
        <YAxis
          dataKey={(e: typeof dataSliced[number]) => e.probability}
          stroke="#777777"
          domain={[0, domainMax]}
          tickCount={tickCount}
          tickFormatter={(v: number) => `${(v * 100).toFixed(2)}%`}
          width={35}
          interval="equidistantPreserveStart"
          label={{
            value: 'chance', position: 'insideLeft', angle: -90, offset: -20, style: { textAnchor: 'middle' },
          }}
        />
        <CartesianGrid stroke="gray" strokeDasharray="5 5" />
        <Tooltip
          content={CustomTooltip}
          cursor={{ fill: '#3c3226' }}
        />
        <Bar dataKey={(e: typeof dataSliced[number]) => e.probability} fill="tan" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
});

const HitDistribution: React.FC = observer(() => {
  const { showHitDistribution, updatePreferences } = usePreferences();
  const { player } = usePlayer();

  return (
    <SectionAccordion
      defaultIsOpen={showHitDistribution}
      onIsOpenChanged={(o) => updatePreferences({ showHitDistribution: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center">
            <LazyImage src={hitsplat.src} />
          </div>
          <h3 className="font-serif font-bold">
            Hit Distribution
            {' '}
            <span className="text-gray-300 text-sm">
              (
              {player.name}
              )
            </span>
          </h3>
        </div>
      )}
    >
      <div className="px-6 py-4">
        <div
          className="flex items-center gap-4"
        >
          <HitDistSpecToggle />
          <HitDistMissToggle />
        </div>
        <HitDistChart />
      </div>
    </SectionAccordion>
  );
});

export default HitDistribution;
