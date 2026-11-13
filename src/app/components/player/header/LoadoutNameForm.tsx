import React, { useCallback } from 'react';

interface LoadoutNameFormProps {
  value: string;
  onSubmit: () => void;
  onChange: (value: string) => void;
}

const LoadoutNameForm: React.FC<LoadoutNameFormProps> = ({ value, onSubmit, onChange }) => {
  const focusInput = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
  }, []);

  return (
    <form className="flex gap-2 items-center w-full" onSubmit={onSubmit}>
      <input
        type="text"
        className="form-control font-mono tracking-tighter"
        ref={focusInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={24}
        onBlur={onSubmit}
      />
    </form>
  );
};

export default LoadoutNameForm;
