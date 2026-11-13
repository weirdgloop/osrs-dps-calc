import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePlayer } from '@/state/PlayerStore';
import { keys } from '@/utils';

const HEADER_CLASS = 'text-center w-1/4 border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white';
const CELL_CLASS = 'border text-center w-1/4 border-l dark:text-body-400 text-gray-400';

const EquipmentIdsTable: React.FC = observer(() => {
  const { equipment } = usePlayer();

  return (
    <table className="w-full my-5">
      <thead>
        <tr>
          <th className={`${HEADER_CLASS} border-x`}>Slot</th>
          <th className={`${HEADER_CLASS} border-r`}>ID</th>
          <th className={`${HEADER_CLASS} border-r`}>Name</th>
          <th className={`${HEADER_CLASS} border-r`}>Version</th>
        </tr>
      </thead>
      <tbody>
        {keys(equipment).filter((slot) => equipment[slot]).map((slot) => (
          <tr key={slot} className="hover:bg-btns-100 hover:dark:bg-btns-100">
            <td className={CELL_CLASS}>{slot}</td>
            <td className={CELL_CLASS}>{equipment[slot]?.id}</td>
            <td className={CELL_CLASS}>{equipment[slot]?.name}</td>
            <td className={CELL_CLASS}>{equipment[slot]?.version}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default EquipmentIdsTable;
