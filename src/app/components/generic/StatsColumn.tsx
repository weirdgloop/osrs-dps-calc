import React from 'react';

const MonsterStatSection: React.FC<React.PropsWithChildren<{ name: string }>> = ({
  name,
  children,
}) => (
  <div className="w-[95px]">
    <p className="text-sm text-gray-300">{name}</p>
    <div className="flex flex-col gap-2 mt-3 text-center">
      {children}
    </div>
  </div>
);

export default MonsterStatSection;
