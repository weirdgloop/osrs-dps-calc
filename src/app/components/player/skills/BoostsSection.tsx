import Potion from '@/enums/Potion';
import { StaticImageData } from 'next/image';
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import LazyImage from '@/app/components/generic/LazyImage';
import { IconCircleCheck, IconCircleCheckFilled } from '@tabler/icons-react';
import { RenderData, toggleArrayMembership } from '@/utils';
import Overload from '@/public/img/potions/Overload.png';
import Salts from '@/public/img/potions/Smelling salts.png';
import SuperCombat from '@/public/img/potions/Super combat.png';
import Ranging from '@/public/img/potions/Ranging.png';
import Saturated from '@/public/img/potions/Saturated heart.png';
import Imbued from '@/public/img/potions/Imbued heart.png';
import Forgotten from '@/public/img/potions/Forgotten brew.png';
import SuperAttack from '@/public/img/potions/Super attack.png';
import SuperStrength from '@/public/img/potions/Super strength.png';
import Ancient from '@/public/img/potions/Ancient brew.png';
import Magic from '@/public/img/potions/Magic.png';
import Attack from '@/public/img/potions/Attack.png';
import Strength from '@/public/img/potions/Strength.png';
import SuperRanging from '@/public/img/potions/Super ranging.png';
import SuperMagic from '@/public/img/potions/Super magic.png';
import Defence from '@/public/img/potions/Defence.png';
import SuperDefence from '@/public/img/potions/Super defence.png';
import RubyHarvest from '@/public/img/potions/Ruby Harvest.png';
import BlackWarlock from '@/public/img/potions/Black Warlock.png';
import SapphireGlacialis from '@/public/img/potions/Sapphire Glacialis.png';
import Moonlight from '@/public/img/potions/Moonlight.png';
import { usePlayer } from '../../../../state/LoadoutStore';

interface IPotionToggleRenderData {
  name: string;
  image: StaticImageData;
}

const PotionToggleRenderData: RenderData<Potion, IPotionToggleRenderData> = {
  [Potion.OVERLOAD_PLUS]: {
    name: 'Overload (+)',
    image: Overload,
  },
  [Potion.SMELLING_SALTS]: {
    name: 'Smelling salts',
    image: Salts,
  },
  [Potion.SUPER_COMBAT]: {
    name: 'Super combat',
    image: SuperCombat,
  },
  [Potion.RANGING]: {
    name: 'Ranging potion',
    image: Ranging,
  },
  [Potion.SATURATED_HEART]: {
    name: 'Saturated heart',
    image: Saturated,
  },
  [Potion.IMBUED_HEART]: {
    name: 'Imbued heart',
    image: Imbued,
  },
  [Potion.FORGOTTEN_BREW]: {
    name: 'Forgotten brew',
    image: Forgotten,
  },
  [Potion.SUPER_ATTACK]: {
    name: 'Super attack',
    image: SuperAttack,
  },
  [Potion.SUPER_STRENGTH]: {
    name: 'Super strength',
    image: SuperStrength,
  },
  [Potion.ANCIENT]: {
    name: 'Ancient brew',
    image: Ancient,
  },
  [Potion.OVERLOAD]: {
    name: 'Overload',
    image: Overload,
  },
  [Potion.MAGIC]: {
    name: 'Magic potion',
    image: Magic,
  },
  [Potion.ATTACK]: {
    name: 'Attack potion',
    image: Attack,
  },
  [Potion.STRENGTH]: {
    name: 'Strength potion',
    image: Strength,
  },
  [Potion.SUPER_RANGING]: {
    name: 'Super ranging',
    image: SuperRanging,
  },
  [Potion.SUPER_MAGIC]: {
    name: 'Super magic',
    image: SuperMagic,
  },
  [Potion.DEFENCE]: {
    name: 'Defence potion',
    image: Defence,
  },
  [Potion.SUPER_DEFENCE]: {
    name: 'Super defence',
    image: SuperDefence,
  },
  [Potion.RUBY_HARVEST]: {
    name: 'Ruby Harvest',
    image: RubyHarvest,
  },
  [Potion.BLACK_WARLOCK]: {
    name: 'Black Warlock',
    image: BlackWarlock,
  },
  [Potion.SAPPHIRE_GLACIALIS]: {
    name: 'Sapphire Glacialis',
    image: SapphireGlacialis,
  },
  [Potion.MOONLIGHT]: {
    name: 'Moonlight potion',
    image: Moonlight,
  },
};

const PotionToggle: React.FC<{ potion: Potion }> = observer(({ potion }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();
  const { name, image } = PotionToggleRenderData[potion];

  const active = basePlayer.buffs.potions.includes(potion);

  const [hovering, setHovering] = useState(false);

  return (
    <button
      type="button"
      onClick={() => updateBasePlayer({ buffs: { potions: toggleArrayMembership(basePlayer.buffs.potions, potion) } })}
      className="w-full px-4 py-1 first:mt-0 first:border-0 border-t border-dark-200 flex gap-4 items-center hover:bg-dark-400"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="w-[20px] h-[23px] flex">
        <LazyImage responsive src={image.src} alt={name} />
      </div>
      <div className="text-xs">
        {name}
      </div>
      <div className="ml-auto h-6">
        {(hovering || active) && (
          active ? <IconCircleCheckFilled className="text-green-200 w-4" />
            : <IconCircleCheck className="text-gray-300 w-4" />
        )}
      </div>
    </button>
  );
});

const BoostsSection: React.FC = observer(() => (
  <>
    <h4 className="mt-4 font-bold font-serif">
      Boosts
    </h4>
    <div
      className="grow h-48 mt-2 bg-dark-500 border-dark-200 rounded border overflow-y-scroll"
    >
      <PotionToggle potion={Potion.OVERLOAD_PLUS} />
      <PotionToggle potion={Potion.SMELLING_SALTS} />
      <PotionToggle potion={Potion.SUPER_COMBAT} />
      <PotionToggle potion={Potion.RANGING} />
      <PotionToggle potion={Potion.SATURATED_HEART} />
      <PotionToggle potion={Potion.IMBUED_HEART} />
      <PotionToggle potion={Potion.SUPER_ATTACK} />
      <PotionToggle potion={Potion.SUPER_STRENGTH} />
      <PotionToggle potion={Potion.ANCIENT} />
      <PotionToggle potion={Potion.OVERLOAD} />
      <PotionToggle potion={Potion.MAGIC} />
      <PotionToggle potion={Potion.ATTACK} />
      <PotionToggle potion={Potion.STRENGTH} />
      <PotionToggle potion={Potion.SUPER_RANGING} />
      <PotionToggle potion={Potion.SUPER_MAGIC} />
      <PotionToggle potion={Potion.DEFENCE} />
      <PotionToggle potion={Potion.SUPER_DEFENCE} />
      <PotionToggle potion={Potion.RUBY_HARVEST} />
      <PotionToggle potion={Potion.BLACK_WARLOCK} />
      <PotionToggle potion={Potion.SAPPHIRE_GLACIALIS} />
      <PotionToggle potion={Potion.MOONLIGHT} />
    </div>
  </>
));

export default BoostsSection;
