import Image, { StaticImageData } from 'next/image';
import React from 'react';

interface PlayerTabProps {
  name: string;
  image: string | StaticImageData;
  onClick?: () => void;
  isActive?: boolean;
}

export const PlayerTab: React.FC<PlayerTabProps> = (props) => {
  const {
    name, image, onClick, isActive,
  } = props;
  return (
    <button
      type="button"
      className={`flex flex-initial shadow w-10 h-10 cursor-pointer justify-center items-center rounded transition-[background] ${isActive ? ' bg-tile dark:bg-dark-700' : 'bg-body-400 dark:bg-dark-200'}`}
      onClick={onClick}
      data-tooltip-id="tooltip"
      data-tooltip-content={name}
    >
      <Image src={image} alt={name} className="" />
    </button>
  );
};

export default PlayerTab;
