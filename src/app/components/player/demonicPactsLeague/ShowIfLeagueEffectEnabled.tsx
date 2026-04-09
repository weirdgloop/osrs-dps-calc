import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { LeaguesEffect } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';

interface ShowIfNodeSelectedProps {
  leaguesEffect: LeaguesEffect;
  children: ReactElement;
}

const ShowIfLeagueEffectEnabled = observer(({
  leaguesEffect,
  children,
}: ShowIfNodeSelectedProps) => {
  const store = useStore();
  const isSelected = store.currentEffects.has(leaguesEffect);

  if (!isSelected) {
    return null;
  }

  return children;
});

export default ShowIfLeagueEffectEnabled;
