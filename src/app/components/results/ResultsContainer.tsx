import React, {useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {
  IconClockHour3, IconDice,
  IconEye,
  IconHeartMinus, IconShield,
  IconSword,
  IconTimeline
} from "@tabler/icons-react";
import {useStore} from "@/state";

const ResultsTable = observer(() => {
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
            className={`text-center cursor-pointer transition-colors ${selectedLoadout === i ? 'bg-orange-400' : 'bg-btns-400'}`}
            onClick={() => store.setSelectedLoadout(i)}
          >Loadout {i + 1}</th>
        ))}
      </tr>
      </thead>
      <tbody>
        <tr>
          <th className={'bg-btns-400 w-40'}><IconSword className={'inline-block'} /> Max hit</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{l.maxHit}</th>)}
        </tr>
        <tr>
          <th className={'bg-btns-400'}><IconTimeline className={'inline-block'} /> DPS</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{/* TODO */}</th>)}
        </tr>
        <tr>
          <th className={'bg-btns-400'}><IconEye className={'inline-block'} /> Accuracy</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{/* TODO */}</th>)}
        </tr>
        <tr>
          <th className={'bg-btns-400'}><IconClockHour3 className={'inline-block'} /> Avg. TTK</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{/* TODO */}</th>)}
        </tr>
        <tr>
          <th className={'bg-btns-400'}><IconHeartMinus className={'inline-block'} /> Avg. dmg taken</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{/* TODO */}</th>)}
        </tr>
        <tr>
          <th className={'bg-btns-400'}><IconDice className={'inline-block'} /> Attack roll</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{l.maxAttackRoll}</th>)}
        </tr>
        <tr>
          <th className={'bg-btns-400'}><IconShield className={'inline-block'} /> NPC def roll</th>
          {calc.loadouts.map((l, i) => <th className={'text-center'} key={i}>{l.npcDefRoll}</th>)}
        </tr>
      </tbody>
    </table>
  )
})

const BoxResults = observer(() => {
  return (
    <div className={'my-4'}>
      <div className={'mx-2 overflow-x-scroll'}>
        <ResultsTable />
      </div>
    </div>
  )
})

export default BoxResults;