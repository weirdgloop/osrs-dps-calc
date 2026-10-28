import React from 'react';
import { observer } from 'mobx-react-lite';
import type { StaticImageData } from 'next/image';
import AttributeInput from '@/app/components/generic/AttributeInput';
import { useMonster } from '@/state/MonsterStore';
import { usePreferences } from '@/state/PreferencesStore';

interface MonsterStatInputProps {
  name: string;
  max: number;
  image: StaticImageData;
  value: number;
  displayValue?: string;
  onChange: (value: number) => void;
}

const MonsterStatInput: React.FC<MonsterStatInputProps> = observer((props) => {
  const monster = useMonster();
  const preferences = usePreferences();

  return (
    <AttributeInput
      {...props}
      disabled={!(monster.isCustom || preferences.manualMode)}
      required
    />
  );
});

export default MonsterStatInput;
