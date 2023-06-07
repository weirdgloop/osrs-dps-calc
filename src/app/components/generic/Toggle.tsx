import React from 'react';
import {Switch} from '@headlessui/react';

interface ToggleProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label: string | JSX.Element;
  help?: string;
}

const Toggle: React.FC<ToggleProps> = (props) => {
  const {checked, setChecked, label, help} = props;

  return (
    <Switch.Group>
      <div className="flex items-center text-sm mb-1.5">
        <Switch
          checked={checked}
          onChange={setChecked}
          className={`${
            checked ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-400'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
        <Switch.Label className="ml-2">{label} {help && <span
          title={help}
          className={'cursor-help ml-1 text-gray-500 transition-[background] bg-body-200 dark:bg-dark-200 dark:text-white dark:hover:bg-dark-700 hover:bg-body-300 px-1 rounded no-underline'}
        >
          ?
        </span>}</Switch.Label>
      </div>
    </Switch.Group>
  )
}

export default Toggle;