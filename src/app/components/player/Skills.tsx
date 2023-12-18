import React, {useState} from 'react';

import attack from '@/public/img/bonuses/attack.png'
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import prayer from '@/public/img/tabs/prayer.png';
import {observer} from 'mobx-react-lite';
import UsernameLookup from "@/app/components/player/skills/UsernameLookup";
import SkillInput from "@/app/components/player/skills/SkillInput";
import BonusesCalculatorModal from "@/app/components/player/skills/BonusesCalculatorModal";

const Skills: React.FC = observer(() => {
  const [showBonusesCalculator, setShowBonusesCalculator] = useState(false);

  return (
    <div className={'px-6 mt-4'}>
      <h4 className={`font-bold font-serif`}>
        Skills
      </h4>
      <p className={'text-xs'}>
        Input your username to fetch your stats, or enter them manually.
      </p>
      <div className={'flex items-center mt-3'}>
        <UsernameLookup/>
      </div>
      <div className={'mt-4'}>
        <p className={'text-xs text-right mb-1 p-0 text-gray-400 dark:text-gray-300'}>
          &#8630; Bonuses
        </p>
        <div className={'flex flex-col gap-1'}>
          <SkillInput name={'Attack'} field={'atk'} image={attack}/>
          <SkillInput name={'Strength'} field={'str'} image={strength}/>
          <SkillInput name={'Defence'} field={'def'} image={defence}/>
          <SkillInput name={'Hitpoints'} field={'hp'} image={hitpoints}/>
          <SkillInput name={'Ranged'} field={'ranged'} image={ranged}/>
          <SkillInput name={'Magic'} field={'magic'} image={magic}/>
          <SkillInput name={'Prayer'} field={'prayer'} image={prayer}/>
        </div>
      </div>
      <div className={'mt-4 text-xs text-right'}>
        <button
          className={'btn'}
          onClick={() => setShowBonusesCalculator(true)}
        >
          Calculate bonuses
        </button>
      </div>
      <BonusesCalculatorModal isOpen={showBonusesCalculator} setIsOpen={setShowBonusesCalculator} />
    </div>
  )
})

export default Skills;
