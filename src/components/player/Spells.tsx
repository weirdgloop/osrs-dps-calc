import React from 'react';
import SpellSelect from '@/components/SpellSelect';
import Toggle from '@/components/generic/Toggle';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../state';

const Spells: React.FC = observer(() => {
  const store = useStore();
  const {spell, buffs} = store.player;

  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Spells
      </h4>
      <div className={'mt-2'}>
        <SpellSelect />
      </div>
      <div className={'mt-4'}>
        {
          ['Saradomin Strike', 'Claws of Guthix', 'Flames of Zamorak'].includes(spell.name) && (
            <Toggle checked={buffs.chargeSpell} setChecked={(v) => {store.updatePlayer({buffs: {chargeSpell: v}})}} label={'Using the Charge spell'} />
          )
        }
      </div>
    </div>
  )
})

export default Spells;