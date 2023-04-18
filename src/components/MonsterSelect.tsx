import React, {useState} from 'react';
import {Combobox, Transition} from '@headlessui/react';
import monsters from '@/lib/monsters.json';
import {Monster} from '@/types/Monster';
import {useStore} from '../state/state';
import {observer} from 'mobx-react-lite';

const MonsterSelect: React.FC = observer(() => {
  const store = useStore();
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? monsters
      : monsters.filter((m) => {
        return m.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <Combobox value={store.monster} onChange={(m) => store.setMonster(m)}>
      <Combobox.Input
        placeholder={'Start typing a monster...'}
        onChange={(event) => setQuery(event.target.value)}
        className={'form-control w-80'}
        displayValue={(m: Monster) => m.name}
      />
      <Combobox.Button />
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Combobox.Options className={'mt-1 rounded bg-darker-900 border border-gray-600 absolute'}>
          {filtered.map((m) => (
            <Combobox.Option key={m.name} value={m} className={'px-2 py-0.5 hover:bg-darker-800 cursor-pointer ui-active:bg-blue-800'}>
              {m.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
})

export default MonsterSelect;