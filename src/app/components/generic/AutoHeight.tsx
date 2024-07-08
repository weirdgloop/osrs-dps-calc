import React, {
  useRef, useState, useEffect, PropsWithChildren,
} from 'react';
import AnimateHeight, { AnimateHeightProps, Height } from 'react-animate-height';

const AutoHeight: React.FC<PropsWithChildren<AnimateHeightProps>> = ({ children, ...props }) => {
  const [height, setHeight] = useState<Height>('auto');
  const contentDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = contentDiv.current as HTMLDivElement;

    const resizeObserver = new ResizeObserver(() => {
      setHeight(element.clientHeight);
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <AnimateHeight
      {...props}
      height={height}
      contentClassName="auto-content"
      contentRef={contentDiv}
      disableDisplayNone
    >
      {children}
    </AnimateHeight>
  );
};

export default AutoHeight;
