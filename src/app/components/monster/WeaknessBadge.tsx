import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import WeaknessModal from '@/app/components/monster/WeaknessModal';
import { useMonster } from '@/state/MonsterStore';
import { Spellement } from '@/types/Spell';

const BADGE_STYLES: Record<Spellement, string> = {
  air: 'bg-gray-500 border-gray-400',
  water: 'bg-blue-800 border-blue-300',
  earth: 'bg-green-800 border-green-300',
  fire: 'bg-red-800 border-red-300',
};

const WeaknessBadge: React.FC = observer(() => {
  const monster = useMonster();
  const [isOpen, setIsOpen] = useState(false);
  const { weakness } = monster.scaled;

  if (!weakness && !monster.isCustom) return null;

  return (
    <>
      <button
        type="button"
        className={`w-full rounded border mt-2 px-1 py-0.5 transition-[background,color] ${weakness ? BADGE_STYLES[weakness.element] : 'border-gray-400'} text-white text-center text-sm`}
        disabled={!monster.isCustom}
        onClick={() => setIsOpen(true)}
      >
        {weakness ? `Weak to ${weakness.element} spells: +${weakness.severity}%` : 'No elemental weakness'}
      </button>
      <WeaknessModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
});

export default WeaknessBadge;
