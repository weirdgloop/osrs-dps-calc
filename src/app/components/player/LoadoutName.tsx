import { IconPencil } from '@tabler/icons-react';
import React, { useCallback, useState } from 'react';

interface LoadoutNameProps {
  name: string;
  index: number;
  renameLoadout: (name: string) => void;
}

interface LoadoutNameEditContainerProps {
  value: string;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoadoutNameEditContainer: React.FC<LoadoutNameEditContainerProps> = (props) => {
  const { value, onSubmit, onChange } = props;

  const focusInput = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
  }, []);

  return (
    <form className="flex gap-2 items-center w-full" onSubmit={onSubmit}>
      <input type="text" className="form-control font-mono tracking-tighter" ref={focusInput} value={value} onChange={onChange} maxLength={24} onBlur={onSubmit} />
    </form>
  );
};

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
    renameLoadout(value);
    setEditName(false);
  };

  return editName ? (
    <LoadoutNameEditContainer onSubmit={onSubmit} onChange={(e) => setValue(e.target.value)} value={value} />
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
        <IconPencil aria-label="Rename loadout" size={18} />
      </button>
    </div>
  );
};

export default LoadoutName;
