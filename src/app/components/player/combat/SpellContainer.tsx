import React, { useMemo } from 'react';
import LazyImage from '@/app/components/generic/LazyImage';
import { getWikiImage } from '@/utils';
import { IconTrash } from '@tabler/icons-react';
import { useStore } from '@/state';
import { getSpellMaxHit } from '@/types/Spell';
import { toJS } from 'mobx';

const SpellContainer: React.FC = () => {
  const store = useStore();
  const { spell } = store.player;
  const jsPlayer = toJS(store.player);

  const spellMaxHit: number = useMemo(() => {
    if (!jsPlayer.spell) {
      return 0;
    }
    return getSpellMaxHit(jsPlayer.spell, jsPlayer.skills.magic);
  }, [jsPlayer.spell, jsPlayer.skills]);

  return (
    <div className="my-2 p-2 rounded bg-body-100 dark:bg-dark-500 text-sm flex justify-between items-center">
      <div className="flex gap-2 items-center">
        {spell?.image && (
          <div>
            <LazyImage responsive src={getWikiImage(spell.image)} alt="Spell" />
          </div>
        )}
        <div>
          <div className="font-semibold">
            {spell?.name || 'No spell selected'}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-300">
            {spell ? (
              <span>
                Max hit:
                {' '}
                {spellMaxHit}
              </span>
            ) : <span>If you are casting spells, select one below</span>}
          </div>
        </div>
      </div>
      {spell && (
        <div>
          <button
            type="button"
            className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors"
            data-tooltip-id="tooltip"
            data-tooltip-content="Remove spell"
            onClick={() => store.updatePlayer({ spell: null })}
          >
            <IconTrash aria-label="Remove spell" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SpellContainer;
