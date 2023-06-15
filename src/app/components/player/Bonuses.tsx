import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Offensive from "@/app/components/player/bonuses/Offensive";
import Defensive from "@/app/components/player/bonuses/Defensive";
import OtherBonuses from "@/app/components/player/bonuses/OtherBonuses";
import dynamic from "next/dynamic";
import Spinner from "@/app/components/Spinner";

const HitDistribution = dynamic(() => import('@/app/components/results/HitDistribution'), {loading: () => <div className={'text-center mt-2'}><Spinner /></div>});

const Bonuses: React.FC = observer(() => {
  const store = useStore();
  const {prefs} = store;

  return (
    <div className={'grow bg-body-100 dark:bg-dark-400 text-black dark:text-white rounded-br'}>
      <div className={'px-6 py-2 border-b border-body-400 dark:border-dark-200'}>
        <h4 className={'font-serif font-bold'}>Bonuses</h4>
      </div>
      <div className={'px-6 py-4'}>
        <div className={'flex gap-4 justify-center'}>
          <Offensive />
          <Defensive />
          <OtherBonuses />
        </div>
      </div>
      {prefs.showHitDistribution && (
        <>
          <div className={'px-6 py-2 border-y border-body-400 dark:border-dark-200'}>
            <h4 className={'font-serif font-bold'}>Hit Distribution</h4>
          </div>
          <div className={'mt-2 px-2'}>
            <HitDistribution />
          </div>
        </>
      )}
    </div>
  )
})

export default Bonuses;
