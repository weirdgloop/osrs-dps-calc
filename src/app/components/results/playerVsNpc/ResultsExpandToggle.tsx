import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { usePreferences } from '@/state/PreferencesStore';

const ResultsExpandToggle: React.FC = observer(() => {
  const preferences = usePreferences();
  const Arrow = preferences.resultsExpanded ? IconArrowUp : IconArrowDown;

  return (
    <button
      type="button"
      className="text-sm px-4 py-1 bg-dark-500 text-gray-300 w-full shadow border-t border-dark-200 flex justify-between items-center rounded-b"
      onClick={() => preferences.update({ resultsExpanded: !preferences.resultsExpanded })}
    >
      <Arrow size={15} />
      <div>{preferences.resultsExpanded ? 'Show less' : 'Show more'}</div>
      <Arrow size={15} />
    </button>
  );
});

export default ResultsExpandToggle;
