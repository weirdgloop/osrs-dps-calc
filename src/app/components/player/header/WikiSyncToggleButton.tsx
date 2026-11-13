/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Image from 'next/image';
import { GetPropsCommonOptions, UseSelectGetToggleButtonPropsOptions } from 'downshift';
import RuneLiteLogo from '@/public/img/RuneLite.webp';

interface WikiSyncToggleButtonProps {
  getToggleButtonProps: (options?: UseSelectGetToggleButtonPropsOptions | undefined, otherOptions?: GetPropsCommonOptions | undefined) => unknown;
}

const WikiSyncToggleButton: React.FC<WikiSyncToggleButtonProps> = ({ getToggleButtonProps }) => (
  <button
    {...getToggleButtonProps({
      // simple logging of button press for usage stats
      onClick: () => { fetch('https://chisel.weirdgloop.org/t/dps/rl'); },
    }) as object}
    type="button"
    className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] p-0.5 rounded-md dark:bg-dark-300 dark:border-dark-200 flex items-center gap-1 w-8"
    data-tooltip-id="tooltip"
    data-tooltip-content="Load data from RuneLite"
  >
    <Image alt="RuneLite" src={RuneLiteLogo} />
  </button>
);

export default WikiSyncToggleButton;
