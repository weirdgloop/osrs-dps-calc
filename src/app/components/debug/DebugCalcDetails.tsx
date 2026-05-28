import { observer } from 'mobx-react-lite';
import React from 'react';
import LazyImage from '@/app/components/generic/LazyImage';
import debug from '@/public/img/debug.webp';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import { DetailEntry } from '@/lib/CalcDetails';

const CalcDetailRow: React.FC<{ d: DetailEntry }> = observer(({ d }) => (
  <tr key={d.label} className="hover:bg-btns-100">
    <td className={`border text-center w-1/2 border-l ${d.highlight ? 'text-white font-bold' : 'text-body-400'}`}>{d.label}</td>
    <td className={`border text-center w-1/2 border-l ${d.highlight ? 'text-white font-bold' : 'text-body-400'}`}>{d.displayValue}</td>
  </tr>
));

const DebugCalcDetails: React.FC<{ label: string, details?: DetailEntry[] }> = observer(({ label, details }) => (
  <SectionAccordion
    title={(
      <div className="flex items-center gap-2">
        <div className="w-6 flex justify-center">
          <LazyImage src={debug.src} />
        </div>
        <h3 className="font-serif font-bold">
          [Debug]
          {' '}
          {label}
        </h3>
      </div>
      )}
    defaultIsOpen={false}
  >
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-center w-1/2 border-x border-y font-bold font-serif bg-dark-500 text-white">Label</th>
          <th className="text-center w-1/2 border-r border-y font-bold font-serif bg-dark-500 text-white">Value</th>
        </tr>
      </thead>
      <tbody>
        {details?.map((d) => (
          <CalcDetailRow key={d.label} d={d} />
        ))}
      </tbody>
    </table>
  </SectionAccordion>

));

export default DebugCalcDetails;
