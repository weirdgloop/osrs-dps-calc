import wiki from '@/public/img/Wiki@2x.webp';
import React from 'react';

const DpsCalcLogo: React.FC = () => (
  <div className="flex-shrink-0 flex items-center gap-2 select-none">
    <a target="_blank" href="https://oldschool.runescape.wiki"><img src={wiki.src} className="w-12" alt="OSRS Wiki" /></a>
    <h1 className="font-bold font-serif text-white">DPS Calculator</h1>
    <span
      className="text-sm text-white px-1 py-0.5 bg-orange-700 rounded [text-shadow:_0_1px_0_rgb(0_0_0_/_30%)] lowercase"
    >
      Beta
    </span>
  </div>
);

export default DpsCalcLogo;
