import React, {useState} from 'react';
import Image, {StaticImageData} from 'next/image';

import attack from '@/img/attack.png'
import strength from '@/img/strength.png';
import defence from '@/img/defence.png';
import ranged from '@/img/ranged.png';
import magic from '@/img/magic.png';
import hitpoints from '@/img/hitpoints.png';
import prayer from '@/img/prayer.png';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../state/state';
import {classNames} from '../../utils';
import {Skill} from '@/lib/enums/Skill';
import NumberInput from '@/components/generic/NumberInput';

interface SkillInputProps {
  name: Skill;
  image: string | StaticImageData;
}

const SkillInput: React.FC<SkillInputProps> = observer((props) => {
  const store = useStore();
  const {playerSkills} = store;
  const {name, image} = props;

  return (
    <div className={'flex items-center justify-between'}>
      <div className={'basis-60 text-gray-300 flex'}>
        <div className={'basis-8'}>
          <Image src={image} alt={name} />
        </div>
        <div>
          {name}
        </div>
      </div>
      <div>
        <NumberInput
          required
          min={1}
          max={99}
          value={playerSkills[name]}
          onChange={(v) => {
            store.setPlayerSkills({...playerSkills, [name]: v});
          }}
        />
      </div>
    </div>
  )
})

const UsernameLookup: React.FC = () => {
  const store = useStore();
  const {username} = store;

  return (
    <>
      <input
        type={'text'}
        className={'form-control rounded w-full mt-auto'}
        placeholder={'Username'}
        value={username}
        onChange={(e) => store.setUsername(e.currentTarget.value)}
      />
      <button type={'button'} className={classNames(
        'ml-1 text-white bg-gray-700 hover:bg-gray-600 hover:text-white',
        'px-3 py-1 rounded text-sm font-mono'
      )}>
        Lookup
      </button>
    </>
  )
}

const Skills = observer(() => {
  const store = useStore();

  return (
    <div className={'mt-4'}>
      <h4 className={`font-bold font-mono`}>
        Skills
      </h4>
      <p className={'text-sm'}>
        Input your username to fetch your stats, or enter them manually.
      </p>
      <div className={'flex items-center mt-3'}>
        <UsernameLookup />
      </div>
      <div className={'flex flex-col gap-1 mt-4'}>
        <SkillInput name={Skill.ATTACK} image={attack} />
        <SkillInput name={Skill.STRENGTH} image={strength} />
        <SkillInput name={Skill.DEFENCE} image={defence} />
        <SkillInput name={Skill.HITPOINTS} image={hitpoints} />
        <SkillInput name={Skill.RANGED} image={ranged} />
        <SkillInput name={Skill.MAGIC} image={magic} />
        <SkillInput name={Skill.PRAYER} image={prayer} />
      </div>
    </div>
  )
})

export default Skills;