import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconPencil } from '@tabler/icons-react';
import LoadoutNameForm from '@/app/components/player/header/LoadoutNameForm';
import { useLoadouts } from '@/state/LoadoutStore';
import { usePlayer } from '@/state/PlayerStore';

const LoadoutName: React.FC = observer(() => {
  const loadouts = useLoadouts();
  const player = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(player.name);

  if (isEditing) {
    return (
      <LoadoutNameForm
        value={value}
        onChange={setValue}
        onSubmit={() => {
          loadouts.rename(player.uuid, value);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <div className="flex gap-2 items-center mr-8">
      <h2 className="tracking-tight font-bold overflow-hidden min-w-0 whitespace-nowrap">
        {player.name}
      </h2>
      <button
        type="button"
        onClick={() => {
          setValue(player.name);
          setIsEditing(true);
        }}
        className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors flex-none"
        data-tooltip-id="tooltip"
        data-tooltip-content="Rename loadout"
      >
        <IconPencil aria-label="Rename loadout" size={18} />
      </button>
    </div>
  );
});

export default LoadoutName;
