import React from 'react';
import spell from '@/lib/spells.json';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';
import {getWikiImage} from '@/utils';
import {Spell, Spellbook} from '@/types/Spell';
import Combobox from '@/app/components/generic/Combobox';
import LazyImage from "@/app/components/generic/LazyImage";

interface SpellOption {
  label: string;
  value: number;
  spell: Spell;
}

const SpellSelect: React.FC = observer(() => {
  const store = useStore();

  const options: SpellOption[] = spell.map((e, i) => {
    return {
      label: `${e.name}`,
      value: i,
      spell: {
        name: e.name,
        image: e.image,
        max_hit: e.max_hit,
        spellbook: e.spellbook as Spellbook
      }
    }
  })

  return (
    <Combobox
      id={'spell-select'}
      value={store.player.spell.name}
      className={'w-full'}
      items={options}
      placeholder={'Search for spell...'}
      blurAfterSelect={true}
      onSelectedItemChange={(item) => {
        if (item) {
          const val = item as SpellOption;
          store.updatePlayer({
            spell: val.spell
          })
        }
      }}
      CustomItemComponent={({item, itemString}) => {
        let i = item as SpellOption;

        return (
          <div className={'flex items-center gap-2'}>
            {i.spell.image && (
              <div className={'basis-4 flex justify-center h-[20px] w-auto'}>
                <LazyImage responsive={true} src={getWikiImage(i.spell.image)} alt={''} />
              </div>
            )}
            <div className={'flex items-center gap-0'}>
              <div>{itemString}</div>
            </div>
          </div>
        )
      }}
    />
  )
})

export default SpellSelect;