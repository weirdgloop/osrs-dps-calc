import React from 'react';
import UsernameLookup from '@/app/components/player/skills/UsernameLookup';
import SkillInputs from '@/app/components/player/skills/SkillInputs';
import PotionList from '@/app/components/player/skills/PotionList';

const Skills: React.FC = () => (
  <div className="px-4 mt-4 flex flex-col mb-6 grow">
    <div className="flex items-center">
      <UsernameLookup />
    </div>
    <div className="mt-4">
      <SkillInputs />
    </div>
    <h4 className="mt-4 font-bold font-serif">
      Boosts
    </h4>
    <div
      className="grow h-48 mt-2 bg-white dark:bg-dark-500 dark:border-dark-200 rounded border border-gray-300 overflow-y-scroll"
    >
      <PotionList />
    </div>
  </div>
);

export default Skills;
