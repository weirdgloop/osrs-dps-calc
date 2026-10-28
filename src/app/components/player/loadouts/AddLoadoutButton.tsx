import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconPlus } from '@tabler/icons-react';
import { useLoadouts } from '@/state/LoadoutStore';

const AddLoadoutButton: React.FC = observer(() => {
  const loadouts = useLoadouts();

  return (
    <button
      type="button"
      disabled={!loadouts.canCreate}
      onClick={() => loadouts.create({ select: true, cloneFrom: loadouts.selectedUuid })}
      className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-body-200 dark:disabled:text-dark-500 hover:text-green transition-colors"
      data-tooltip-id="tooltip"
      data-tooltip-content="Add new loadout"
    >
      <IconPlus aria-label="Add new loadout" />
    </button>
  );
});

export default AddLoadoutButton;
