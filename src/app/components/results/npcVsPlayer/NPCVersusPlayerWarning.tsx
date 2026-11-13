import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useMonster } from '@/state/MonsterStore';

const NPCVersusPlayerWarning: React.FC = observer(() => {
  const monster = useMonster();

  if (monster.hasMaxHitDiscrepancy) {
    return (
      <div
        className="w-full bg-orange-500 text-white px-4 py-1 text-sm border-b border-orange-400 flex items-center gap-2"
      >
        <IconAlertTriangle className="text-orange-200" />
        This calculation uses the max hit shown by Monster Examine, but the wiki reports a different max hit for this monster. Results may be inaccurate.
      </div>
    );
  }

  return (
    <div
      className="w-full bg-yellow-500 text-white px-4 py-1 text-sm border-b border-yellow-400 flex items-center gap-2"
    >
      <IconAlertTriangle className="text-orange-200" />
      <div>
        This is an experimental feature and may not be 100% accurate. Report issues on
        {' '}
        <a href="https://discord.gg/JXeUnR9stP" target="_blank">Discord</a>
        .
      </div>
    </div>
  );
});

export default NPCVersusPlayerWarning;
