import React from 'react';
import { observer } from 'mobx-react-lite';
import StyleBonuses from '@/app/components/player/bonuses/StyleBonuses';
import OtherBonuses from '@/app/components/player/bonuses/OtherBonuses';
import { usePlayer } from '@/state/PlayerStore';
import { usePreferences } from '@/state/PreferencesStore';

const Bonuses: React.FC = observer(() => {
  const player = usePlayer();
  const preferences = usePreferences();

  return (
    <div className="px-4 my-4">
      <div className="flex justify-between items-center gap-2">
        <h4 className="font-serif font-bold">Bonuses</h4>
        {preferences.manualMode && (
          <button type="button" className="text-xs underline" onClick={player.clearManualBonuses}>
            Calculate from equipment
          </button>
        )}
      </div>
      <div className="py-1">
        <div className="flex gap-4 justify-center">
          <StyleBonuses category="offensive" title="Offensive" />
          <StyleBonuses category="defensive" title="Defensive" />
          <OtherBonuses />
        </div>
      </div>
    </div>
  );
});

export default Bonuses;
