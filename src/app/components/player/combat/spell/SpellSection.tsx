import React from 'react';
import SpellIssueWarning from '@/app/components/player/combat/spell/SpellIssueWarning';
import SpellContainer from '@/app/components/player/combat/spell/SpellContainer';
import SpellSelect from '@/app/components/player/combat/spell/SpellSelect';
import SpellToggles from '@/app/components/player/combat/spell/SpellToggles';

const SpellSection: React.FC = () => (
  <div className="px-4">
    <h4 className="font-bold font-serif flex gap-2">
      Spell
      <SpellIssueWarning />
    </h4>
    <div className="my-2">
      <SpellContainer />
    </div>
    <div className="mt-2">
      <SpellSelect />
    </div>
    <div className="my-4">
      <SpellToggles />
    </div>
  </div>
);

export default SpellSection;
