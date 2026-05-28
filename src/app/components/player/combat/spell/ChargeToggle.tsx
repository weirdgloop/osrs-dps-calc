import { observer } from 'mobx-react-lite';
import React from 'react';
import { usePlayer } from '@/state/LoadoutStore';
import { canUseCharge } from '@/types/Spell';
import Toggle from '@/app/components/generic/Toggle';
import charge from '@/public/img/misc/charge.png';

const ChargeToggle: React.FC = observer(() => {
  const { basePlayer, updateBasePlayer } = usePlayer();
  if (!canUseCharge(basePlayer.spell)) {
    return null;
  }

  return (
    <Toggle
      checked={basePlayer.buffs.chargeSpell}
      setChecked={(v) => {
        updateBasePlayer({ buffs: { chargeSpell: v } });
      }}
      label={(
        <>
          <img src={charge.src} width={18} className="inline-block" alt="" />
          {' '}
          Using the Charge spell
          {' '}
          <span
            className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
            data-tooltip-id="tooltip"
            data-tooltip-content="Increases maximum hit of god spells to 30."
          >
            ?
          </span>
        </>
      )}
    />
  );
});

export default ChargeToggle;
