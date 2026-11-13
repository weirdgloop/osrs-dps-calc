import React from 'react';
import { observer } from 'mobx-react-lite';
import CombatStyle from '@/app/components/player/combat/CombatStyle';
import SpellSection from '@/app/components/player/combat/spell/SpellSection';
import { usePlayer } from '@/state/PlayerStore';

const SPELL_STANCES = ['Autocast', 'Defensive Autocast', 'Manual Cast'];

const Combat: React.FC = observer(() => {
  const player = usePlayer();

  return (
    <div>
      <div className="flex flex-col my-4">
        {player.availableCombatStyles.map((style) => <CombatStyle key={`${style.name}-${style.type}-${style.stance}`} style={style} />)}
      </div>
      {SPELL_STANCES.includes(player.style.stance || '') && <SpellSection />}
    </div>
  );
});

export default Combat;
