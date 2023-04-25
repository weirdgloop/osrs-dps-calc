import React from 'react';
import spell from '@/lib/spells.json';
import {useStore} from '../state';
import {observer} from 'mobx-react-lite';
import WindowedSelect, {FormatOptionLabelMeta} from 'react-windowed-select';
import {getWikiImage} from '@/lib/utilities';
import {Spell, Spellbook} from '@/types/Spell';

interface SpellOption {
  label: string;
  value: number;
  spell: Spell;
}

const SpellOptionLabel = (data: SpellOption, meta: FormatOptionLabelMeta<unknown>) => {
  return (
    <div className={'flex items-center gap-2'}>
      <div className={'basis-4 flex justify-center'}>
        <img className={'max-h-[20px]'} src={getWikiImage(data.spell.image)} alt={''} />
      </div>
      <div>
        {data.label}
      </div>
    </div>
  )
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
    <WindowedSelect
      options={options}
      windowThreshold={50}
      placeholder={'Select spell...'}
      classNames={{
        control: () => 'text-sm',
        menu: () => 'spell-select-menu',
        option: (state) => `select-option ${state.isSelected ? 'selected' : ''} text-xs`,
        input: () => 'select-input'
      }}
      formatOptionLabel={(data, meta) => SpellOptionLabel(data as SpellOption, meta)}
      onChange={(v) => {
        const val = v as SpellOption;
        store.updatePlayer({
          spell: val.spell
        });
      }}
    />
  )
})

export default SpellSelect;