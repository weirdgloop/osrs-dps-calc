import React from 'react';
import { usePlayer } from '@/state/LoadoutStore';
import { observer } from 'mobx-react-lite';
import { stanceRequiresSpell } from '@/types/PlayerCombatStyle';
import SpellSelect from '@/app/components/player/combat/spell/SpellSelect';
import SunfireRunesToggle from '@/app/components/player/combat/spell/SunfireRunesToggle';
import ChargeToggle from '@/app/components/player/combat/spell/ChargeToggle';
import MarkOfDarknessToggle from '@/app/components/player/combat/spell/MarkOfDarknessToggle';
import { useIssues } from '@/state/IssuesStore';
import UserIssueWarning from '@/app/components/generic/UserIssueWarning';
import SpellDisplay from './SpellDisplay';

const SpellHeader: React.FC = observer(() => {
  const { spellIssues } = useIssues();
  return (
    <h4 className="font-bold font-serif flex gap-2">
      Spell
      {spellIssues.length > 0 && (
      <UserIssueWarning issue={spellIssues[0].message} />
      )}
    </h4>
  );
});

const SpellContainer: React.FC = observer(() => {
  const { basePlayer } = usePlayer();
  if (!stanceRequiresSpell(basePlayer.style.stance)) {
    return null;
  }

  return (
    <div className="px-4">
      <SpellHeader />
      <div className="my-2">
        <SpellDisplay />
      </div>
      <div className="mt-2">
        <SpellSelect />
      </div>
      <div className="my-4">
        <SunfireRunesToggle />
        <ChargeToggle />
        <MarkOfDarknessToggle />
      </div>
    </div>
  );
});

export default SpellContainer;
