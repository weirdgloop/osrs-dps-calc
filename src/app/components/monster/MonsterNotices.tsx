import { observer } from 'mobx-react-lite';
import React from 'react';

import { useLoadouts } from '@/state/PlayerLoadouts';
import { useMonster } from '@/state/MonsterStore';

const CustomMonsterBanner: React.FC = observer(() => {
  const { isCustomMonster } = useMonster();

  if (!isCustomMonster) {
    return null;
  }

  return (
    <div className="text-xs px-4 py-2 bg-dark-400 border-b border-dark-200 text-gray-300">
      You can change the monster&apos;s stats and attributes
      by editing the fields below.
    </div>
  );
});

const MonsterIssues: React.FC = observer(() => {
  const { issues } = useIssues();
  const { selectedLoadout } = useLoadouts();

  const issue = issues.find((i) => i.type.startsWith('monster_overall') && (!i.loadout || i.loadout === `${selectedLoadout + 1}`));
  if (!issue) {
    return null;
  }

  return (
    <div className="bg-orange-400 border-b border-orange-300 text-xs px-4 py-1">
      {issue.message}
    </div>
  );
});

const MonsterNotices: React.FC = observer(() => (
  <>
    <MonsterIssues />
    <CustomMonsterBanner />
  </>
));

export default MonsterNotices;
