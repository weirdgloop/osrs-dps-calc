import React from 'react';
import { observer } from 'mobx-react-lite';
import { SortedPrayers } from '@/enums/Prayer';
import GridItem from '@/app/components/generic/GridItem';
import { usePlayer } from '@/state/PlayerStore';

const Prayers: React.FC = observer(() => {
  const player = usePlayer();

  return (
    <div className="px-4 mb-8">
      <div className="grid grid-cols-4 gap-y-4 mt-6 w-48 m-auto items-center justify-center">
        {SortedPrayers.map(([k, v]) => {
          const prayer = parseInt(k);

          return (
            <GridItem
              key={k}
              item={prayer}
              name={v.name}
              image={v.image}
              active={player.prayers.includes(prayer)}
              onClick={player.togglePrayer}
            />
          );
        })}
      </div>
    </div>
  );
});

export default Prayers;
