import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { usePlayer } from '@/state/LoadoutStore';
import { LeaguesEffect } from '@/app/components/player/demonicPactsLeague/pactSelector/parse_skill_tree_elements';

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
  const { currentEffects } = usePlayer();

  let isSelected: boolean;
  if ('leaguesEffect' in props) {
    isSelected = currentEffects.has(props.leaguesEffect);
  } else {
    isSelected = props.leaguesEffects.some((leaguesEffect) => currentEffects.has(leaguesEffect));
  }

  if (!isSelected) {
    return null;
  }

  return props.children;
});

export default ShowIfLeagueEffectEnabled;
