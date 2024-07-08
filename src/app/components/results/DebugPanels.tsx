import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import debug from '@/public/img/debug.webp';
import { DetailEntry } from '@/lib/CalcDetails';
import { keys } from '@/utils';

const DebugPanels: React.FC = observer(() => {
  const store = useStore();
  if (!store.debug) return null;

  const { calc, player, selectedLoadout } = store;
  const details: DetailEntry[] = calc.loadouts[selectedLoadout]?.details || [];
  const specDetails: DetailEntry[] = calc.loadouts[selectedLoadout]?.specDetails || [];
  const npcDetails: DetailEntry[] = calc.loadouts[selectedLoadout]?.npcDetails || [];

  return (
    <>
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
              <th className="text-center w-1/4 border-x border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Slot</th>
              <th className="text-center w-1/4 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">ID</th>
              <th className="text-center w-1/4 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Name</th>
              <th className="text-center w-1/4 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Version</th>
            </tr>
          </thead>
          <tbody>
            {keys(player.equipment).filter((k) => player.equipment[k]).map((k) => (
              <tr key={k} className="hover:bg-btns-100 hover:dark:bg-btns-100">
                <td className={'border text-center w-1/4 border-l dark:text-body-400 text-gray-400\''}>{k}</td>
                <td className={'border text-center w-1/4 border-l dark:text-body-400 text-gray-400\''}>{player.equipment[k]?.id}</td>
                <td className={'border text-center w-1/4 border-l dark:text-body-400 text-gray-400\''}>{player.equipment[k]?.name}</td>
                <td className={'border text-center w-1/4 border-l dark:text-body-400 text-gray-400\''}>{player.equipment[k]?.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionAccordion>
      <SectionAccordion
        title={(
          <div className="flex items-center gap-2">
            <div className="w-6 flex justify-center"><LazyImage src={debug.src} /></div>
            <h3 className="font-serif font-bold">
              [Debug] Calc Details
            </h3>
          </div>
        )}
        defaultIsOpen
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center w-1/2 border-x border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Label</th>
              <th className="text-center w-1/2 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            {details.map((d) => (
              <tr key={d.label} className="hover:bg-btns-100 hover:dark:bg-btns-100">
                <td className={`border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`}>{d.label}</td>
                <td className={`border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`}>{d.displayValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionAccordion>
      <SectionAccordion
        title={(
          <div className="flex items-center gap-2">
            <div className="w-6 flex justify-center"><LazyImage src={debug.src} /></div>
            <h3 className="font-serif font-bold">
              [Debug] Spec Details
            </h3>
          </div>
        )}
        defaultIsOpen={false}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center w-1/2 border-x border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Label</th>
              <th className="text-center w-1/2 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            {specDetails.map((d) => (
              <tr key={d.label} className="hover:bg-btns-100 hover:dark:bg-btns-100">
                <td className={`border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`}>{d.label}</td>
                <td className={`border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`}>{d.displayValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionAccordion>
      <SectionAccordion
        title={(
          <div className="flex items-center gap-2">
            <div className="w-6 flex justify-center"><LazyImage src={debug.src} /></div>
            <h3 className="font-serif font-bold">
              [Debug] Reverse Details
            </h3>
          </div>
        )}
        defaultIsOpen={false}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-center w-1/2 border-x border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Label</th>
              <th className="text-center w-1/2 border-r border-y font-bold font-serif bg-btns-400 dark:bg-dark-500 text-white">Value</th>
            </tr>
          </thead>
          <tbody>
            {npcDetails.map((d) => (
              <tr key={d.label} className="hover:bg-btns-100 hover:dark:bg-btns-100">
                <td className={`border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`}>{d.label}</td>
                <td className={`border text-center w-1/2 border-l ${d.highlight ? 'dark:text-white text-black font-bold' : 'dark:text-body-400 text-gray-400'}`}>{d.displayValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionAccordion>
    </>
  );
});

export default DebugPanels;
