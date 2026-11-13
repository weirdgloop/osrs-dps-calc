import React from 'react';
import { observer } from 'mobx-react-lite';
import attack from '@/public/img/bonuses/attack.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import { useMonster } from '@/state/MonsterStore';

const MELEE_STYLES = ['slash', 'stab', 'crush'];
const RANGED_STYLES = ['light', 'standard', 'heavy'];

const MonsterStyle: React.FC = observer(() => {
  const { style } = useMonster().definition;

  const icon = (() => {
    if (MELEE_STYLES.includes(style || '')) return { src: attack.src, alt: 'Melee' };
    if (RANGED_STYLES.includes(style || '')) return { src: ranged.src, alt: 'Ranged' };
    if (style === 'magic') return { src: magic.src, alt: 'Magic' };
    return null;
  })();

  if (!icon) {
    return <span className="text-gray-300 italic">Unknown</span>;
  }

  return (
    <>
      <img src={icon.src} className="w-5 inline-block" alt={icon.alt} />
      {' '}
      <span className="capitalize">{style}</span>
    </>
  );
});

const MonsterSpeed: React.FC = observer(() => {
  const { speed } = useMonster().definition;

  return (
    <>
      {speed}
      {' '}
      <span className="text-gray-300">
        (
        {parseFloat((speed * 0.6).toFixed(1))}
        s)
      </span>
    </>
  );
});

const NPCInfo: React.FC = () => (
  <div className="flex-grow text-white m-4 pb-4">
    <h2 className="font-serif font-bold">Additional information</h2>
    <div className="flex flex-wrap gap-2 mt-2 text-sm items-center">
      <div
        className="border-l-2 bg-dark-500 py-1 px-3 border-blue-300"
      >
        <span className="text-gray-300">NPC style:</span>
        {' '}
        <div className="inline-block gap-1">
          <MonsterStyle />
        </div>
      </div>
      <div
        className="border-l-2 bg-dark-500 py-1 px-3 border-blue-300"
      >
        <span className="text-gray-300">NPC speed:</span>
        {' '}
        <MonsterSpeed />
      </div>
    </div>
  </div>
);

export default NPCInfo;
