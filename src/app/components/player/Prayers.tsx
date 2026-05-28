import { observer } from 'mobx-react-lite';
import React from 'react';
import { Prayer } from '@/enums/Prayer';
import GridItem from '@/app/components/generic/GridItem';
import { usePlayer } from '@/state/LoadoutStore';
import { RenderData } from '@/utils';
import BurstOfStrength from '@/public/img/prayers/Burst_of_Strength.png';
import ClarityOfThought from '@/public/img/prayers/Clarity_of_Thought.png';
import SharpEye from '@/public/img/prayers/Sharp_Eye.png';
import MysticWill from '@/public/img/prayers/Mystic_Will.png';
import SuperhumanStrength from '@/public/img/prayers/Superhuman_Strength.png';
import ImprovedReflexes from '@/public/img/prayers/Improved_Reflexes.png';
import HawkEye from '@/public/img/prayers/Hawk_Eye.png';
import MysticLore from '@/public/img/prayers/Mystic_Lore.png';
import UltimateStrength from '@/public/img/prayers/Ultimate_Strength.png';
import IncredibleReflexes from '@/public/img/prayers/Incredible_Reflexes.png';
import EagleEye from '@/public/img/prayers/Eagle_Eye.png';
import MysticMight from '@/public/img/prayers/Mystic_Might.png';
import Deadeye from '@/public/img/prayers/Deadeye.png';
import MysticVigour from '@/public/img/prayers/Mystic_Vigour.png';
import Chivalry from '@/public/img/prayers/Chivalry.png';
import Piety from '@/public/img/prayers/Piety.png';
import Rigour from '@/public/img/prayers/Rigour.png';
import Augury from '@/public/img/prayers/Augury.png';
import ThickSkin from '@/public/img/prayers/Thick Skin.png';
import RockSkin from '@/public/img/prayers/Rock Skin.png';
import SteelSkin from '@/public/img/prayers/Steel Skin.png';
import ProtectMagic from '@/public/img/prayers/Protect_from_Magic.png';
import ProtectMelee from '@/public/img/prayers/Protect_from_Melee.png';
import ProtectRanged from '@/public/img/prayers/Protect_from_Missiles.png';
import Redemption from '@/public/img/prayers/Redemption.png';
import Retribution from '@/public/img/prayers/Retribution.png';
import Smite from '@/public/img/prayers/Smite.png';
import RapidRestore from '@/public/img/prayers/Rapid_Restore.png';
import RapidHeal from '@/public/img/prayers/Rapid_Heal.png';
import ProtectItem from '@/public/img/prayers/Protect_Item.png';
import Preserve from '@/public/img/prayers/Preserve.png';
import { StaticImageData } from 'next/image';

interface IPrayerRenderData {
  image: StaticImageData;
}

const PrayerRenderData: RenderData<Prayer, IPrayerRenderData> = {
  [Prayer.BURST_OF_STRENGTH]: {
    image: BurstOfStrength,
  },
  [Prayer.CLARITY_OF_THOUGHT]: {
    image: ClarityOfThought,
  },
  [Prayer.SHARP_EYE]: {
    image: SharpEye,
  },
  [Prayer.MYSTIC_WILL]: {
    image: MysticWill,
  },
  [Prayer.SUPERHUMAN_STRENGTH]: {
    image: SuperhumanStrength,
  },
  [Prayer.IMPROVED_REFLEXES]: {
    image: ImprovedReflexes,
  },
  [Prayer.HAWK_EYE]: {
    image: HawkEye,
  },
  [Prayer.MYSTIC_LORE]: {
    image: MysticLore,
  },
  [Prayer.ULTIMATE_STRENGTH]: {
    image: UltimateStrength,
  },
  [Prayer.INCREDIBLE_REFLEXES]: {
    image: IncredibleReflexes,
  },
  [Prayer.EAGLE_EYE]: {
    image: EagleEye,
  },
  [Prayer.MYSTIC_MIGHT]: {
    image: MysticMight,
  },
  [Prayer.CHIVALRY]: {
    image: Chivalry,
  },
  [Prayer.PIETY]: {
    image: Piety,
  },
  [Prayer.RIGOUR]: {
    image: Rigour,
  },
  [Prayer.AUGURY]: {
    image: Augury,
  },
  [Prayer.THICK_SKIN]: {
    image: ThickSkin,
  },
  [Prayer.ROCK_SKIN]: {
    image: RockSkin,
  },
  [Prayer.STEEL_SKIN]: {
    image: SteelSkin,
  },
  [Prayer.DEADEYE]: {
    image: Deadeye,
  },
  [Prayer.MYSTIC_VIGOUR]: {
    image: MysticVigour,
  },
  [Prayer.PROTECT_MAGIC]: {
    image: ProtectMagic,
  },
  [Prayer.PROTECT_RANGED]: {
    image: ProtectRanged,
  },
  [Prayer.PROTECT_MELEE]: {
    image: ProtectMelee,
  },
  [Prayer.RETRIBUTION]: {
    image: Retribution,
  },
  [Prayer.REDEMPTION]: {
    image: Redemption,
  },
  [Prayer.SMITE]: {
    image: Smite,
  },
  [Prayer.RAPID_RESTORE]: {
    image: RapidRestore,
  },
  [Prayer.RAPID_HEAL]: {
    image: RapidHeal,
  },
  [Prayer.PROTECT_ITEM]: {
    image: ProtectItem,
  },
  [Prayer.PRESERVE]: {
    image: Preserve,
  },
};

const PrayerToggle: React.FC<{ prayer: Prayer }> = observer(({ prayer }) => {
  const { basePlayer, togglePrayer } = usePlayer();
  const { image } = PrayerRenderData[prayer];

  return (
    <GridItem
      name={prayer}
      image={image}
      active={basePlayer.prayers.includes(prayer)}
      onClick={() => togglePrayer(prayer)}
    />
  );
});

const Prayers: React.FC = observer(() => {
  const { derivedPlayer } = usePlayer();

  return (
    <div className="px-4 mb-8">
      <div className="grid grid-cols-4 gap-y-4 mt-6 w-48 m-auto items-center justify-center">
        <PrayerToggle prayer={Prayer.BURST_OF_STRENGTH} />
        <PrayerToggle prayer={Prayer.CLARITY_OF_THOUGHT} />
        <PrayerToggle prayer={Prayer.SHARP_EYE} />
        <PrayerToggle prayer={Prayer.MYSTIC_WILL} />
        <PrayerToggle prayer={Prayer.SUPERHUMAN_STRENGTH} />
        <PrayerToggle prayer={Prayer.IMPROVED_REFLEXES} />
        <PrayerToggle prayer={Prayer.HAWK_EYE} />
        <PrayerToggle prayer={Prayer.MYSTIC_LORE} />
        <PrayerToggle prayer={Prayer.ULTIMATE_STRENGTH} />
        <PrayerToggle prayer={Prayer.INCREDIBLE_REFLEXES} />
        <PrayerToggle prayer={Prayer.EAGLE_EYE} />
        <PrayerToggle prayer={Prayer.MYSTIC_MIGHT} />
        <PrayerToggle prayer={Prayer.THICK_SKIN} />
        <PrayerToggle prayer={Prayer.CHIVALRY} />
        <PrayerToggle prayer={Prayer.DEADEYE} />
        <PrayerToggle prayer={Prayer.MYSTIC_VIGOUR} />
        <PrayerToggle prayer={Prayer.ROCK_SKIN} />
        <PrayerToggle prayer={Prayer.PIETY} />
        <PrayerToggle prayer={Prayer.RIGOUR} />
        <PrayerToggle prayer={Prayer.AUGURY} />
        <PrayerToggle prayer={Prayer.STEEL_SKIN} />
      </div>
      {
        derivedPlayer.leagues.six.effects.talent_air_spell_damage_active_prayers && (
          <div className="mt-6">
            <p className="text-xs">
              You gain extra damage for each active prayer because of a Demonic Pact.
              Select any additional prayers you are using.
            </p>
            <div className="grid grid-cols-4 gap-y-4 mt-6 w-48 m-auto items-center justify-center">
              <PrayerToggle prayer={Prayer.RAPID_RESTORE} />
              <PrayerToggle prayer={Prayer.RAPID_HEAL} />
              <PrayerToggle prayer={Prayer.PROTECT_ITEM} />
              <PrayerToggle prayer={Prayer.PROTECT_MAGIC} />
              <PrayerToggle prayer={Prayer.PROTECT_MELEE} />
              <PrayerToggle prayer={Prayer.PROTECT_RANGED} />
              <PrayerToggle prayer={Prayer.RETRIBUTION} />
              <PrayerToggle prayer={Prayer.REDEMPTION} />
              <PrayerToggle prayer={Prayer.SMITE} />
              <PrayerToggle prayer={Prayer.PRESERVE} />
            </div>
          </div>
        )
      }
    </div>
  );
});

export default Prayers;
