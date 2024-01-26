import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import React from 'react';
import CombatStyle from '@/app/components/player/combat/CombatStyle';
import SpellSelect from '@/app/components/player/combat/SpellSelect';
import Toggle from '@/app/components/generic/Toggle';
import SpellContainer from '@/app/components/player/combat/SpellContainer';

const Combat: React.FC = observer(() => {
  const store = useStore();
  const { spell, buffs, style } = store.player;
  const styles = store.availableCombatStyles;

  return (
    <div>
      <div className="flex flex-col my-4">
        {
          styles.map((s) => <CombatStyle key={s.type + s.name} style={s} />)
        }
      </div>
      {
        style.type === 'magic' && (
          <div className="px-4">
            <h4 className="font-bold font-serif">
              Spell
            </h4>
            <div className="my-2">
              <SpellContainer />
            </div>
            <div className="mt-2">
              <SpellSelect />
            </div>
            <div className="my-4">
              {
                ['Saradomin Strike', 'Claws of Guthix', 'Flames of Zamorak'].includes(spell?.name || '') && (
                  <Toggle
                    checked={buffs.chargeSpell}
                    setChecked={(v) => {
                      store.updatePlayer({ buffs: { chargeSpell: v } });
                    }}
                    label="Using the Charge spell"
                  />
                )
              }
              {
                spell?.name.includes('Demonbane') && (
                  <Toggle
                    checked={buffs.markOfDarknessSpell}
                    setChecked={(v) => {
                      store.updatePlayer({ buffs: { markOfDarknessSpell: v } });
                    }}
                    label="Using Mark of Darkness"
                  />
                )
              }
            </div>
          </div>
        )
      }
    </div>
  );
});

export default Combat;
