import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import React from 'react';
import CombatStyle from "@/app/components/player/combat/CombatStyle";
import SpellSelect from "@/app/components/player/combat/SpellSelect";
import Toggle from "@/app/components/generic/Toggle";

const Combat: React.FC = observer(() => {
  const store = useStore();
  const {spell, buffs} = store.player;
  const styles = store.availableCombatStyles;

  return (
    <div className={'mt-4'}>
      <div className={'flex flex-col my-4'}>
        {
          styles.map((s, i) => {
            return <CombatStyle key={i} style={s} />
          })
        }
      </div>
      <div className={'px-4'}>
        <h4 className={`font-bold font-serif`}>
          Spell
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
    </div>
  )
})

export default Combat;
