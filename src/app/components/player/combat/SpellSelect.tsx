import React from 'react';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';
import { getWikiImage } from '@/utils';
import { Spell, Spellbook, Spellement } from '@/types/Spell';
import Combobox from '@/app/components/generic/Combobox';
import LazyImage from '@/app/components/generic/LazyImage';
import spell from '../../../../../cdn/json/spells.json';

interface SpellOption {
  label: string;
  value: string;
  spell: Spell;
}

const SpellSelect: React.FC = observer(() => {
  const store = useStore();

  const options: SpellOption[] = spell.map((e, i) => ({
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

  return (
    <Combobox<SpellOption>
      id="spell-select"
      className="w-full"
      items={options}
      placeholder="Select a spell..."
      resetAfterSelect
      blurAfterSelect
      onSelectedItemChange={(item) => {
        store.updatePlayer({
          spell: item?.spell,
        });
      }}
      CustomItemComponent={({ item, itemString }) => (
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
      )}
    />
  );
});

export default SpellSelect;
