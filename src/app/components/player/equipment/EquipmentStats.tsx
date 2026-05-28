import React from 'react';
import { observer } from 'mobx-react-lite';
import { usePreferences } from '@/state/Preferences';
import AttributeInput from '@/app/components/generic/AttributeInput';
import { PlayerDerived } from '@/types/Player';
import { RenderData } from '@/utils';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import { StaticImageData } from 'next/image';
import strength from '@/public/img/bonuses/strength.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import prayer from '@/public/img/tabs/prayer.png';
import attackSpeed from '@/public/img/bonuses/attack_speed.png';
import { usePlayer } from '../../../../state/LoadoutStore';

type PlayerStatKey = 'offensive' | 'defensive' | 'bonuses';

interface IStatRenderData {
  name: string;
  image: StaticImageData;
}

const StatRenderData: { [k in PlayerStatKey]: RenderData<keyof PlayerDerived[k], IStatRenderData> } = {
  offensive: {
    stab: {
      name: 'Stab',
      image: dagger,
    },
    slash: {
      name: 'Slash',
      image: scimitar,
    },
    crush: {
      name: 'Crush',
      image: warhammer,
    },
    magic: {
      name: 'Magic',
      image: magic,
    },
    ranged: {
      name: 'Ranged',
      image: ranged,
    },
  },
  defensive: {
    stab: {
      name: 'Stab',
      image: dagger,
    },
    slash: {
      name: 'Slash',
      image: scimitar,
    },
    crush: {
      name: 'Crush',
      image: warhammer,
    },
    magic: {
      name: 'Magic',
      image: magic,
    },
    ranged: {
      name: 'Ranged',
      image: ranged,
    },
  },
  bonuses: {
    str: {
      name: 'Strength',
      image: strength,
    },
    ranged_str: {
      name: 'Ranged Strength',
      image: rangedStrength,
    },
    magic_str: {
      name: 'Magic Damage %',
      image: magicStrength,
    },
    prayer: {
      name: 'Prayer',
      image: prayer,
    },
  },
};

export interface PlayerStatInputProps<S extends PlayerStatKey> {
  attr: Extract<keyof PlayerDerived[S], keyof typeof StatRenderData[S]>;
}

const PlayerOffensiveInput: React.FC<PlayerStatInputProps<'offensive'>> = observer(({ attr }) => {
  const {
    derivedPlayer,
    derivedPlayerWithoutOverrides,
    updateManualModeDerivedInputs,
  } = usePlayer();
  const { manualMode } = usePreferences();

  const value = derivedPlayer.offensive[attr];
  const expectedValue = derivedPlayerWithoutOverrides.offensive[attr];
  const { name, image } = StatRenderData.offensive[attr];

  const dirty = manualMode && value !== expectedValue;

  return (
    <AttributeInput
      className={dirty ? 'bg-yellow-500' : ''}
      name={name}
      max={50000}
      disabled={!manualMode}
      image={image}
      value={value}
      onChange={(v) => updateManualModeDerivedInputs({ offensive: { [attr]: v } })}
      required
    />
  );
});

const PlayerDefensiveInput: React.FC<PlayerStatInputProps<'defensive'>> = observer(({ attr }) => {
  const {
    derivedPlayer,
    derivedPlayerWithoutOverrides,
    updateManualModeDerivedInputs,
  } = usePlayer();
  const { manualMode } = usePreferences();

  const value = derivedPlayer.defensive[attr];
  const expectedValue = derivedPlayerWithoutOverrides.defensive[attr];
  const { name, image } = StatRenderData.defensive[attr];

  const dirty = manualMode && value !== expectedValue;

  return (
    <AttributeInput
      className={dirty ? 'bg-yellow-500' : ''}
      name={name}
      max={50000}
      disabled={!manualMode}
      image={image}
      value={value}
      onChange={(v) => updateManualModeDerivedInputs({ defensive: { [attr]: v } })}
      required
    />
  );
});

const PlayerBonusesInput: React.FC<PlayerStatInputProps<'bonuses'>> = observer(({ attr }) => {
  const {
    derivedPlayer,
    derivedPlayerWithoutOverrides,
    updateManualModeDerivedInputs,
  } = usePlayer();
  const { manualMode } = usePreferences();

  const value = derivedPlayer.bonuses[attr];
  const expectedValue = derivedPlayerWithoutOverrides.bonuses[attr];
  const { name, image } = StatRenderData.bonuses[attr];

  const dirty = manualMode && value !== expectedValue;

  return (
    <AttributeInput
      className={dirty ? 'bg-yellow-500' : ''}
      name={name}
      max={50000}
      disabled={!manualMode}
      image={image}
      value={value}
      onChange={(v) => updateManualModeDerivedInputs({ defensive: { [attr]: v } })}
      required
    />
  );
});

const PlayerAttackSpeedInput: React.FC = observer(() => {
  const {
    derivedPlayer,
    derivedPlayerWithoutOverrides,
    updateManualModeDerivedInputs,
  } = usePlayer();
  const { manualMode } = usePreferences();

  const value = derivedPlayer.attackSpeed;
  const expectedValue = derivedPlayerWithoutOverrides.attackSpeed;
  const { name, image } = { name: 'Attack Speed', image: attackSpeed };

  const dirty = manualMode && value !== expectedValue;

  return (
    <AttributeInput
      className={dirty ? 'bg-yellow-500' : ''}
      name={name}
      max={50000}
      disabled={!manualMode}
      image={image}
      value={value}
      onChange={(v) => updateManualModeDerivedInputs({ attackSpeed: v })}
      required
    />
  );
});

const EquipmentStats: React.FC = observer(() => {
  const { manualMode } = usePreferences();
  const { resetManualModeEquipmentBonuses } = usePlayer();

  return (
    <div className="px-4 my-4">
      <div className="flex justify-between items-center gap-2">
        <h4 className="font-serif font-bold">Bonuses</h4>
        {manualMode && (
          <button type="button" className="text-xs underline" onClick={() => resetManualModeEquipmentBonuses()}>
            Calculate from equipment
          </button>
        )}
      </div>
      <div className="py-1">
        <div className="flex gap-4 justify-center">
          <div className="w-[95px]">
            <p className="text-sm text-gray-300">Offensive</p>
            <div className="flex flex-col gap-1 mt-3 text-center">
              <PlayerOffensiveInput attr="stab" />
              <PlayerOffensiveInput attr="slash" />
              <PlayerOffensiveInput attr="crush" />
              <PlayerOffensiveInput attr="magic" />
              <PlayerOffensiveInput attr="ranged" />
            </div>
          </div>
          <div className="w-[95px]">
            <p className="text-sm text-gray-300">Offensive</p>
            <div className="flex flex-col gap-1 mt-3 text-center">
              <PlayerDefensiveInput attr="stab" />
              <PlayerDefensiveInput attr="slash" />
              <PlayerDefensiveInput attr="crush" />
              <PlayerDefensiveInput attr="magic" />
              <PlayerDefensiveInput attr="ranged" />
            </div>
          </div>
          <div className="w-[95px]">
            <p className="text-sm text-gray-300">Offensive</p>
            <div className="flex flex-col gap-1 mt-3 text-center">
              <PlayerBonusesInput attr="str" />
              <PlayerBonusesInput attr="ranged_str" />
              <PlayerBonusesInput attr="magic_str" />
              <PlayerBonusesInput attr="prayer" />
              <PlayerAttackSpeedInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EquipmentStats;
