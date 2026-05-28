import { PlayerSkill } from '@/types/Player';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { observer } from 'mobx-react-lite';
import NumberInput from '@/app/components/generic/NumberInput';
import { RenderData } from '@/utils';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import prayer from '@/public/img/tabs/prayer.png';
import mining from '@/public/img/bonuses/mining.png';
import herblore from '@/public/img/bonuses/herblore.png';
import { usePlayer } from '../../../../state/LoadoutStore';

interface ISkillInputRenderData {
  name: string;
  image: StaticImageData;
}

const SkillInputRenderData: RenderData<PlayerSkill, ISkillInputRenderData> = {
  [PlayerSkill.ATTACK]: {
    name: 'Attack',
    image: attack,
  },
  [PlayerSkill.STRENGTH]: {
    name: 'Strength',
    image: strength,
  },
  [PlayerSkill.DEFENCE]: {
    name: 'Defence',
    image: defence,
  },
  [PlayerSkill.HITPOINTS]: {
    name: 'Hitpoints',
    image: hitpoints,
  },
  [PlayerSkill.RANGED]: {
    name: 'Ranged',
    image: ranged,
  },
  [PlayerSkill.MAGIC]: {
    name: 'Magic',
    image: magic,
  },
  [PlayerSkill.PRAYER]: {
    name: 'Prayer',
    image: prayer,
  },
  [PlayerSkill.MINING]: {
    name: 'Mining',
    image: mining,
  },
  [PlayerSkill.HERBLORE]: {
    name: 'Herblore',
    image: herblore,
  },
};

const BoostedSkill: React.FC<{ skill: PlayerSkill }> = observer(({ skill }) => {
  const { basePlayer, derivedPlayer, updateBasePlayer } = usePlayer();
  const { name } = SkillInputRenderData[skill];
  const isHp = skill === PlayerSkill.HITPOINTS;

  if (isHp) {
    return (
      <div className="flex items-center">
        <NumberInput
          className="form-control w-full text-right"
          required
          min={1}
          max={255}
          title={`Your current ${name} level`}
          value={basePlayer.currentHp}
          onChange={(v) => { updateBasePlayer({ currentHp: v }); }}
        />
        /
      </div>
    );
  }

  return (
    <span title={`Your current ${name} level`}>
      {derivedPlayer.boostedSkills[skill]}
      /
    </span>
  );
});

const BaseSkill: React.FC<{ skill: PlayerSkill }> = observer(({ skill }) => {
  const { basePlayer, updateBasePlayer } = usePlayer();
  const { name } = SkillInputRenderData[skill];

  return (
    <NumberInput
      className="form-control w-full"
      required
      min={1}
      max={255}
      title={`Your base ${name} level`}
      value={basePlayer.skills[skill]}
      onChange={(v) => { updateBasePlayer({ skills: { [skill]: v } }); }}
    />
  );
});

const SkillInput: React.FC<{ skill: PlayerSkill }> = observer(({ skill }) => {
  const { name, image } = SkillInputRenderData[skill];

  return (
    <>
      <div className="text-sm flex justify-center">
        <Image src={image} alt={name} />
      </div>
      <div className="flex items-center w-32">
        <div className="text-sm font-mono w-14 text-right">
          <BoostedSkill skill={skill} />
        </div>
        <div className="w-12">
          <BaseSkill skill={skill} />
        </div>
      </div>
    </>
  );
});

export default SkillInput;
