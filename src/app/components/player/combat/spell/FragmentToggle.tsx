import React from 'react';
import fragment_wind from '@/public/img/misc/fragment_wind.png';
import fragment_water from '@/public/img/misc/fragment_water.png';
import fragment_earth from '@/public/img/misc/fragment_earth.png';
import fragment_fire from '@/public/img/misc/fragment_fire.png';
import BuffToggle from '@/app/components/player/buffs/BuffToggle';
import { Spellement } from '@/types/Spell';

const FRAGMENTS = {
  air: { image: fragment_wind, buff: 'fragmentOfWind', name: 'whispering wind' },
  water: { image: fragment_water, buff: 'fragmentOfWater', name: 'deep water' },
  earth: { image: fragment_earth, buff: 'fragmentOfEarth', name: 'living earth' },
  fire: { image: fragment_fire, buff: 'fragmentOfFire', name: 'burning fire' },
} as const satisfies Record<Spellement, unknown>;

const FragmentToggle: React.FC<{ element: Spellement }> = ({ element }) => {
  const { image, buff, name } = FRAGMENTS[element];

  return (
    <BuffToggle
      buff={buff}
      icon={<img src={image.src} width={18} className="inline-block" alt="" />}
      label={`Fragment of ${name}`}
      help="Raises maximum hit by 2."
    />
  );
};

export default FragmentToggle;
