import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import defence from '@/public/img/bonuses/defence.png';
import LazyImage from '@/app/components/generic/LazyImage';
import { IconAlertTriangle } from '@tabler/icons-react';

const NPCVersusPlayerResults: React.FC = observer(() => {
  const store = useStore();
  const { showNPCVersusPlayerResults } = store.prefs;

  return (
    <SectionAccordion
      defaultIsOpen={showNPCVersusPlayerResults}
      onIsOpenChanged={(o) => store.updatePreferences({ showNPCVersusPlayerResults: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={defence.src} /></div>
          <h3 className="font-serif font-bold">
            NPC versus Player
          </h3>
        </div>
      )}
    >
      <div
        className="w-full bg-orange-500 text-white px-4 py-1 text-sm border-b border-orange-400 flex items-center gap-2"
      >
        <IconAlertTriangle className="text-orange-200" />
        This monster has non-standard behaviour. This section could be inaccurate.
      </div>
      <div className="px-6 py-4 text-white">
        Lorem ipsum
      </div>
    </SectionAccordion>
  );
});

export default NPCVersusPlayerResults;
