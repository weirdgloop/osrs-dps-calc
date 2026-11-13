import React, { useState } from 'react';
import MonsterAccordion from '@/app/components/monster/MonsterAccordion';
import CustomMonsterSettings from '@/app/components/monster/settings/CustomMonsterSettings';
import ToaSettings from '@/app/components/monster/settings/ToaSettings';
import CoxChallengeModeSetting from '@/app/components/monster/settings/CoxChallengeModeSetting';
import PartySizeSetting from '@/app/components/monster/settings/PartySizeSetting';
import CoxPartyLevelSettings from '@/app/components/monster/settings/CoxPartyLevelSettings';
import MiningLevelSetting from '@/app/components/monster/settings/MiningLevelSetting';
import PhaseSetting from '@/app/components/monster/settings/PhaseSetting';
import DemonbaneSetting from '@/app/components/monster/settings/DemonbaneSetting';
import CurrentHpSetting from '@/app/components/monster/settings/CurrentHpSetting';

const MonsterSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <MonsterAccordion
      title="Monster Settings"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-wrap gap-4 text-sm py-2 px-2 bg-dark-500 rounded">
        {/* don't add visibility controls here, have each component decide its own visibility and return null if needed */}
        <CustomMonsterSettings />
        <ToaSettings />
        <CoxChallengeModeSetting />
        <PartySizeSetting />
        <CoxPartyLevelSettings />
        <MiningLevelSetting />
        <PhaseSetting />
        <DemonbaneSetting />
        <CurrentHpSetting />
      </div>
    </MonsterAccordion>
  );
};

export default MonsterSettings;
