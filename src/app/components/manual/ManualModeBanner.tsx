import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconAlertTriangle } from '@tabler/icons-react';
import { usePreferences } from '@/state/PreferencesStore';

const ManualModeBanner: React.FC = observer(() => {
  const preferences = usePreferences();

  if (!preferences.manualMode) {
    return null;
  }

  return (
    <button
      type="button"
      className="w-full bg-orange-500 text-white px-4 py-1 text-sm border-b border-orange-400 flex items-center gap-1"
      onClick={() => preferences.update({ manualMode: false })}
    >
      <IconAlertTriangle className="text-orange-200" />
      Manual mode is enabled! Some things may not function correctly. Click here to disable it.
    </button>
  );
});

export default ManualModeBanner;
