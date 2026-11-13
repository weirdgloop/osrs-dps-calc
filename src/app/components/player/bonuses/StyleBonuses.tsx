import React from 'react';
import { observer } from 'mobx-react-lite';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import BonusColumn from '@/app/components/player/bonuses/BonusColumn';
import BonusInput from '@/app/components/player/bonuses/BonusInput';
import { usePlayer } from '@/state/PlayerStore';

const STYLES = [
  { key: 'stab', name: 'Stab', image: dagger },
  { key: 'slash', name: 'Slash', image: scimitar },
  { key: 'crush', name: 'Crush', image: warhammer },
  { key: 'magic', name: 'Magic', image: magic },
  { key: 'ranged', name: 'Ranged', image: ranged },
] as const;

interface StyleBonusesProps {
  category: 'offensive' | 'defensive';
  title: string;
}

const StyleBonuses: React.FC<StyleBonusesProps> = observer(({ category, title }) => {
  const player = usePlayer();

  return (
    <BonusColumn title={title}>
      {STYLES.map(({ key, name, image }) => (
        <BonusInput
          key={key}
          name={name}
          image={image}
          value={player[category][key]}
          isOverridden={player[category][key] !== player.gearBonuses[category][key]}
          onChange={(value) => player.setManualBonuses({ [category]: { [key]: value } })}
        />
      ))}
    </BonusColumn>
  );
});

export default StyleBonuses;
