import { observer } from 'mobx-react-lite';
import React from 'react';
import GridItem from '@/app/components/generic/GridItem';
import { StaticImageData } from 'next/image';

import ProtectMagic from '@/public/img/prayers/Protect_from_Magic.png';
import ProtectMelee from '@/public/img/prayers/Protect_from_Melee.png';
import ProtectRanged from '@/public/img/prayers/Protect_from_Missiles.png';
import { useMonster } from '@/state/MonsterStore';
import { MonsterInputs } from '@/types/Monster';

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
  prayer: keyof MonsterInputs['prayers'];
}

const MonsterPrayerButton: React.FC<MonsterPrayerButtonProps> = observer(({ prayer }) => {
  const { monsterBase, updateMonsterBase } = useMonster();
  const { name, image } = MonsterPrayerRenderData[prayer];

  return (
    <GridItem
      name={name}
      image={image}
      active={monsterBase.inputs.prayers[prayer]}
      onClick={() => updateMonsterBase({ inputs: { prayers: { [prayer]: !monsterBase.inputs.prayers[prayer] } } })}
    />
  );
});

const MonsterPrayers: React.FC = observer(() => (
  <div className="grid grid-cols-3 gap-y-2 py-4 px-4 w-full m-auto justify-items-center items-center">
    <MonsterPrayerButton prayer="magic" />
    <MonsterPrayerButton prayer="ranged" />
    <MonsterPrayerButton prayer="melee" />
  </div>
));

export default MonsterPrayers;
