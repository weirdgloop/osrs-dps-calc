import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import ManualModeModal from '@/app/components/manual/ManualModeModal';
import { usePreferences } from '@/state/PreferencesStore';

const ManualModeToggle: React.FC = observer(() => {
  const preferences = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="underline"
        onClick={() => {
          if (preferences.manualMode) {
            preferences.update({ manualMode: false });
          } else {
            setIsOpen(true);
          }
        }}
      >
        {preferences.manualMode ? 'Disable' : 'Enable'}
        {' '}
        manual mode
      </button>
      <ManualModeModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
});

export default ManualModeToggle;
