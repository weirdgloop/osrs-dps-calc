import { observer } from 'mobx-react-lite';
import React from 'react';
import { usePlayer } from '@/state/LoadoutStore';
import { canUseSunfireRunes } from '@/types/Spell';
import Toggle from '@/app/components/generic/Toggle';
import sunfire_rune from '@/public/img/misc/sunfire_rune.webp';

const SunfireRunesToggle: React.FC = observer(() => {
  const { basePlayer, updateBasePlayer } = usePlayer();
  if (!canUseSunfireRunes(basePlayer.spell)) {
    return null;
  }

  return (
    <Toggle
      checked={basePlayer.buffs.usingSunfireRunes}
      setChecked={(v) => {
        updateBasePlayer({ buffs: { usingSunfireRunes: v } });
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
  );
});

export default SunfireRunesToggle;
