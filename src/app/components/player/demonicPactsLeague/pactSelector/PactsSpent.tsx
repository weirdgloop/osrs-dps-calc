import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import { usePlayer } from '@/state/LoadoutStore';

interface IPactsSpentProps {
  short?: boolean;
}

const PactsSpent = observer((props: IPactsSpentProps) => {
  const { short } = props;
  const { basePlayer } = usePlayer();
  const numberSelected = basePlayer.leagues.six.selectedNodeIds.size;
  return (
    <span className="font-medium">
      <span
        className={clsx('font-bold', {
          'text-orange-300':
            numberSelected >= 30 && numberSelected < 40,
          'text-red-300 underline': numberSelected >= 40,
        })}
      >
        {numberSelected}
      </span>
      {' '}
      / 40
      {!short && ' pacts spent'}
    </span>
  );
});

export default PactsSpent;
