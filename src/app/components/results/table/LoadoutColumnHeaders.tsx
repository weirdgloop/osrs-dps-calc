import React from 'react';
import { observer } from 'mobx-react-lite';
import { useLoadouts } from '@/state/LoadoutStore';

interface LoadoutColumnHeadersProps {
  focusable?: boolean;
}

const LoadoutColumnHeaders: React.FC<LoadoutColumnHeadersProps> = observer(({ focusable }) => {
  const loadouts = useLoadouts();

  return (
    <thead>
      <tr>
        <th aria-label="blank" className="bg-btns-400 border-r dark:bg-dark-500 select-none" />
        {loadouts.loadouts.map(({ uuid, name }) => (
          <th
            key={uuid}
            role={focusable ? 'button' : undefined}
            tabIndex={focusable ? 0 : undefined}
            className={`text-center w-28 border-r py-1.5 font-bold font-serif leading-tight text-xs cursor-pointer transition-colors ${loadouts.selectedUuid === uuid ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-500'}`}
            onClick={() => loadouts.select(uuid)}
          >
            {name}
          </th>
        ))}
      </tr>
    </thead>
  );
});

export default LoadoutColumnHeaders;
