import React from 'react';
import { observer } from 'mobx-react-lite';
import sunfire_rune from '@/public/img/misc/sunfire_rune.webp';
import BuffToggle from '@/app/components/player/buffs/BuffToggle';
import FragmentToggle from '@/app/components/player/combat/spell/FragmentToggle';
import { usePlayer } from '@/state/PlayerStore';
import { canUseSunfireRunes } from '@/types/Spell';

const CHARGEABLE_SPELLS = ['Saradomin Strike', 'Claws of Guthix', 'Flames of Zamorak'];

const SpellToggles: React.FC = observer(() => {
  const { spell } = usePlayer();

  return (
    <>
      {spell?.element && <FragmentToggle element={spell.element} />}
      {canUseSunfireRunes(spell) && (
        <BuffToggle
          buff="usingSunfireRunes"
          icon={<img src={sunfire_rune.src} width={18} className="inline-block" alt="" />}
          label="Using sunfire runes"
          help="Increases minimum hit by 10%."
        />
      )}
      {CHARGEABLE_SPELLS.includes(spell?.name || '') && (
        <BuffToggle buff="chargeSpell" label="Using the Charge spell" />
      )}
      {spell?.name.includes('Demonbane') && (
        <BuffToggle buff="markOfDarknessSpell" label="Using Mark of Darkness" />
      )}
    </>
  );
});

export default SpellToggles;
