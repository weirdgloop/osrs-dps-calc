import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import { usePlayer } from '@/state/PlayerStore';
import { PlayerSkills } from '@/types/Player';

interface BoostedLevelProps {
  id: string;
  name: string;
  field: keyof PlayerSkills;
}

const BoostedLevel: React.FC<BoostedLevelProps> = observer(({ id, name, field }) => {
  const player = usePlayer();
  const level = player.skills[field] + player.boosts[field];

  if (field !== 'hp') {
    return (
      <span title={`Your current ${name} level`}>
        {level}
        /
      </span>
    );
  }

  return (
    <div className="flex items-center">
      <NumberInput
        className="form-control w-full"
        id={id}
        required
        min={1}
        max={255}
        title={`Your current ${name} level`}
        value={level}
        onChange={(v) => player.setBoost(field, v - player.skills[field])}
      />
      /
    </div>
  );
});

export default BoostedLevel;
