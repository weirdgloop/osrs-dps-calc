import { IconPencil } from '@tabler/icons-react';
import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { usePlayer } from '@/state/LoadoutStore';

interface LoadoutNameEditContainerProps {
  onComplete: () => void;
}

const LoadoutNameEditContainer: React.FC<LoadoutNameEditContainerProps> = observer(({ onComplete }) => {
  const { player, updateBasePlayer } = usePlayer();

  const [value, setValue] = useState(player.name);

  const focusInput = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
  }, []);

  const onSubmit = () => {
    updateBasePlayer({ name: value });
    onComplete();
  };

  return (
    <form className="flex gap-2 items-center w-full" onSubmit={onSubmit}>
      <input
        type="text"
        className="form-control font-mono tracking-tighter"
        ref={focusInput}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={24}
        onBlur={onSubmit}
      />
    </form>
  );
});

const LoadoutName: React.FC = observer(() => {
  const { player } = usePlayer();

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <LoadoutNameEditContainer onComplete={() => setIsEditing(false)} />
    );
  }

  return (
    <div className="flex gap-2 items-center mr-8">
      <h2 className="tracking-tight font-bold overflow-hidden min-w-0 whitespace-nowrap">
        {player.name}
      </h2>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="disabled:cursor-not-allowed text-dark-100 disabled:text-dark-500 hover:text-red transition-colors flex-none"
        data-tooltip-id="tooltip"
        data-tooltip-content="Rename loadout"
      >
        <IconPencil aria-label="Rename loadout" size={18} />
      </button>
    </div>
  );
});

export default LoadoutName;
