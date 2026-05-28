import { observer } from 'mobx-react-lite';
import React from 'react';
import { useMonster } from '@/state/MonsterStore';
import AttributeInput from '@/app/components/generic/AttributeInput';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import magic from '@/public/img/bonuses/magic.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import ranged from '@/public/img/bonuses/ranged.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import dagger from '@/public/img/bonuses/dagger.png';
import { StaticImageData } from 'next/image';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import ranged_light from '@/public/img/bonuses/ranged_light.webp';
import ranged_standard from '@/public/img/bonuses/ranged_standard.webp';
import ranged_heavy from '@/public/img/bonuses/ranged_heavy.webp';
import defence from '@/public/img/bonuses/defence.png';
import flat_armour from '@/public/img/bonuses/flat_armour.png';
import { INFINITE_HEALTH_MONSTERS } from '@/lib/constants';
import StatsColumn from '@/app/components/generic/StatsColumn';
import { RenderData } from '@/utils';
import { Monster } from '@/types/Monster';

type MonsterStatKey = keyof Pick<Monster, 'skills' | 'offensive' | 'defensive'>;

interface IStatRenderData {
  name: string;
  image: StaticImageData;
}

const StatRenderData: { [k in MonsterStatKey]: RenderData<keyof Monster[k], IStatRenderData> } = {
  skills: {
    hp: {
      name: 'Hitpoints',
      image: hitpoints,
    },
    atk: {
      name: 'Attack',
      image: attack,
    },
    str: {
      name: 'Strength',
      image: strength,
    },
    def: {
      name: 'Defence',
      image: defence,
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
  offensive: {
    atk: {
      name: 'Attack',
      image: attack,
    },
    str: {
      name: 'Strength',
      image: strength,
    },
    magic: {
      name: 'Magic',
      image: magic,
    },
    magic_str: {
      name: 'Magic Strength',
      image: magicStrength,
    },
    ranged: {
      name: 'Ranged',
      image: ranged,
    },
    ranged_str: {
      name: 'Ranged Strength',
      image: rangedStrength,
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
    light: {
      name: 'Light Ranged',
      image: ranged_light,
    },
    standard: {
      name: 'Standard Ranged',
      image: ranged_standard,
    },
    heavy: {
      name: 'Heavy Ranged',
      image: ranged_heavy,
    },
    flat_armour: {
      name: 'Flat Armour',
      image: flat_armour,
    },
  },
};

export interface MonsterStatInputProps<S extends MonsterStatKey> {
  attr: Extract<keyof Monster[S], keyof typeof StatRenderData[S]>;
}

const MonsterSkillInput: React.FC<MonsterStatInputProps<'skills'>> = observer(({ attr }) => {
  const {
    monster,
    isCustomMonster,
    updateMonsterBase,
  } = useMonster();
  const isInfinite = attr === 'hp' && INFINITE_HEALTH_MONSTERS.includes(monster.id);

  const value = monster.skills[attr];
  const renderData = StatRenderData.skills[attr];

  return (
    <AttributeInput
      name={renderData.name}
      max={50000}
      disabled={!isCustomMonster}
      image={renderData.image}
      value={value}
      displayValue={isInfinite ? 'Inf.' : undefined}
      onChange={(v) => updateMonsterBase({ skills: { [attr]: v } })}
      required
    />
  );
});

const MonsterOffensiveInput: React.FC<MonsterStatInputProps<'offensive'>> = observer(({ attr }) => {
  const {
    monster,
    isCustomMonster,
    updateMonsterBase,
  } = useMonster();

  const value = monster.offensive[attr];
  const renderData = StatRenderData.offensive[attr];

  return (
    <AttributeInput
      name={renderData.name}
      max={50000}
      disabled={!isCustomMonster}
      image={renderData.image}
      value={value}
      onChange={(v) => updateMonsterBase({ offensive: { [attr]: v } })}
      required
    />
  );
});

const MonsterDefensiveInput: React.FC<MonsterStatInputProps<'defensive'>> = observer(({ attr }) => {
  const {
    monster,
    isCustomMonster,
    updateMonsterBase,
  } = useMonster();

  const value = monster.defensive[attr];
  const renderData = StatRenderData.defensive[attr];

  return (
    <AttributeInput
      name={renderData.name}
      max={50000}
      disabled={!isCustomMonster}
      image={renderData.image}
      value={value}
      onChange={(v) => updateMonsterBase({ defensive: { [attr]: v } })}
      required
    />
  );
});

const MonsterStatInputs: React.FC = observer(() => (
  <>
    <StatsColumn name="Skills">
      <MonsterSkillInput attr="hp" />
      <MonsterSkillInput attr="atk" />
      <MonsterSkillInput attr="str" />
      <MonsterSkillInput attr="def" />
      <MonsterSkillInput attr="magic" />
      <MonsterSkillInput attr="ranged" />
      {/* we put this one here just to flatten out the height a bit */}
      <MonsterDefensiveInput attr="flat_armour" />
    </StatsColumn>
    <StatsColumn name="Offensive">
      <MonsterOffensiveInput attr="atk" />
      <MonsterOffensiveInput attr="str" />
      <MonsterOffensiveInput attr="magic" />
      <MonsterOffensiveInput attr="magic_str" />
      <MonsterOffensiveInput attr="ranged" />
      <MonsterOffensiveInput attr="ranged_str" />
    </StatsColumn>
    <StatsColumn name="Defensive">
      <MonsterDefensiveInput attr="stab" />
      <MonsterDefensiveInput attr="slash" />
      <MonsterDefensiveInput attr="crush" />
      <MonsterDefensiveInput attr="magic" />
      <MonsterDefensiveInput attr="light" />
      <MonsterDefensiveInput attr="standard" />
      <MonsterDefensiveInput attr="heavy" />
    </StatsColumn>
  </>
));

export default MonsterStatInputs;
