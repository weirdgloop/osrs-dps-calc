import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import Offensive from '@/app/components/player/bonuses/Offensive';
import Defensive from '@/app/components/player/bonuses/Defensive';
import OtherBonuses from '@/app/components/player/bonuses/OtherBonuses';
import { toJS } from 'mobx';
import { calculateEquipmentBonusesFromGear } from '@/lib/Equipment';

const Bonuses: React.FC = observer(() => {
  const store = useStore();
  const { manualMode } = store.prefs;

  const player = toJS(store.player);
  const monster = toJS(store.monster);
  const computedStats = useMemo(() => calculateEquipmentBonusesFromGear(player, monster), [monster, player]);

  return (
    <div className="px-4 my-4">
      <div className="flex justify-between items-center gap-2">
        <h4 className="font-serif font-bold">Bonuses</h4>
        {manualMode && (
          <button type="button" className="text-xs underline" onClick={() => store.recalculateEquipmentBonusesFromGear()}>
            Calculate from equipment
          </button>
        )}
      </div>
      <div className="py-1">
        <div className="flex gap-4 justify-center">
          <Offensive computedStats={computedStats} />
          <Defensive computedStats={computedStats} />
          <OtherBonuses computedStats={computedStats} />
        </div>
      </div>
    </div>
  );
});

export default Bonuses;
