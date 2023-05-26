import React, {PropsWithChildren} from 'react';
import {observer} from 'mobx-react-lite';
import {
  IconClockHour3, IconDice,
  IconEye,
  IconHeartMinus, IconShield,
  IconSword,
  IconTimeline
} from "@tabler/icons-react";
import LoadoutComparison from "@/app/components/results/LoadoutComparison";
import {useStore} from "@/state";

interface StatDisplay {
  name: string | JSX.Element;
  icon?: JSX.Element;
}

const StatDisplay: React.FC<PropsWithChildren<StatDisplay>> = (props) => {
  const {icon, name, children} = props;
  return (
    <div className={'grow bg-white shadow md:rounded items-center justify-center flex flex-col text-center min-h-[85px]'}>
      <div className={'py-2 bg-btns-400 border-b-2 border-body-500 text-white md:rounded-t w-full'}>
        <h3 className={'font-bold text-md select-none flex justify-center gap-1'}>
          <div className={'inline-block'}>{icon}</div>
          <div>{name}</div>
        </h3>
      </div>
      <div className={'p-2 flex justify-center items-center grow'}>
        <div className={'font-mono'}>
          {children}
        </div>
      </div>
    </div>

  )
}

const ResultsTable = observer(() => {
  const store = useStore();
  const {selectedLoadout, calc} = store;

  // TODO: change this to actually show results, this is just proof-of-concept

  const renderRows = () => {
    let r: React.ReactNode[] = [];
    for (let [i, l] of store.loadouts.entries()) {
      r.push(
        <tr>
          <th
            className={`cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400' : 'bg-btns-400'}`}
            onClick={() => store.setSelectedLoadout(i)}
          >Loadout {i + 1}</th>
          <th className={'text-center font-mono'}>{calc.loadouts[i] ? calc.loadouts[i].maxHit : ''}</th>
          <th className={'text-center font-mono'}>5.9304</th>
          <th className={'text-center font-mono'}>82.75<span className={'text-gray-500'}>%</span></th>
          <th className={'text-center font-mono'}>56.25<span className={'text-gray-500'}>s</span></th>
          <th className={'text-center font-mono'}>18.71</th>
          <th className={'text-center font-mono'}>{calc.loadouts[i] ? calc.loadouts[i].maxAttackRoll : ''}</th>
          <th className={'text-center font-mono'}>{calc.loadouts[i] ? calc.loadouts[i].npcDefRoll : ''}</th>
        </tr>
      )
    }
    return r;
  }

  return (
    <table className={'min-w-[880px]'}>
      <thead>
      <tr>
        <th className={'border-0'}></th>
        <th><IconSword className={'inline-block'} /> Max hit</th>
        <th><IconTimeline className={'inline-block'} /> DPS</th>
        <th><IconEye className={'inline-block'} /> Accuracy</th>
        <th><IconClockHour3 className={'inline-block'} /> Avg. TTK</th>
        <th><IconHeartMinus className={'inline-block'} /> Avg. dmg taken</th>
        <th><IconDice className={'inline-block'} /> Attack roll</th>
        <th><IconShield className={'inline-block'} /> NPC def roll</th>
      </tr>
      </thead>
      <tbody>
        {renderRows()}
      </tbody>
    </table>
  )
})

const BoxResults = observer(() => {
  return (
    <div className={'my-4'}>
      <div className={'grow bg-tile md:rounded shadow-lg max-w-[100vw] my-4 text-black'}>
        <div className={'px-4 py-4'}>
          <div className={'overflow-x-scroll'}>
            <ResultsTable />
          </div>
        </div>
      </div>
    </div>
  )
})

export default BoxResults;