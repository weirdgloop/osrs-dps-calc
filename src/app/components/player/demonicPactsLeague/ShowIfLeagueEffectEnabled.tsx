import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import { LeaguesEffect } from '@/app/components/player/demonicPactsLeague/parse_skill_tree_elements';

interface ShowIfSingleNodeSelectedProps {
  leaguesEffect: LeaguesEffect;
  children: ReactElement;
}

interface ShowIfAnyNodeSelectedProps {
  leaguesEffects: LeaguesEffect[];
  children: ReactElement;
}

type ShowIfNodeSelectedProps = ShowIfSingleNodeSelectedProps | ShowIfAnyNodeSelectedProps;

const ShowIfLeagueEffectEnabled = observer((props: ShowIfNodeSelectedProps) => {
  const store = useStore();

  let isSelected: boolean;
  if ('leaguesEffect' in props) {
    isSelected = store.currentEffects.has(props.leaguesEffect);
  } else {
    isSelected = props.leaguesEffects.some((leaguesEffect) => store.currentEffects.has(leaguesEffect));
  }

  if (!isSelected) {
    return null;
  }

  return props.children;
});

export default ShowIfLeagueEffectEnabled;
