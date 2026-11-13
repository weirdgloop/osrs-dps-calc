import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconAlertTriangle } from '@tabler/icons-react';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import NPCVersusPlayerResultsTable from '@/app/components/results/NPCVersusPlayerResultsTable';
import NPCVersusPlayerWarning from '@/app/components/results/npcVsPlayer/NPCVersusPlayerWarning';
import NPCInfo from '@/app/components/results/npcVsPlayer/NPCInfo';
import defence from '@/public/img/bonuses/defence.png';
import { useMonster } from '@/state/MonsterStore';
import { usePreferences } from '@/state/PreferencesStore';

const NPCVersusPlayerResultsContainer: React.FC = observer(() => {
  const monster = useMonster();
  const preferences = usePreferences();

  return (
    <SectionAccordion
      defaultIsOpen={preferences.showNPCVersusPlayerResults}
      onIsOpenChanged={(showNPCVersusPlayerResults) => preferences.update({ showNPCVersusPlayerResults })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={defence.src} /></div>
          <h3 className="font-serif font-bold">
            Damage taken from
            {' '}
            {monster.definition.name}
          </h3>
        </div>
      )}
    >
      {monster.isNonStandard ? (
        <div
          className="w-full bg-red-500 text-white px-4 py-1 text-sm border-b border-red-400 flex items-center gap-2"
        >
          <IconAlertTriangle className="text-red-200" />
          This monster has non-standard attacks, so we&apos;re currently unable to calculate these metrics.
        </div>
      ) : (
        <>
          <NPCVersusPlayerWarning />
          <div>
            <div className="overflow-x-auto max-w-[100vw]">
              <NPCVersusPlayerResultsTable />
            </div>
            <NPCInfo />
          </div>
        </>
      )}
    </SectionAccordion>
  );
});

export default NPCVersusPlayerResultsContainer;
