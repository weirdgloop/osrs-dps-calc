import React, { PropsWithChildren } from 'react';

interface ResultCellProps {
  isBest?: boolean;
}

const ResultCell: React.FC<PropsWithChildren<ResultCellProps>> = ({ isBest, children }) => (
  <th className={`text-center w-28 border-r ${isBest ? 'dark:text-green-200 text-green-800' : 'dark:text-body-200 text-black'}`}>
    {children}
  </th>
);

export default ResultCell;
