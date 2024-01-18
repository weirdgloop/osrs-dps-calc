import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';
import forinthry_surge from '@/public/img/misc/forinthry_surge.webp';
import Toggle from '../generic/Toggle';

const ExtraOptions: React.FC = observer(() => {
  const store = useStore();
  const { player } = store;

  return (
    <div className="px-6 my-4">
      <div className="mt-2 mb-4">
        <Toggle
          checked={player.buffs.onSlayerTask}
          setChecked={(c) => store.updatePlayer({ buffs: { onSlayerTask: c } })}
          label={(
            <>
              <img src={slayer.src} width={18} className="inline-block" alt="" />
              {' '}
              On Slayer task
              {' '}
              <span
                className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                data-tooltip-id="tooltip"
                data-tooltip-content="Some weapons give bonuses while you are on a Slayer task."
              >
                ?
              </span>
            </>
          )}
        />
        <Toggle
          checked={player.buffs.inWilderness}
          setChecked={(c) => store.updatePlayer({ buffs: { inWilderness: c } })}
          label={(
            <>
              <img src={skull.src} width={18} className="inline-block" alt="" />
              {' '}
              In the Wilderness
              {' '}
              <span
                className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                data-tooltip-id="tooltip"
                data-tooltip-content="Some weapons give bonuses while you are in the Wilderness."
              >
                ?
              </span>
            </>
          )}
        />
        <Toggle
          checked={player.buffs.forinthrySurge}
          setChecked={(c) => store.updatePlayer({ buffs: { forinthrySurge: c } })}
          label={(
            <>
              <img src={forinthry_surge.src} width={18} className="inline-block" alt="" />
              {' '}
              Forinthry Surge
              {' '}
              <span
                className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                data-tooltip-id="tooltip"
                data-tooltip-content="Provides a bonus against revenants."
              >
                ?
              </span>
            </>
          )}
        />
        <Toggle
          checked={player.buffs.kandarinDiary}
          setChecked={(c) => store.updatePlayer({ buffs: { kandarinDiary: c } })}
          label={(
            <>
              <img src={diary.src} width={18} className="inline-block" alt="" />
              {' '}
              Kandarin Hard Diary
              {' '}
              <span
                className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                data-tooltip-id="tooltip"
                data-tooltip-content="10% activation chance increase to enchanted bolts."
              >
                ?
              </span>
            </>
          )}
        />
      </div>
    </div>

  );
});

export default ExtraOptions;
