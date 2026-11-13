import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import { useLoadouts } from '@/state/LoadoutStore';
import { usePlayer } from '@/state/PlayerStore';

const DeleteLoadoutButton: React.FC = () => {
  const loadouts = useLoadouts();
  const player = usePlayer();

  return (
    <button
      type="button"
      onClick={() => loadouts.remove(player.uuid)}
      className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors"
      data-tooltip-id="tooltip"
      data-tooltip-content="Remove loadout"
    >
      <IconTrash aria-label="Remove loadout" />
    </button>
  );
};

export default DeleteLoadoutButton;
