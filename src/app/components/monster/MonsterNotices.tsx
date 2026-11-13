import React from 'react';
import { observer } from 'mobx-react-lite';
import { useCalc } from '@/state/CalcStore';
import { useMonster } from '@/state/MonsterStore';
import { usePlayer } from '@/state/PlayerStore';

const MonsterNotices: React.FC = observer(() => {
  const calc = useCalc();
  const monster = useMonster();
  const player = usePlayer();

  const issues = calc.userIssues.get(player.uuid)?.filter((i) => i.type.startsWith('monster_overall')) ?? [];

  return (
    <>
      {issues.length > 0 && (
        <div className="bg-orange-400 border-b border-orange-300 text-xs px-4 py-1">
          {issues[0].message}
        </div>
      )}
      {monster.isCustom && (
        <div className="text-xs px-4 py-2 bg-dark-400 border-b border-dark-200 text-gray-300">
          You can change the monster&apos;s stats and attributes
          by editing the fields below.
        </div>
      )}
    </>
  );
});

export default MonsterNotices;
