import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';
import slayer from '@/public/img/misc/slayer.webp';
import skull from '@/public/img/misc/skull.webp';
import diary from '@/public/img/misc/diary.png';
import forinthry_surge from '@/public/img/misc/forinthry_surge.webp';
import soulreaper_axe from '@/public/img/misc/soulreaper_axe.png';
import NumberInput from '@/app/components/generic/NumberInput';
import arceuus from '@/public/img/misc/arceuus.png';
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
                data-tooltip-content="Black mask and slayer helmet give bonuses while you are on a Slayer task."
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
        <Toggle
          checked={player.buffs.thrallSpell}
          setChecked={(c) => store.updatePlayer({ buffs: { thrallSpell: c } })}
          label={(
            <>
              <img src={arceuus.src} width={18} className="inline-block" alt="Thralls" />
              {' '}
              Using thralls
              {' '}
              <span
                className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
                data-tooltip-id="tooltip"
                data-tooltip-content="Include thrall damage in calculations."
              >
                ?
              </span>
            </>
          )}
        />
        <div className="w-full">
          <NumberInput
            className="form-control w-12"
            required
            min={0}
            max={5}
            value={player.buffs.soulreaperStacks}
            onChange={(v) => store.updatePlayer({ buffs: { soulreaperStacks: v } })}
          />
          <span className="ml-1 text-sm select-none">
            <img src={soulreaper_axe.src} width={18} className="inline-block" alt="" />
            {' '}
            Soul stacks
            {' '}
            <span
              className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
              data-tooltip-id="tooltip"
              data-tooltip-content="When using the soulreaper axe, every hit gives a soul stack."
            >
              ?
            </span>
          </span>
        </div>
      </div>
    </div>

  );
});

export default ExtraOptions;
