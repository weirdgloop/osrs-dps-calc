import React from 'react';

import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import prayer from '@/public/img/tabs/prayer.png';
import mining from '@/public/img/bonuses/mining.png';
import { observer } from 'mobx-react-lite';
import UsernameLookup from '@/app/components/player/skills/UsernameLookup';
import SkillInput from '@/app/components/player/skills/SkillInput';
import Potion from '@/enums/Potion';
import { PotionMap } from '@/utils';
import BuffItem from '@/app/components/player/buffs/BuffItem';
import { useStore } from '@/state';

const Skills: React.FC = observer(() => {
  const store = useStore();
  const { player } = store;

  return (
    <div className="px-4 mt-4 flex flex-col mb-6 grow">
      <div className="flex items-center">
        <UsernameLookup />
      </div>
      <div className="mt-4">
        <div className="grid items-center gap-x-2" style={{ gridTemplateColumns: '2fr 2fr 2fr 2fr' }}>
          <SkillInput name="Attack" field="atk" image={attack} />
          <SkillInput name="Strength" field="str" image={strength} />
          <SkillInput name="Defence" field="def" image={defence} />
          <SkillInput name="Hitpoints" field="hp" image={hitpoints} />
          <SkillInput name="Ranged" field="ranged" image={ranged} />
          <SkillInput name="Magic" field="magic" image={magic} />
          <SkillInput name="Prayer" field="prayer" image={prayer} />
          <SkillInput name="Mining" field="mining" image={mining} />
        </div>
      </div>
      <h4 className="mt-4 font-bold font-serif">
        Boosts
      </h4>
      <div
        className="grow h-48 mt-2 bg-white dark:bg-dark-500 dark:border-dark-200 rounded border border-gray-300 overflow-y-scroll"
      >
        {
          Object.entries(PotionMap).sort((a, b) => a[1].order - b[1].order).map(([k, v]) => {
            const potion: Potion = parseInt(k);
            const isActive = player.buffs.potions.includes(potion);

            return (
              <BuffItem
                key={k}
                potion={potion}
                name={v.name}
                image={v.image}
                active={isActive}
                setActive={store.togglePlayerPotion}
              />
            );
          })
        }
      </div>
    </div>
  );
});

export default Skills;
