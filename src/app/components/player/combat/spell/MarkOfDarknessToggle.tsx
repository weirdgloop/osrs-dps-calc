import { observer } from 'mobx-react-lite';
import React from 'react';
import { usePlayer } from '@/state/LoadoutStore';
import { canUseMarkOfDarkness } from '@/types/Spell';
import Toggle from '@/app/components/generic/Toggle';
import mark_of_darkness from '@/public/img/misc/mark_of_darkness.png';

const ChargeToggle: React.FC = observer(() => {
  const { basePlayer, updateBasePlayer } = usePlayer();
  if (!canUseMarkOfDarkness(basePlayer.spell)) {
    return null;
  }

  return (
    <Toggle
      checked={basePlayer.buffs.markOfDarknessSpell}
      setChecked={(v) => {
        updateBasePlayer({ buffs: { markOfDarknessSpell: v } });
      }}
      label={(
        <>
          <img src={mark_of_darkness.src} width={18} className="inline-block" alt="" />
          {' '}
          Using Mark of Darkness
          {' '}
          <span
            className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
            data-tooltip-id="tooltip"
            data-tooltip-content={"Increases demonbane spells' accuracy by 40% and damage by 25% (doubled when using a Purging staff)."}
          >
            ?
          </span>
        </>
      )}
    />
  );
});

export default ChargeToggle;
