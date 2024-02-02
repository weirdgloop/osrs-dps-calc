import { IconCheck, IconPencil, IconX } from '@tabler/icons-react';
import React, { useState } from 'react';

interface LoadoutNameProps {
  name: string
  index: number;
  renameLoadout: (index: number, name: string) => void
}

const LoadoutName: React.FC<LoadoutNameProps> = ({ name, index, renameLoadout }) => {
  const [editName, setEditName] = useState(false);
  const [value, setValue] = useState(name);
  const [prevIndex, setPrevIndex] = useState(index);

  // Resets form state when selected loadout changes
  // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
  if (index !== prevIndex) {
    setPrevIndex(index);
    setEditName(false);
  }

  const onEdit = () => {
    setValue(name);
    setEditName(true);
  };

  const onSubmit = () => {
    if (value) {
      renameLoadout(index, value);
    }
    setEditName(false);
  };

  return editName ? (
    <form className="flex gap-2 items-center w-full" onSubmit={onSubmit}>
      <input type="text" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} maxLength={20} />
      <button
        type="submit"
        disabled={value.length === 0}
        className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors flex-none"
        data-tooltip-id="tooltip"
        data-tooltip-content="Confirm rename"
      >
        <IconCheck aria-label="Confirm rename" size={24} />
      </button>
      <button
        type="button"
        onClick={() => setEditName(false)}
        className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors flex-none"
        data-tooltip-id="tooltip"
        data-tooltip-content="Cancel rename"
      >
        <IconX aria-label="Cancel rename" size={24} />
      </button>
    </form>
  ) : (
    <div className="flex gap-2 items-center mr-8">
      <h2 className="tracking-tight font-bold overflow-hidden min-w-0 whitespace-nowrap">
        {name}
      </h2>
      <button
        type="button"
        onClick={onEdit}
        className="disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors flex-none"
        data-tooltip-id="tooltip"
        data-tooltip-content="Rename loadout"
      >
        <IconPencil aria-label="Rename loadout" size={24} />
      </button>
    </div>
  );
};

export default LoadoutName;
