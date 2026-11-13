import React, { PropsWithChildren } from 'react';

interface BonusColumnProps {
  title: string;
}

const BonusColumn: React.FC<PropsWithChildren<BonusColumnProps>> = ({ title, children }) => (
  <div className="w-[95px]">
    <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
    <div className="flex flex-col gap-1 mt-3 text-center">
      {children}
    </div>
  </div>
);

export default BonusColumn;
