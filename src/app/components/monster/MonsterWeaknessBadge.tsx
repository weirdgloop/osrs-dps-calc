import React, { useState } from 'react';
import Modal from '@/app/components/generic/Modal';
import Fire from '@/public/img/weaknesses/Fire.png';
import Water from '@/public/img/weaknesses/Water.png';
import Earth from '@/public/img/weaknesses/Earth.png';
import Air from '@/public/img/weaknesses/Air.png';
import NumberInput from '@/app/components/generic/NumberInput';
import { useMonster } from '@/state/MonsterStore';
import { observer } from 'mobx-react-lite';
import { Spellement } from '@/types/Spell';
import { StaticImageData } from 'next/image';

interface ISpellementRenderData {
  name: string;
  image: StaticImageData | null;
  borderClass: string;
  hoverClass: string;
  activeClass: string;
}

const SpellementRenderData: { [k in Spellement | 'none']: ISpellementRenderData } = {
  none: {
    name: 'None',
    image: null,
    borderClass: 'border-zinc-400',
    hoverClass: 'bg-zinc-700',
    activeClass: 'bg-zinc-800',
  },
  air: {
    name: 'Air',
    image: Air,
    borderClass: 'border-gray-400',
    hoverClass: 'bg-gray-400',
    activeClass: 'bg-gray-500',
  },
  water: {
    name: 'Water',
    image: Water,
    borderClass: 'border-blue-300',
    hoverClass: 'bg-blue-400',
    activeClass: 'bg-blue-500',
  },
  earth: {
    name: 'Earth',
    image: Earth,
    borderClass: 'border-green-300',
    hoverClass: 'bg-green-400',
    activeClass: 'bg-green-500',
  },
  fire: {
    name: 'Fire',
    image: Fire,
    borderClass: 'border-red-300',
    hoverClass: 'bg-red-400',
    activeClass: 'bg-red-500',
  },
};

const MonsterWeaknessElementButton: React.FC<{ element: Spellement | 'none' }> = observer(({ element }) => {
  const { monster, updateMonster } = useMonster();
  const {
    name, image, borderClass, hoverClass, activeClass,
  } = SpellementRenderData[element];

  const setWeaknessElement = () => {
    if (element === 'none') {
      updateMonster({ weakness: null });
      return;
    }
    if (monster.weakness?.element !== element) {
      updateMonster({ weakness: { element, severity: 0 } });
    }
  };

  const isActive = monster.weakness?.element === element;

  return (
    <button
      type="button"
      className={`transition-colors flex justify-center items-center gap-2 p-2 border rounded ${borderClass} hover:${hoverClass} ${isActive && activeClass}`}
      onClick={() => setWeaknessElement()}
    >
      {image && <img alt={name} src={image.src} className="w-6" />}
      {name}
    </button>
  );
});

interface MonsterWeaknessModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MonsterWeaknessModal: React.FC<MonsterWeaknessModalProps> = observer(({ isOpen, setIsOpen }) => {
  const { monster, updateMonster } = useMonster();

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Change elemental weakness"
    >
      <div className="flex justify-center gap-2 flex-wrap">
        <MonsterWeaknessElementButton element="none" />
        <MonsterWeaknessElementButton element="air" />
        <MonsterWeaknessElementButton element="water" />
        <MonsterWeaknessElementButton element="earth" />
        <MonsterWeaknessElementButton element="fire" />
      </div>
      <div className="mt-4 flex flex-col items-center">
        <p>Multiplier</p>
        <div className="flex items-center">
          <p>+</p>
          <NumberInput
            disabled={monster.weakness === null}
            className="form-control w-14 rounded mt-auto"
            onChange={(v) => updateMonster({ weakness: { severity: v } })}
            min={0}
            max={1000}
            value={monster.weakness?.severity ?? 0}
            step={1}
            required
          />
          <p>%</p>
        </div>
      </div>
    </Modal>
  );
});

const MonsterWeaknessBadge: React.FC = observer(() => {
  const { monster, isCustomMonster } = useMonster();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  if (!monster.weakness && !isCustomMonster) {
    return null;
  }

  const element = monster.weakness?.element ?? 'none';
  const severity = monster.weakness?.severity ?? 0;

  return (
    <button
      type="button"
      className={`w-full rounded border mt-2 px-1 py-0.5 transition-[background,color] ${SpellementRenderData[element].activeClass} ${SpellementRenderData[element].borderClass} text-white text-center text-sm`}
      disabled={!isCustomMonster}
      onClick={() => setModalIsOpen(true)}
    >
      {
        (element !== 'none') ? `Weak to ${element} spells: +${severity}%` : 'No elemental weakness'
      }
      <MonsterWeaknessModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
    </button>
  );
});

export default MonsterWeaknessBadge;
