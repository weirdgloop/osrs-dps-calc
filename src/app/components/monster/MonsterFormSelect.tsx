import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMonster } from '@/state/MonsterStore';
import { findFormIndex, monsterGroupFor } from '@/lib/MonsterForms';

const MonsterFormSelect: React.FC = observer(() => {
  const monster = useMonster();
  const group = monsterGroupFor(monster.definition.name);

  if (monster.isCustom || !group || group.forms.length < 2) return null;

  return (
    <select
      className="form-control w-full mt-2"
      aria-label="Monster form"
      value={findFormIndex(group, monster.definition)}
      onChange={(e) => monster.selectForm(group.forms[Number(e.target.value)].monster)}
    >
      {group.forms.map((form, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <option key={i} value={i}>{form.title}</option>
      ))}
    </select>
  );
});

export default MonsterFormSelect;
