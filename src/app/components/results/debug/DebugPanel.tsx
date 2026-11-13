import React, { PropsWithChildren } from 'react';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import LazyImage from '@/app/components/generic/LazyImage';
import debug from '@/public/img/debug.webp';

interface DebugPanelProps {
  title: string;
  defaultIsOpen?: boolean;
}

const DebugPanel: React.FC<PropsWithChildren<DebugPanelProps>> = ({ title, defaultIsOpen, children }) => (
  <SectionAccordion
    title={(
      <div className="flex items-center gap-2">
        <div className="w-6 flex justify-center"><LazyImage src={debug.src} /></div>
        <h3 className="font-serif font-bold">
          {title}
        </h3>
      </div>
    )}
    defaultIsOpen={defaultIsOpen}
  >
    {children}
  </SectionAccordion>
);

export default DebugPanel;
