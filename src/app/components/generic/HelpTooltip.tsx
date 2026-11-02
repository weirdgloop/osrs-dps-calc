import React from 'react';

interface HelpTooltipProps {
  content: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ content }) => (
  <span
    className="align-super underline decoration-dotted cursor-help text-xs text-gray-300"
    data-tooltip-id="tooltip"
    data-tooltip-content={content}
  >
    ?
  </span>
);

export default HelpTooltip;
