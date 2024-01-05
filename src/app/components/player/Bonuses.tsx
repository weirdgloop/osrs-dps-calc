import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Offensive from "@/app/components/player/bonuses/Offensive";
import Defensive from "@/app/components/player/bonuses/Defensive";
import OtherBonuses from "@/app/components/player/bonuses/OtherBonuses";

const Bonuses: React.FC = observer(() => {
  const store = useStore();

  return (
    <div className={'px-4 my-4'}>
      <h4 className={'font-serif font-bold'}>Bonuses</h4>
      <div className={'py-1'}>
        <div className={'flex gap-4 justify-center'}>
          <Offensive/>
          <Defensive/>
          <OtherBonuses/>
        </div>
      </div>
    </div>
  )
})

export default Bonuses;
