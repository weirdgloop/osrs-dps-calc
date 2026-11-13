import React from 'react';
import { observer } from 'mobx-react-lite';
import BuffItem from '@/app/components/player/buffs/BuffItem';
import Potion from '@/enums/Potion';
import { usePlayer } from '@/state/PlayerStore';
import { PotionMap } from '@/utils';

const SORTED_POTIONS = Object.entries(PotionMap).sort((a, b) => a[1].order - b[1].order);

const PotionList: React.FC = observer(() => {
  const player = usePlayer();

  return (
    <>
      {SORTED_POTIONS.map(([k, v]) => {
        const potion: Potion = parseInt(k);

        return (
          <BuffItem
            key={k}
            potion={potion}
            name={v.name}
            image={v.image}
            active={player.buffs.potions.includes(potion)}
            setActive={player.togglePotion}
          />
        );
      })}
    </>
  );
});

export default PotionList;
