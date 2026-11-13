import React from 'react';
import { observer } from 'mobx-react-lite';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import ComparisonChart from '@/app/components/results/comparison/ComparisonChart';
import ComparisonAxisSelects from '@/app/components/results/comparison/ComparisonAxisSelects';
import equipmentStats from '@/public/img/Equipment Stats.png';
import { useCalc } from '@/state/CalcStore';
import { usePreferences } from '@/state/PreferencesStore';

const LoadoutComparison: React.FC = observer(() => {
  const calc = useCalc();
  const preferences = usePreferences();
  const { compareResult } = calc;

  return (
    <SectionAccordion
      defaultIsOpen={preferences.showLoadoutComparison}
      onIsOpenChanged={(showLoadoutComparison) => preferences.update({ showLoadoutComparison })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={equipmentStats.src} /></div>
          <h3 className="font-serif font-bold">
            Loadout Comparison Graph
          </h3>
        </div>
      )}
    >
      {compareResult && (
        <div className="px-6 py-4">
          <ComparisonChart result={compareResult} />
          <ComparisonAxisSelects />
        </div>
      )}
    </SectionAccordion>
  );
});

export default LoadoutComparison;
