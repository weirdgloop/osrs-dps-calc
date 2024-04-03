import React, { PropsWithChildren } from 'react';
import { Monster } from '@/types/Monster';

export interface IMonsterContainerChildProps {
  monster: Monster;
}

const ExtraContainerBase: React.FC<PropsWithChildren<{ header: string | React.ReactNode }>> = ({ header, children }) => (
  <div className="mt-4">
    <h4 className="font-bold font-serif">
      {header}
    </h4>
    <div className="mt-2">
      {children}
    </div>
  </div>
);

export default ExtraContainerBase;
