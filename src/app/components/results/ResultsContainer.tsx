import React, {PropsWithChildren} from 'react';
import {observer} from 'mobx-react-lite';
import {
  IconDice,
  IconShield,
  IconSword,
} from "@tabler/icons-react";
import {useStore} from "@/state";
import {CalculatedLoadout} from "@/types/State";

interface IResultRowProps {
  calcKey: keyof CalculatedLoadout;
}

const ResultRow: React.FC<PropsWithChildren<IResultRowProps>> = observer((props) => {
  const store = useStore();
  const {children, calcKey} = props;
  const {calc} = store;

  return (
    <tr>
      <th className={'bg-btns-400 dark:bg-dark-400 w-40'}>{children}</th>
      {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{l[calcKey] || ''}</th>)}
    </tr>
  )
})

const ResultsTable: React.FC = observer(() => {
  const store = useStore();
  const {selectedLoadout, calc} = store;

  // TODO: change this to actually show results, this is just proof-of-concept

  return (
    <table className={'min-w-[300px] w-auto mx-auto'}>
      <thead>
      <tr>
        <th className={'border-0'}></th>
        {store.loadouts.map((_, i) => (
          <th
            key={i}
            className={`text-center cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-300'}`}
            onClick={() => store.setSelectedLoadout(i)}
          >Loadout {i + 1}</th>
        ))}
      </tr>
      </thead>
      <tbody>
        <ResultRow calcKey={'maxHit'}><IconSword className={'inline-block'} /> Max hit</ResultRow>
        <ResultRow calcKey={'maxAttackRoll'}><IconDice className={'inline-block'} /> Attack roll</ResultRow>
        <ResultRow calcKey={'npcDefRoll'}><IconShield className={'inline-block'} /> NPC def roll</ResultRow>
      </tbody>
    </table>
  )
})

const ResultsContainer = observer(() => {
  return (
    <div className={'my-4'}>
      <div className={'mx-2 overflow-x-scroll'}>
        <ResultsTable />
      </div>
    </div>
  )
})

export default ResultsContainer;