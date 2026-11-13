import React from 'react';
import { observer } from 'mobx-react-lite';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged_light from '@/public/img/bonuses/ranged_light.webp';
import ranged_standard from '@/public/img/bonuses/ranged_standard.webp';
import ranged_heavy from '@/public/img/bonuses/ranged_heavy.webp';
import MonsterStatColumn from '@/app/components/monster/stats/MonsterStatColumn';
import MonsterStatInput from '@/app/components/monster/stats/MonsterStatInput';
import { useMonster } from '@/state/MonsterStore';

const MonsterDefensiveInputs: React.FC = observer(() => {
  const monster = useMonster();
  const { defensive } = monster.scaled;

  return (
    <MonsterStatColumn title="Defensive">
      <MonsterStatInput
        name="Stab"
        max={10000}
        image={dagger}
        value={defensive.stab}
        onChange={(stab) => monster.updateDefinition({ defensive: { stab } })}
      />
      <MonsterStatInput
        name="Slash"
        max={10000}
        image={scimitar}
        value={defensive.slash}
        onChange={(slash) => monster.updateDefinition({ defensive: { slash } })}
      />
      <MonsterStatInput
        name="Crush"
        max={10000}
        image={warhammer}
        value={defensive.crush}
        onChange={(crush) => monster.updateDefinition({ defensive: { crush } })}
      />
      <MonsterStatInput
        name="Magic"
        max={10000}
        image={magic}
        value={defensive.magic}
        onChange={(magicDefence) => monster.updateDefinition({ defensive: { magic: magicDefence } })}
      />
      <MonsterStatInput
        name="Ranged Light"
        max={10000}
        image={ranged_light}
        value={defensive.light}
        onChange={(light) => monster.updateDefinition({ defensive: { light } })}
      />
      <MonsterStatInput
        name="Ranged Standard"
        max={10000}
        image={ranged_standard}
        value={defensive.standard}
        onChange={(standard) => monster.updateDefinition({ defensive: { standard } })}
      />
      <MonsterStatInput
        name="Ranged Heavy"
        max={10000}
        image={ranged_heavy}
        value={defensive.heavy}
        onChange={(heavy) => monster.updateDefinition({ defensive: { heavy } })}
      />
    </MonsterStatColumn>
  );
});

export default MonsterDefensiveInputs;
