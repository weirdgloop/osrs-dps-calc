import React from 'react';
import { observer } from 'mobx-react-lite';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import flat_armour from '@/public/img/bonuses/flat_armour.png';
import MonsterStatColumn from '@/app/components/monster/stats/MonsterStatColumn';
import MonsterStatInput from '@/app/components/monster/stats/MonsterStatInput';
import { INFINITE_HEALTH_MONSTERS } from '@/lib/constants';
import { useMonster } from '@/state/MonsterStore';

const MonsterSkillInputs: React.FC = observer(() => {
  const monster = useMonster();
  const { id, skills, defensive } = monster.scaled;

  return (
    <MonsterStatColumn title="Skills">
      <MonsterStatInput
        name="Hitpoints"
        max={50000}
        image={hitpoints}
        value={skills.hp}
        displayValue={INFINITE_HEALTH_MONSTERS.includes(id) ? 'Inf.' : undefined}
        onChange={(hp) => monster.updateDefinition({ skills: { hp } })}
      />
      <MonsterStatInput
        name="Attack"
        max={10000}
        image={attack}
        value={skills.atk}
        onChange={(atk) => monster.updateDefinition({ skills: { atk } })}
      />
      <MonsterStatInput
        name="Strength"
        max={10000}
        image={strength}
        value={skills.str}
        onChange={(str) => monster.updateDefinition({ skills: { str } })}
      />
      <MonsterStatInput
        name="Defence"
        max={40000}
        image={defence}
        value={skills.def}
        onChange={(def) => monster.updateDefinition({ skills: { def } })}
      />
      <MonsterStatInput
        name="Magic"
        max={10000}
        image={magic}
        value={skills.magic}
        onChange={(magicLevel) => monster.updateDefinition({ skills: { magic: magicLevel } })}
      />
      <MonsterStatInput
        name="Ranged"
        max={10000}
        image={ranged}
        value={skills.ranged}
        onChange={(rangedLevel) => monster.updateDefinition({ skills: { ranged: rangedLevel } })}
      />
      <MonsterStatInput
        name="Flat Armour"
        max={1000}
        image={flat_armour}
        value={defensive.flat_armour}
        onChange={(flatArmour) => monster.updateDefinition({ defensive: { flat_armour: flatArmour } })}
      />
    </MonsterStatColumn>
  );
});

export default MonsterSkillInputs;
