import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconAlertTriangle } from '@tabler/icons-react';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import TtkChart from '@/app/components/results/ttk/TtkChart';
import { TTK_X_AXES } from '@/app/components/results/ttk/ttkXAxes';
import hourglass from '@/public/img/Hourglass.png';
import { INFINITE_HEALTH_MONSTERS } from '@/lib/constants';
import { useMonster } from '@/state/MonsterStore';
import { usePreferences } from '@/state/PreferencesStore';

const TtkComparison: React.FC = observer(() => {
  const monster = useMonster();
  const preferences = usePreferences();
  const [xAxis, setXAxis] = useState(TTK_X_AXES[0]);

  return (
    <SectionAccordion
      defaultIsOpen={preferences.showTtkComparison}
      onIsOpenChanged={(showTtkComparison) => preferences.update({ showTtkComparison })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={hourglass.src} /></div>
          <h3 className="font-serif font-bold">
            Time-to-Kill Graph
          </h3>
        </div>
      )}
    >
      {INFINITE_HEALTH_MONSTERS.includes(monster.id) ? (
        <div
          className="w-full bg-yellow-500 text-white px-4 py-1 text-sm border-b border-yellow-400 flex items-center gap-2"
        >
          <IconAlertTriangle className="text-orange-200" />
          <div>
            A time-to-kill distribution cannot be shown for this monster.
          </div>
        </div>
      ) : (
        <TtkChart xAxis={xAxis} setXAxis={setXAxis} />
      )}
    </SectionAccordion>
  );
});

export default TtkComparison;
