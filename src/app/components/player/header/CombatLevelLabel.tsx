import { observer } from 'mobx-react-lite';
import React from 'react';
import { usePlayer } from '../../../../state/LoadoutStore';

const CombatLevelLabel: React.FC = observer(() => {
  const { combatLevel } = usePlayer();

  return (
    <div className="text-xs font-bold text-gray-300">
      Level
      {' '}
      {combatLevel}
    </div>
  );
});

export default CombatLevelLabel;
