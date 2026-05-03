import { observer } from 'mobx-react-lite';
import React from 'react';
import GridItem from '@/app/components/generic/GridItem';
import { MonsterInputs } from '@/types/Monster';
import { StaticImageData } from 'next/image';

import ProtectMagic from '@/public/img/prayers/Protect_from_Magic.png';
import ProtectMelee from '@/public/img/prayers/Protect_from_Melee.png';
import ProtectRanged from '@/public/img/prayers/Protect_from_Missiles.png';
import { useMonster } from '@/state/MonsterStore';

interface IMonsterPrayerRenderData {
  name: string;
  image: StaticImageData;
}

const MonsterPrayerRenderData: { [k in keyof MonsterInputs['prayers']]: IMonsterPrayerRenderData } = {
  magic: { name: 'Magic', image: ProtectMagic },
  ranged: { name: 'Ranged', image: ProtectRanged },
  melee: { name: 'Melee', image: ProtectMelee },
};

interface MonsterPrayerButtonProps {
  gridItemIx: number;
  prayer: keyof MonsterInputs['prayers'];
}

const MonsterPrayerButton: React.FC<MonsterPrayerButtonProps> = observer(({ gridItemIx, prayer }) => {
  const { inputs, updateInputs } = useMonster();
  const { name, image } = MonsterPrayerRenderData[prayer];

  return (
    <GridItem
      item={gridItemIx}
      name={name}
      image={image}
      active={inputs.prayers[prayer]}
      onClick={() => updateInputs({ prayers: { [prayer]: !inputs.prayers[prayer] } })}
    />
  );
});

const MonsterPrayers: React.FC = observer(() => (
  <div className="grid grid-cols-3 gap-y-2 py-4 px-4 w-full m-auto justify-items-center items-center">
    <MonsterPrayerButton gridItemIx={0} prayer="magic" />
    <MonsterPrayerButton gridItemIx={1} prayer="ranged" />
    <MonsterPrayerButton gridItemIx={2} prayer="melee" />
  </div>
));

export default MonsterPrayers;
