import {observer} from 'mobx-react-lite';
import {useStore} from '../../state/state';
import React from 'react';
import HelpLink from '@/components/HelpLink';
import {CombatStyle as CombatStyleEnum} from '@/lib/enums/CombatStyle';

interface CombatStyleProps {
  name: CombatStyleEnum;
}

const CombatStyle: React.FC<CombatStyleProps> = observer((props) => {
  const store = useStore();
  const {name} = props;

  return (
    <button className={`p-2 bg-darker-900 transition-[background] rounded text-center ${store.combatStyle === name ? 'bg-dracula-300 text-black' : 'hover:bg-darker-800'}`} onClick={() => store.setCombatStyle(name)}>
      {name}
    </button>
  )
})

const Combat: React.FC = () => {
  return (
    <div className={'mt-4'}>
      <h4 className={`font-bold font-mono`}>
        Combat style <HelpLink href={'https://oldschool.runescape.wiki/w/Combat_Options'} />
      </h4>
      <p className={'text-sm'}>
        Select the style that you are using.
      </p>
      <div className={'grid grid-cols-2 gap-2 mt-4'}>
        {
          Object.values(CombatStyleEnum).map((s, i) => {
            return <CombatStyle key={i} name={s} />
          })
        }
      </div>
    </div>
  )
}

export default Combat;