import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePlayer } from '@/state/PlayerStore';
import { calculateCombatLevel } from '@/utils';

const CombatLevelLabel: React.FC = observer(() => {
  const player = usePlayer();

  return (
    <div className="text-xs font-bold text-gray-500 dark:text-gray-300">
      Level
      {' '}
      {calculateCombatLevel(player.skills)}
    </div>
  );
});

export default CombatLevelLabel;
