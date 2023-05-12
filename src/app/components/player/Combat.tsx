import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import React from 'react';
import HelpLink from '../HelpLink';
import {CombatStyle} from "@/app/components/player/CombatStyle";

const Combat: React.FC = observer(() => {
  const store = useStore();
  const styles = store.availableCombatStyles;

  return (
    <div className={'mt-4'}>
      <div className={'px-6'}>
        <h4 className={`font-bold font-serif`}>
          Combat style <HelpLink href={'https://oldschool.runescape.wiki/w/Combat_Options'} />
        </h4>
        <p className={'text-xs'}>
          Select the style that you are using.
        </p>
      </div>
      <div className={'flex flex-col mt-4'}>
        {
          styles.map((s, i) => {
            return <CombatStyle key={i} style={s} />
          })
        }
      </div>
    </div>
  )
})

export default Combat;