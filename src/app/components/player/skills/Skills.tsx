import React from 'react';

import { observer } from 'mobx-react-lite';
import UsernameLookup from '@/app/components/player/skills/UsernameLookup';
import { PlayerSkill } from '@/types/Player';
import SkillInput from './SkillInput';
import BoostsSection from './BoostsSection';

const Skills: React.FC = observer(() => (
  <div className="px-4 mt-4 flex flex-col mb-6 grow">
    <div className="flex items-center">
      <UsernameLookup />
    </div>
    <div className="mt-4">
      <div className="grid items-center gap-x-2" style={{ gridTemplateColumns: '2fr 2fr 2fr 2fr' }}>
        <SkillInput skill={PlayerSkill.ATTACK} />
        <SkillInput skill={PlayerSkill.STRENGTH} />
        <SkillInput skill={PlayerSkill.DEFENCE} />
        <SkillInput skill={PlayerSkill.HITPOINTS} />
        <SkillInput skill={PlayerSkill.RANGED} />
        <SkillInput skill={PlayerSkill.MAGIC} />
        <SkillInput skill={PlayerSkill.PRAYER} />
        <SkillInput skill={PlayerSkill.MINING} />
        <SkillInput skill={PlayerSkill.HERBLORE} />
      </div>
    </div>
    <BoostsSection />
  </div>
));

export default Skills;
