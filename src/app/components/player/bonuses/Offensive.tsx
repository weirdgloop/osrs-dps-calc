import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import AttributeInput from '@/app/components/generic/AttributeInput';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';

const Offensive: React.FC = observer(() => {
  const store = useStore();
  const { prefs, player, equipmentBonuses } = store;

  return (
    <div className="w-[95px]">
      <p className="text-sm text-gray-500 dark:text-gray-300">Offensive</p>
      <div className="flex flex-col gap-1 mt-3 text-center">
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Stab"
          image={dagger}
          value={player.offensive.stab}
          className={`${(player.offensive.stab !== equipmentBonuses.offensive.stab) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ offensive: { stab: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Slash"
          image={scimitar}
          value={player.offensive.slash}
          className={`${(player.offensive.slash !== equipmentBonuses.offensive.slash) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ offensive: { slash: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Crush"
          image={warhammer}
          value={player.offensive.crush}
          className={`${(player.offensive.crush !== equipmentBonuses.offensive.crush) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ offensive: { crush: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Magic"
          image={magic}
          value={player.offensive.magic}
          className={`${(player.offensive.magic !== equipmentBonuses.offensive.magic) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ offensive: { magic: v } })}
        />
        <AttributeInput
          disabled={!prefs.manualMode}
          name="Ranged"
          image={ranged}
          value={player.offensive.ranged}
          className={`${(player.offensive.ranged !== equipmentBonuses.offensive.ranged) ? 'bg-yellow-200 dark:bg-yellow-500' : ''}`}
          onChange={(v) => store.updatePlayer({ offensive: { ranged: v } })}
        />
      </div>
    </div>
  );
});

export default Offensive;
