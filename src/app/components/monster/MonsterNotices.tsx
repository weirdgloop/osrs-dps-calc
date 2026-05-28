import { observer } from 'mobx-react-lite';
import React from 'react';

import { useMonster } from '@/state/MonsterStore';
import { useIssues } from '@/state/IssuesStore';

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
  const { monsterIssues } = useIssues();

  if (!monsterIssues) {
    return null;
  }

  return (
    <>
      {monsterIssues.map((issue) => (
        <div key={issue.id} className="bg-orange-400 border-b border-orange-300 text-xs px-4 py-1">
          {issue.message}
        </div>
      ))}
    </>
  );
});

const MonsterNotices: React.FC = observer(() => (
  <>
    <MonsterIssues />
    <CustomMonsterBanner />
  </>
));

export default MonsterNotices;
