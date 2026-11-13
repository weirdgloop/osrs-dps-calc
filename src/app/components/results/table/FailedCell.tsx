import React from 'react';
import ResultCell from '@/app/components/results/table/ResultCell';

const FailedCell: React.FC<{ error: string }> = ({ error }) => (
  <ResultCell>
    <span className="text-sm text-red-300 cursor-help" title={error}>Error</span>
  </ResultCell>
);

export default FailedCell;
