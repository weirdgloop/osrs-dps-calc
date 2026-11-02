import React from 'react';
import { observer } from 'mobx-react-lite';
import type { StaticImageData } from 'next/image';
import AttributeInput from '@/app/components/generic/AttributeInput';
import { usePreferences } from '@/state/PreferencesStore';

interface BonusInputProps {
  name: string;
  image: StaticImageData;
  value: number;
  isOverridden: boolean;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
}

const BonusInput: React.FC<BonusInputProps> = observer(({ isOverridden, ...props }) => {
  const preferences = usePreferences();

  return (
    <AttributeInput
      {...props}
      disabled={!preferences.manualMode}
      className={isOverridden ? 'bg-yellow-200 dark:bg-yellow-500' : ''}
    />
  );
});

export default BonusInput;
