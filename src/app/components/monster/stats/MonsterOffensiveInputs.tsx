import React from 'react';
import { observer } from 'mobx-react-lite';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import magic_resistance from '@/public/img/bonuses/magic_resistance.png';
import MonsterStatColumn from '@/app/components/monster/stats/MonsterStatColumn';
import MonsterStatInput from '@/app/components/monster/stats/MonsterStatInput';
import { useMonster } from '@/state/MonsterStore';

const MonsterOffensiveInputs: React.FC = observer(() => {
  const monster = useMonster();
  const { offensive, defensive } = monster.scaled;

  return (
    <MonsterStatColumn title="Offensive">
      <MonsterStatInput
        name="Attack"
        max={10000}
        image={attack}
        value={offensive.atk}
        onChange={(atk) => monster.updateDefinition({ offensive: { atk } })}
      />
      <MonsterStatInput
        name="Strength"
        max={10000}
        image={strength}
        value={offensive.str}
        onChange={(str) => monster.updateDefinition({ offensive: { str } })}
      />
      <MonsterStatInput
        name="Magic"
        max={10000}
        image={magic}
        value={offensive.magic}
        onChange={(magicBonus) => monster.updateDefinition({ offensive: { magic: magicBonus } })}
      />
      <MonsterStatInput
        name="Magic Strength"
        max={10000}
        image={magicStrength}
        value={offensive.magic_str}
        onChange={(magicStr) => monster.updateDefinition({ offensive: { magic_str: magicStr } })}
      />
      <MonsterStatInput
        name="Ranged"
        max={10000}
        image={ranged}
        value={offensive.ranged}
        onChange={(rangedBonus) => monster.updateDefinition({ offensive: { ranged: rangedBonus } })}
      />
      <MonsterStatInput
        name="Ranged Strength"
        max={10000}
        image={rangedStrength}
        value={offensive.ranged_str}
        onChange={(rangedStr) => monster.updateDefinition({ offensive: { ranged_str: rangedStr } })}
      />
      <MonsterStatInput
        name="Magic Resistance"
        max={1000}
        image={magic_resistance}
        value={defensive.magic_resistance ?? 0}
        onChange={(magicResistance) => monster.updateDefinition({ defensive: { magic_resistance: magicResistance } })}
      />
    </MonsterStatColumn>
  );
});

export default MonsterOffensiveInputs;
