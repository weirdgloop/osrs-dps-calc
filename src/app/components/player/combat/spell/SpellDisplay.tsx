import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconTrash } from '@tabler/icons-react';
import { usePlayer } from '../../../../../state/LoadoutStore';
import { getSpellMaxHit } from '../../../../../types/Spell';
import LazyImage from '../../../generic/LazyImage';
import { getWikiImage } from '../../../../../utils';

const SpellDisplay: React.FC = observer(() => {
  const {
    basePlayer,
    updateBasePlayer,
  } = usePlayer();
  const spell = basePlayer.spell;
  const spellMaxHit = (spell ? getSpellMaxHit(spell, basePlayer.skills.magic) : null) ?? 0;

  return (
    <div className="my-2 p-2 rounded bg-dark-500 text-sm flex justify-between items-center">
      <div className="flex gap-2 items-center">
        {spell?.image && (
          <div>
            <LazyImage responsive src={getWikiImage(spell.image)} alt={spell.name} />
          </div>
        )}
        <div>
          <div className="font-semibold">
            {spell?.name || 'No spell selected'}
          </div>
          <div className="text-xs text-gray-300">
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
            className="text-dark-100 disabled:text-dark-500 hover:text-red transition-colors"
            data-tooltip-id="tooltip"
            data-tooltip-content="Remove spell"
            onClick={() => updateBasePlayer({ spell: null })}
          >
            <IconTrash aria-label="Remove spell" />
          </button>
        </div>
      )}
    </div>
  );
});

export default SpellDisplay;
