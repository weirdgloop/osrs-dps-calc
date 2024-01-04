import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Offensive from "@/app/components/player/bonuses/Offensive";
import Defensive from "@/app/components/player/bonuses/Defensive";
import OtherBonuses from "@/app/components/player/bonuses/OtherBonuses";
import HitDistribution from "@/app/components/results/HitDistribution";
import Toggle from "@/app/components/generic/Toggle";

const Bonuses: React.FC = observer(() => {
  const store = useStore();
  const {prefs} = store;

  const [nonZeros, setNonZeros] = useState(false)

  return (
    <div className={'grow bg-body-100 dark:bg-dark-400 text-black dark:text-white rounded-br'}>
      <div className={'px-6 py-2 border-b border-body-400 dark:border-dark-200'}>
        <h4 className={'font-serif font-bold'}>Bonuses</h4>
      </div>
      <div className={'px-6 py-4'}>
        <div className={'flex gap-4 justify-center'}>
          <Offensive/>
          <Defensive/>
          <OtherBonuses/>
        </div>
      </div>
      {prefs.showHitDistribution && (
        <>
          <div className={'px-6 py-2 border-y border-body-400 dark:border-dark-200'}>
            <div className={'flex justify-between items-center'}>
              <h4 className={'font-serif font-bold'}>Hit Distribution</h4>
              <Toggle checked={nonZeros} setChecked={(c) => setNonZeros(c)} label={"Hide 0s"}/>
            </div>
          </div>
          <div className={'mt-2 px-2'}>
            <HitDistribution dist={store.calc.loadouts[store.selectedLoadout]?.dist} nonZeros={nonZeros}/>
          </div>
        </>
      )}
    </div>
  )
})

export default Bonuses;
