import React from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const ComparisonTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow rounded p-2 text-sm text-black flex items-center gap-2">
        <div>
          <p>
            <strong>
              {label}
            </strong>
          </p>
          {
            payload.map((p) => (
              <div key={p.name} className="flex justify-between w-40 gap-2">
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
                  {p.value === 'NaN' ? '---' : `${p.value}`}
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

export default ComparisonTooltip;
