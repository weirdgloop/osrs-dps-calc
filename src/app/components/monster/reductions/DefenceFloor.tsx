import React from 'react';
import { observer } from 'mobx-react-lite';
import { getDefenceFloor } from '@/lib/scaling/DefenceReduction';
import { useMonster } from '@/state/MonsterStore';

const DefenceFloor: React.FC = observer(() => {
  const monster = useMonster();
  const defenceFloor = getDefenceFloor(monster.snapshot);

  if (defenceFloor === 0) return null;

  return (
    <p className="text-xs mb-2 text-gray-300">
      Defence floor:
      {' '}
      {defenceFloor}
    </p>
  );
});

export default DefenceFloor;
