import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { ConditionalKeys } from 'type-fest';
import NumberInput from '@/app/components/generic/NumberInput';
import HelpTooltip from '@/app/components/generic/HelpTooltip';
import { PlayerBuffs, usePlayer } from '@/state/PlayerStore';

interface BuffNumberInputProps {
  buff: ConditionalKeys<PlayerBuffs, number>;
  min: number;
  max: number;
  icon: ReactNode;
  label: string;
  help: string;
}

const BuffNumberInput: React.FC<BuffNumberInputProps> = observer(({
  buff, min, max, icon, label, help,
}) => {
  const player = usePlayer();

  return (
    <div className="w-full">
      <NumberInput
        className="form-control w-12"
        required
        min={min}
        max={max}
        value={player.buffs[buff]}
        onChange={(value) => player.setBuffs({ [buff]: value })}
      />
      <span className="ml-1 text-sm select-none">
        {icon}
        {' '}
        {label}
        {' '}
        <HelpTooltip content={help} />
      </span>
    </div>
  );
});

export default BuffNumberInput;
