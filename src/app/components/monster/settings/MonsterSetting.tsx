import React, { PropsWithChildren, ReactNode } from 'react';
import type { StaticImageData } from 'next/image';

interface MonsterSettingProps {
  title: ReactNode;
  icon?: StaticImageData;
  className?: string;
}

const MonsterSetting: React.FC<PropsWithChildren<MonsterSettingProps>> = ({
  title, icon, className, children,
}) => (
  <div className={className}>
    <h4 className="font-bold font-serif">
      {icon && (
        <>
          <img src={icon.src} alt="" className="inline-block" />
          {' '}
        </>
      )}
      {title}
    </h4>
    <div className="mt-2">
      {children}
    </div>
  </div>
);

export default MonsterSetting;
