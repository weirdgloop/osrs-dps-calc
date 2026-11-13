import React from 'react';
import { observer } from 'mobx-react-lite';
import strength from '@/public/img/bonuses/strength.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import prayer from '@/public/img/tabs/prayer.png';
import attackSpeed from '@/public/img/bonuses/attack_speed.png';
import BonusColumn from '@/app/components/player/bonuses/BonusColumn';
import BonusInput from '@/app/components/player/bonuses/BonusInput';
import { usePlayer } from '@/state/PlayerStore';

const OtherBonuses: React.FC = observer(() => {
  const player = usePlayer();
  const { bonuses, gearBonuses } = player;

  return (
    <BonusColumn title="Other">
      <BonusInput
        name="Strength"
        image={strength}
        value={bonuses.str}
        isOverridden={bonuses.str !== gearBonuses.bonuses.str}
        onChange={(str) => player.setManualBonuses({ bonuses: { str } })}
      />
      <BonusInput
        name="Ranged Strength"
        image={rangedStrength}
        value={bonuses.ranged_str}
        isOverridden={bonuses.ranged_str !== gearBonuses.bonuses.ranged_str}
        onChange={(rangedStr) => player.setManualBonuses({ bonuses: { ranged_str: rangedStr } })}
      />
      <BonusInput
        name="Magic Strength"
        image={magicStrength}
        step={0.1}
        value={parseFloat((bonuses.magic_str / 10).toFixed(1))}
        isOverridden={bonuses.magic_str !== gearBonuses.bonuses.magic_str}
        onChange={(magicStr) => player.setManualBonuses({ bonuses: { magic_str: Math.trunc(magicStr * 10) } })}
      />
      <BonusInput
        name="Prayer"
        image={prayer}
        value={bonuses.prayer}
        isOverridden={bonuses.prayer !== gearBonuses.bonuses.prayer}
        onChange={(prayerBonus) => player.setManualBonuses({ bonuses: { prayer: prayerBonus } })}
      />
      <BonusInput
        name="Attack Speed"
        image={attackSpeed}
        min={1}
        value={player.attackSpeed}
        isOverridden={player.attackSpeed !== gearBonuses.attackSpeed}
        onChange={(speed) => player.setManualBonuses({ attackSpeed: speed })}
      />
    </BonusColumn>
  );
});

export default OtherBonuses;
