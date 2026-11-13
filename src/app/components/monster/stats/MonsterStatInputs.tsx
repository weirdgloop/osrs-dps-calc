import React from 'react';
import MonsterSkillInputs from '@/app/components/monster/stats/MonsterSkillInputs';
import MonsterOffensiveInputs from '@/app/components/monster/stats/MonsterOffensiveInputs';
import MonsterDefensiveInputs from '@/app/components/monster/stats/MonsterDefensiveInputs';

const MonsterStatInputs: React.FC = () => (
  <div className="flex gap-4">
    <MonsterSkillInputs />
    <MonsterOffensiveInputs />
    <MonsterDefensiveInputs />
  </div>
);

export default MonsterStatInputs;
