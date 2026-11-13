import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import { usePlayer } from '@/state/PlayerStore';
import { PlayerSkills } from '@/types/Player';

interface BaseLevelInputProps {
  id: string;
  name: string;
  field: keyof PlayerSkills;
}

const BaseLevelInput: React.FC<BaseLevelInputProps> = observer(({ id, name, field }) => {
  const player = usePlayer();

  return (
    <NumberInput
      className="form-control w-full"
      id={id}
      required
      min={1}
      max={255}
      title={`Your base ${name} level`}
      value={player.skills[field]}
      onChange={(v) => player.setSkills({ [field]: v })}
    />
  );
});

export default BaseLevelInput;
