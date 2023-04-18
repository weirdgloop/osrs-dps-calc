import React from 'react';
import {Switch} from '@headlessui/react';

interface ToggleProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = (props) => {
  const {checked, setChecked, label} = props;

  return (
    <Switch.Group>
      <div className="flex items-center text-sm mb-1.5">
        <Switch
          checked={checked}
          onChange={setChecked}
          className={`${
            checked ? 'bg-blue-600' : 'bg-gray-500'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
        <Switch.Label className="ml-2">{label}</Switch.Label>
      </div>
    </Switch.Group>
  )
}

export default Toggle;