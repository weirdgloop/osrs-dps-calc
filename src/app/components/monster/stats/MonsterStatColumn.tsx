import React, { PropsWithChildren } from 'react';

interface MonsterStatColumnProps {
  title: string;
}

const MonsterStatColumn: React.FC<PropsWithChildren<MonsterStatColumnProps>> = ({ title, children }) => (
  <div className="w-[95px]">
    <p className="text-sm text-gray-400 dark:text-gray-300">{title}</p>
    <div className="flex flex-col gap-2 mt-3 text-center">
      {children}
    </div>
  </div>
);

export default MonsterStatColumn;
