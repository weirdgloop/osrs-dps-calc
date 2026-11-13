import React from 'react';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import prayer from '@/public/img/tabs/prayer.png';
import mining from '@/public/img/bonuses/mining.png';
import herblore from '@/public/img/bonuses/herblore.png';
import farming from '@/public/img/bonuses/farming.png';
import SkillInput from '@/app/components/player/skills/SkillInput';

const SKILLS = [
  { name: 'Attack', field: 'atk', image: attack },
  { name: 'Strength', field: 'str', image: strength },
  { name: 'Defence', field: 'def', image: defence },
  { name: 'Hitpoints', field: 'hp', image: hitpoints },
  { name: 'Ranged', field: 'ranged', image: ranged },
  { name: 'Magic', field: 'magic', image: magic },
  { name: 'Prayer', field: 'prayer', image: prayer },
  { name: 'Mining', field: 'mining', image: mining },
  { name: 'Herblore', field: 'herblore', image: herblore },
  { name: 'Farming', field: 'farming', image: farming },
] as const;

const SkillInputs: React.FC = () => (
  <div className="grid items-center gap-x-2" style={{ gridTemplateColumns: '2fr 2fr 2fr 2fr' }}>
    {SKILLS.map(({ name, field, image }) => (
      <SkillInput key={field} name={name} field={field} image={image} />
    ))}
  </div>
);

export default SkillInputs;
