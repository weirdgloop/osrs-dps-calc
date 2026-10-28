import React from 'react';
import { observer } from 'mobx-react-lite';
import UserIssueWarning from '@/app/components/generic/UserIssueWarning';
import { useCalc } from '@/state/CalcStore';
import { usePlayer } from '@/state/PlayerStore';

const SpellIssueWarning: React.FC = observer(() => {
  const calc = useCalc();
  const player = usePlayer();

  const issue = calc.userIssues.get(player.uuid)?.find((i) => i.type.startsWith('spell_'));

  return issue ? <UserIssueWarning issue={issue} /> : null;
});

export default SpellIssueWarning;
