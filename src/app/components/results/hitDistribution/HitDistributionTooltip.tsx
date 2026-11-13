import React from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import hitsplat from '@/public/img/hitsplat.webp';
import zero_hitsplat from '@/public/img/zero_hitsplat.png';

const HitDistributionTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
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
  }

  return null;
};

export default HitDistributionTooltip;
