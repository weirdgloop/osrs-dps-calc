import {observer} from 'mobx-react-lite';
import React from 'react';
import TrailblazerRelicItem from "@/app/components/player/league/TrailblazerRelicItem";
import {TrailblazerRelicMap} from "@/enums/TrailblazerRelic";

const League: React.FC = observer(() => {
  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Relics
      </h4>
      <div className={'grid grid-cols-4 gap-y-4 mt-4 w-48 m-auto items-center justify-center'}>
        {
          Object.entries(TrailblazerRelicMap).map(([k, v]) => {
            return <TrailblazerRelicItem key={k} relic={parseInt(k)} name={v.name} image={v.image} />
          })
        }
      </div>
    </div>
  )
})

export default League;
