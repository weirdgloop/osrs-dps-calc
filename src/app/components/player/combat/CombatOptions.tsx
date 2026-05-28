import { observer } from 'mobx-react-lite';
import React from 'react';
import CombatStyleSelector from '@/app/components/player/combat/CombatStyleSelector';
import SpellContainer from '@/app/components/player/combat/spell/SpellContainer';

const CombatOptions: React.FC = observer(() => (
  <div>
    <CombatStyleSelector />
    <SpellContainer />
  </div>
));

export default CombatOptions;
