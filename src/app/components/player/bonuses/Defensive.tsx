import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import AttributeInput from '@/app/components/generic/AttributeInput';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';

const Defensive: React.FC = observer(() => {
  const store = useStore();
  const { prefs, player, equipmentBonuses } = store;

  return (
    <div className="w-[95px]">
      <p className="text-sm text-gray-500 dark:text-gray-300">Defensive</p>
      <div className="flex flex-col gap-1 mt-3 text-center">
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Stab"
          image={dagger}
          value={player.defensive.stab}
          className={`${(player.defensive.stab !== equipmentBonuses.defensive.stab) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ defensive: { stab: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Slash"
          image={scimitar}
          value={player.defensive.slash}
          className={`${(player.defensive.slash !== equipmentBonuses.defensive.slash) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ defensive: { slash: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Crush"
          image={warhammer}
          value={player.defensive.crush}
          className={`${(player.defensive.crush !== equipmentBonuses.defensive.crush) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ defensive: { crush: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Magic"
          image={magic}
          value={player.defensive.magic}
          className={`${(player.defensive.magic !== equipmentBonuses.defensive.magic) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ defensive: { magic: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Ranged"
          image={ranged}
          value={player.defensive.ranged}
          className={`${(player.defensive.ranged !== equipmentBonuses.defensive.ranged) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ defensive: { ranged: v } })}
        />
      </div>
    </div>
  );
});

export default Defensive;
