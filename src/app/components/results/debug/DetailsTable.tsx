import React from 'react';
import { DetailEntry } from '@/lib/CalcDetails';

const DetailsTable: React.FC<{ details: DetailEntry[] }> = ({ details }) => (
  <table className="w-full">
    <thead>
      <tr>
        <th className="text-center w-1/2 border-x border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Label</th>
        <th className="text-center w-1/2 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Value</th>
      </tr>
    </thead>
    <tbody>
      {details.map((d) => {
        const cellClass = `border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`;

        return (
          <tr key={d.label} className="hover:bg-btns-100 hover:dark:bg-btns-100">
            <td className={cellClass}>{d.label}</td>
            <td className={cellClass}>{d.displayValue}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default DetailsTable;
