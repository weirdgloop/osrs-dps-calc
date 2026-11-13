import React, { PropsWithChildren, ReactNode } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface MonsterAccordionProps {
  title: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const MonsterAccordion: React.FC<PropsWithChildren<MonsterAccordionProps>> = ({
  title, isOpen, onToggle, children,
}) => (
  <div className="rounded bg-body-100 dark:bg-dark-500">
    <button
      type="button"
      className={`w-full pt-1 border-b-body-400 dark:border-b-dark-300 px-2 flex text-gray-500 dark:text-gray-300 font-semibold justify-between gap-2 ${isOpen ? 'border-b' : ''}`}
      onClick={onToggle}
    >
      <div>{title}</div>
      <div className="relative top-[-2px]">
        {isOpen ? <IconChevronUp width={20} /> : <IconChevronDown width={20} />}
      </div>
    </button>
    {isOpen && children}
  </div>
);

export default MonsterAccordion;
