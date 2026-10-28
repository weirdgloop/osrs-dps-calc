import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { ConditionalKeys } from 'type-fest';
import Toggle from '@/app/components/generic/Toggle';
import HelpTooltip from '@/app/components/generic/HelpTooltip';
import { PlayerBuffs, usePlayer } from '@/state/PlayerStore';

interface BuffToggleProps {
  buff: ConditionalKeys<PlayerBuffs, boolean>;
  label: ReactNode;
  icon?: ReactNode;
  help?: string;
}

const BuffToggle: React.FC<BuffToggleProps> = observer(({
  buff, label, icon, help,
}) => {
  const player = usePlayer();

  return (
    <Toggle
      checked={player.buffs[buff]}
      setChecked={(checked) => player.setBuffs({ [buff]: checked })}
      label={(
        <>
          {icon && (
            <>
              {icon}
              {' '}
            </>
          )}
          {label}
          {help && (
            <>
              {' '}
              <HelpTooltip content={help} />
            </>
          )}
        </>
      )}
    />
  );
});

export default BuffToggle;
