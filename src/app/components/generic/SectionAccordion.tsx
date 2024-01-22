import React, { PropsWithChildren, useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface ISectionAccordionProps {
  defaultIsOpen?: boolean;
  onIsOpenChanged?: (isOpen: boolean) => void;
  title: React.ReactNode;
}

const SectionAccordion: React.FC<PropsWithChildren<ISectionAccordionProps>> = (props) => {
  const {
    defaultIsOpen, onIsOpenChanged, title, children,
  } = props;
  const [isOpen, setIsOpen] = useState(defaultIsOpen !== undefined ? defaultIsOpen : false);

  useEffect(() => {
    if (defaultIsOpen !== undefined) setIsOpen(defaultIsOpen);
  }, [defaultIsOpen]);

  return (
    <div className="bg-tile dark:bg-dark-300 md:rounded shadow-lg max-w-[100vw] my-2 text-black">
      <button
        type="button"
        className={`w-full px-4 py-4 bg-body-100 dark:bg-dark-400 dark:border-dark-200 text-black dark:text-white md:rounded-t flex items-center justify-between ${isOpen ? 'border-b border-body-300' : 'md:rounded-b'}`}
        onClick={() => {
          if (onIsOpenChanged) onIsOpenChanged(!isOpen);
          setIsOpen(!isOpen);
        }}
      >
        {title}
        {isOpen ? <IconChevronUp /> : <IconChevronDown />}
      </button>
      {isOpen && (
        <div className="px-6 py-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionAccordion;
