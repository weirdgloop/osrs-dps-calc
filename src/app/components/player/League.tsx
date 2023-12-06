import {observer} from 'mobx-react-lite';
import React from 'react';
import {TrailblazerRelic, TrailblazerRelicMap} from "@/enums/TrailblazerRelic";
import HelpLink from "@/app/components/HelpLink";
import GridItem from "@/app/components/generic/GridItem";
import {useStore} from "@/state";

const League: React.FC = observer(() => {
  const store = useStore();
  const {trailblazerRelics} = store.player;

  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Relics
      </h4>
      <div className={'grid grid-cols-4 gap-y-4 mt-4 w-48 m-auto items-center justify-center'}>
        {
          Object.entries(TrailblazerRelicMap).map(([k, v]) => {
            return <GridItem
              key={k}
              item={parseInt(k)}
              name={v.name}
              image={v.image}
              active={trailblazerRelics.includes(parseInt(k))}
              onClick={(r: TrailblazerRelic) => store.togglePlayerTrailblazerRelic(r)}
            />
          })
        }
      </div>
      <div className={'mt-4'}>
        <h4 className={`font-bold font-serif`}>
          Ruinous Powers <HelpLink href={'https://oldschool.runescape.wiki/w/Ruinous_Powers'} />
        </h4>
      </div>
    </div>
  )
})

export default League;
