import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import React, { useMemo } from 'react';
import CombatStyle from '@/app/components/player/combat/CombatStyle';
import SpellSelect from '@/app/components/player/combat/SpellSelect';
import Toggle from '@/app/components/generic/Toggle';
import SpellContainer from '@/app/components/player/combat/SpellContainer';
import UserIssueWarning from '@/app/components/generic/UserIssueWarning';
import { canUseSunfireRunes, Spellement } from '@/types/Spell';
import sunfire_rune from '@/public/img/misc/sunfire_rune.webp';
import fragment_wind from '@/public/img/misc/fragment_wind.png';
import fragment_water from '@/public/img/misc/fragment_water.png';
import fragment_earth from '@/public/img/misc/fragment_earth.png';
import fragment_fire from '@/public/img/misc/fragment_fire.png';
import { StaticImageData } from 'next/image';
import { Player } from '@/types/Player';
import { ConditionalKeys } from 'type-fest';

const FragmentToggle: React.FC<{ element: Spellement }> = observer(({ element }) => {
  const store = useStore();
  const { buffs } = store.player;

  let img: StaticImageData;
  let key: ConditionalKeys<Player['buffs'], boolean>;
  let fragmentName: string;
  switch (element) {
    case 'air':
      img = fragment_wind;
      key = 'fragmentOfWind';
      fragmentName = 'whispering wind';
      break;
    case 'water':
      img = fragment_water;
      key = 'fragmentOfWater';
      fragmentName = 'deep water';
      break;
    case 'earth':
      img = fragment_earth;
      key = 'fragmentOfEarth';
      fragmentName = 'living earth';
      break;
    default:
      img = fragment_fire;
      key = 'fragmentOfFire';
      fragmentName = 'burning fire';
      break;
  }

  return (
    <Toggle
      checked={buffs[key]}
      setChecked={(v) => {
        store.updatePlayer({ buffs: { [key]: v } });
      }}
      label={(
        <>
          <img src={img.src} width={18} className="inline-block" alt="" />
          {' '}
          Fragment of
          {' '}
          {fragmentName}
          {' '}
          <span
            className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
            data-tooltip-id="tooltip"
            data-tooltip-content="Raises maximum hit by 2."
          >
            ?
          </span>
        </>
    )}
    />
  );
});

const Combat: React.FC = observer(() => {
  const store = useStore();
  const { spell, buffs, style } = store.player;
  // eslint-disable-next-line react/no-array-index-key
  const styles = useMemo(() => store.availableCombatStyles.map((s, i) => <CombatStyle key={i} style={s} />), [store.availableCombatStyles]);

  // Determine whether there's any issues with spells
  const spellIssues = useMemo(() => store.userIssues.filter((i) => i.type.startsWith('spell_') && i.loadout === `${store.selectedLoadout + 1}`), [store.userIssues, store.selectedLoadout]);

  return (
    <div>
      <div className="flex flex-col my-4">
        {styles}
      </div>
      {
        ['Autocast', 'Defensive Autocast', 'Manual Cast'].includes(style.stance || '') && (
          <div className="px-4">
            <h4 className="font-bold font-serif flex gap-2">
              Spell
              {spellIssues.length > 0 && (
                <UserIssueWarning issue={spellIssues[0]} />
              )}
            </h4>
            <div className="my-2">
              <SpellContainer />
            </div>
            <div className="mt-2">
              <SpellSelect />
            </div>
            <div className="my-4">
              {
                spell?.element && (
                  <FragmentToggle element={spell.element} />
                )
              }
              {
                canUseSunfireRunes(spell) && (
                  <Toggle
                    checked={buffs.usingSunfireRunes}
                    setChecked={(v) => {
                      store.updatePlayer({ buffs: { usingSunfireRunes: v } });
                    }}
                    label={(
                      <>
                        <img src={sunfire_rune.src} width={18} className="inline-block" alt="" />
                        {' '}
                        Using sunfire runes
                        {' '}
                        <span
                          className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                          data-tooltip-id="tooltip"
                          data-tooltip-content="Increases minimum hit by 10%."
                        >
                          ?
                        </span>
                      </>
                    )}
                  />
                )
              }
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
