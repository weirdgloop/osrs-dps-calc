import React, { useState } from 'react';
import { IconRotate2 } from '@tabler/icons-react';

interface ILazyImageProps extends React.HTMLProps<HTMLImageElement> {
  // Whether to add max-height, max-width: 100% and object-fit: contain
  responsive?: boolean;
  // Whether to show a loading spinner while the image is loading
  showSpinner?: boolean;
}

const LazyImage: React.FC<ILazyImageProps> = (props) => {
  const { responsive, showSpinner, ...imgProps } = props;
  const [loading, setLoading] = useState(true);

  return (
    <>
      {(showSpinner && loading) && (
      <div className="max-h-full max-w-full">
        <IconRotate2 className="w-4 animate-spin text-gray-300" />
      </div>
      )}
      <img
        alt=""
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...imgProps}
        className={`${responsive ? 'max-h-full max-w-full object-contain' : ''} ${(showSpinner && loading) ? 'hidden' : 'visible'}`}
        onLoad={() => setLoading(false)}
      />
    </>
  );
};

export default LazyImage;
