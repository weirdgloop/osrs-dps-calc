import React from 'react';
import { observer } from 'mobx-react-lite';
import hitsplat from '@/public/img/hitsplat.webp';
import LazyImage from '@/app/components/generic/LazyImage';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import Toggle from '@/app/components/generic/Toggle';
import HitDistributionChart from '@/app/components/results/hitDistribution/HitDistributionChart';
import { useCalc } from '@/state/CalcStore';
import { usePlayer } from '@/state/PlayerStore';
import { usePreferences } from '@/state/PreferencesStore';

const HitDistribution: React.FC = observer(() => {
  const calc = useCalc();
  const player = usePlayer();
  const preferences = usePreferences();

  const basic = calc.results.get(player.uuid)?.basic;
  const result = basic?.status === 'success' ? basic.value : undefined;
  const specAvailable = result?.specHitDist !== undefined;
  const data = ((preferences.hitDistShowSpec && specAvailable) ? result?.specHitDist : result?.hitDist) || [];

  return (
    <SectionAccordion
      defaultIsOpen={preferences.showHitDistribution}
      onIsOpenChanged={(showHitDistribution) => preferences.update({ showHitDistribution })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={hitsplat.src} /></div>
          <h3 className="font-serif font-bold">
            Hit Distribution
            {' '}
            <span className="text-gray-300 text-sm">
              (
              {player.name}
              )
            </span>
          </h3>
        </div>
      )}
    >
      <div className="px-6 py-4">
        <div
          className="flex items-center gap-4"
        >
          <Toggle
            checked={preferences.hitDistsHideZeros}
            setChecked={(hitDistsHideZeros) => preferences.update({ hitDistsHideZeros })}
            label="Hide misses"
            className="text-black dark:text-white mb-4"
          />
          <Toggle
            disabled={!specAvailable}
            checked={preferences.hitDistShowSpec}
            setChecked={(hitDistShowSpec) => preferences.update({ hitDistShowSpec })}
            label="Show special attack"
            className="text-black dark:text-white mb-4"
          />
        </div>
        <HitDistributionChart data={data} />
      </div>
    </SectionAccordion>
  );
});

export default HitDistribution;
