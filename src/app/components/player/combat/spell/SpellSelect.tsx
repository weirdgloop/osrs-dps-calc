import React from 'react';
import Combobox from '@/app/components/generic/Combobox';
import LazyImage from '@/app/components/generic/LazyImage';
import { usePlayer } from '@/state/PlayerStore';
import { Spell, Spellbook, Spellement } from '@/types/Spell';
import { getWikiImage } from '@/utils';
import spells from '../../../../../../cdn/json/spells.json';

interface SpellOption {
  label: string;
  value: string;
  spell: Spell;
}

const SPELL_OPTIONS: SpellOption[] = spells.map((e, i) => ({
  label: `${e.name}`,
  value: i.toString(),
  spell: {
    name: e.name,
    image: e.image,
    max_hit: e.max_hit,
    spellbook: e.spellbook as Spellbook,
    element: e.element as Spellement,
  },
}));

const SpellOptionLabel: React.FC<{ item: SpellOption, itemString: string }> = ({ item, itemString }) => (
  <div className="flex items-center gap-2">
    {item.spell.image && (
      <div className="basis-4 flex justify-center h-[20px] w-auto">
        <LazyImage responsive src={getWikiImage(item.spell.image)} alt="" />
      </div>
    )}
    <div className="flex items-center gap-0">
      <div>{itemString}</div>
    </div>
  </div>
);

const SpellSelect: React.FC = () => {
  const player = usePlayer();

  return (
    <Combobox<SpellOption>
      id="spell-select"
      className="w-full"
      items={SPELL_OPTIONS}
      placeholder="Select a spell..."
      resetAfterSelect
      blurAfterSelect
      onSelectedItemChange={(item) => {
        // clearing the selection is not offered, so an empty item never reaches here
        if (item) player.setSpell(item.spell);
      }}
      CustomItemComponent={SpellOptionLabel}
    />
  );
};

export default SpellSelect;
