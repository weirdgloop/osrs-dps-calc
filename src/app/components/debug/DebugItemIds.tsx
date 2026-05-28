import { observer } from 'mobx-react-lite';
import React from 'react';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import debug from '@/public/img/debug.webp';
import { keys } from '@/utils';
import { usePlayer } from '@/state/LoadoutStore';

const DebugItemIds: React.FC = observer(() => {
  const { player } = usePlayer();

  return (
    <SectionAccordion
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={debug.src} /></div>
          <h3 className="font-serif font-bold">
            [Debug] Item IDs
          </h3>
        </div>
      )}
    >
      <table className="w-full my-5">
        <thead>
          <tr>
            <th className="text-center w-1/4 border-x border-y font-bold font-serif  bg-dark-500 text-white">
              Slot
            </th>
            <th className="text-center w-1/4 border-r border-y font-bold font-serif bg-dark-500 text-white">
              ID
            </th>
            <th className="text-center w-1/4 border-r border-y font-bold font-serif bg-dark-500 text-white">
              Name
            </th>
            <th className="text-center w-1/4 border-r border-y font-bold font-serif bg-dark-500 text-white">
              Version
            </th>
          </tr>
        </thead>
        <tbody>
          {keys(player.equipment)
            .filter((k) => player.equipment[k])
            .map((k) => (
              <tr key={k} className="hover:bg-btns-100">
                <td className="border text-center w-1/4 border-l text-body-400">{k}</td>
                <td className="border text-center w-1/4 border-l text-body-400">{player.equipment[k]?.id}</td>
                <td className="border text-center w-1/4 border-l text-body-400">{player.equipment[k]?.name}</td>
                <td className="border text-center w-1/4 border-l text-body-400">{player.equipment[k]?.version}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </SectionAccordion>
  );
});

export default DebugItemIds;
