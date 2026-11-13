import React, { useState } from 'react';
import { IconShare2 } from '@tabler/icons-react';
import ShareModal from '@/app/components/header/ShareModal';

const ShareLoadoutButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] py-1.5 px-2.5 rounded-md dark:bg-dark-300 dark:border-dark-200 flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <IconShare2 size={20} aria-label="Share loadout" />
        <div className="hidden md:block">Share loadout</div>
      </button>
      <ShareModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default ShareLoadoutButton;
