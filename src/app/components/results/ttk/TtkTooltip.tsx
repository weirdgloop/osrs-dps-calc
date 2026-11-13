import React from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface TtkTooltipProps extends TooltipProps<ValueType, NameType> {
  xAxisLabel: string;
}

const TtkTooltip: React.FC<TtkTooltipProps> = ({
  active, payload, label, xAxisLabel,
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
              {xAxisLabel}
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

export default TtkTooltip;
