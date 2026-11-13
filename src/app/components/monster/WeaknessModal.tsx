import React from 'react';
import { observer } from 'mobx-react-lite';
import Modal from '@/app/components/generic/Modal';
import NumberInput from '@/app/components/generic/NumberInput';
import Air from '@/public/img/weaknesses/Air.png';
import Water from '@/public/img/weaknesses/Water.png';
import Earth from '@/public/img/weaknesses/Earth.png';
import Fire from '@/public/img/weaknesses/Fire.png';
import { useMonster } from '@/state/MonsterStore';
import { Spellement } from '@/types/Spell';

const ELEMENTS = [
  {
    element: 'air', label: 'Air', icon: Air, className: 'border-gray-400 hover:bg-gray-400', selectedClassName: 'bg-gray-500',
  },
  {
    element: 'water', label: 'Water', icon: Water, className: 'border-blue-300 hover:bg-blue-400', selectedClassName: 'bg-blue-500',
  },
  {
    element: 'earth', label: 'Earth', icon: Earth, className: 'border-green-300 hover:bg-green-400', selectedClassName: 'bg-green-500',
  },
  {
    element: 'fire', label: 'Fire', icon: Fire, className: 'border-red-300 hover:bg-red-400', selectedClassName: 'bg-red-500',
  },
] as const;

const OPTION_CLASSES = 'transition-colors flex justify-center items-center gap-2 p-2 border rounded';

interface WeaknessModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const WeaknessModal: React.FC<WeaknessModalProps> = observer(({ isOpen, setIsOpen }) => {
  const monster = useMonster();
  const { weakness } = monster.definition;

  const setElement = (element: Spellement) => {
    monster.updateDefinition({ weakness: { element, severity: weakness?.severity ?? 0 } });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Change elemental weakness"
    >
      <div className="flex justify-center gap-2 flex-wrap">
        <button
          type="button"
          className={`${OPTION_CLASSES} border-zinc-400 hover:bg-zinc-700 ${weakness ? '' : 'bg-zinc-800'}`}
          onClick={() => monster.updateDefinition({ weakness: null })}
        >
          None
        </button>
        {ELEMENTS.map(({
          element, label, icon, className, selectedClassName,
        }) => (
          <button
            key={element}
            type="button"
            className={`${OPTION_CLASSES} ${className} ${weakness?.element === element ? selectedClassName : ''}`}
            onClick={() => setElement(element)}
          >
            <img alt={label} src={icon.src} className="w-6" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center">
        <p>Multiplier</p>
        <div className="flex items-center">
          <p>+</p>
          <NumberInput
            disabled={!weakness}
            className="form-control w-14 rounded mt-auto"
            onChange={(severity) => monster.updateDefinition({ weakness: { severity } })}
            min={0}
            max={1000}
            value={weakness?.severity ?? 0}
            step={1}
            required
          />
          <p>%</p>
        </div>
      </div>
    </Modal>
  );
});

export default WeaknessModal;
