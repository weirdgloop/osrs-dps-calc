import { observer } from 'mobx-react-lite';
import { clsx } from 'clsx';
import { useStore } from '@/state';

interface IPactsSpentProps {
  short?: boolean;
}

const PactsSpent = observer((props: IPactsSpentProps) => {
  const { short } = props;
  const store = useStore();
  const numberSelected = store.player.leagues.six.selectedNodeIds.size;
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
