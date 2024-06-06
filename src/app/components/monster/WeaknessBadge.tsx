import { Monster } from '@/types/Monster';
import React, { useEffect, useState } from 'react';
import Modal from '@/app/components/generic/Modal';
import Fire from '@/public/img/weaknesses/Fire.png';
import Water from '@/public/img/weaknesses/Water.png';
import Earth from '@/public/img/weaknesses/Earth.png';
import Air from '@/public/img/weaknesses/Air.png';
import NumberInput from '@/app/components/generic/NumberInput';
import { useStore } from '@/state';

interface IWeaknessBadgeProps {
  weakness?: Monster['weakness']
  isCustomMonster: boolean;
}

const WeaknessBadge: React.FC<IWeaknessBadgeProps> = (props) => {
  const store = useStore();
  const { weakness, isCustomMonster } = props;
  const [element, setElement] = useState(weakness?.element);
  const [severity, setSeverity] = useState(weakness?.severity || 0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    setElement(weakness?.element);
    setSeverity(weakness?.severity || 0);
  }, [weakness?.element, weakness?.severity]);

  useEffect(() => {
    if (element !== undefined) {
      store.updateMonster({
        weakness: {
          element,
          severity,
        },
      });
    }
  }, [element, severity, store]);

  if (!element && !isCustomMonster) return null;

  let extraStyles = '';
  switch (element) {
    case 'air':
      extraStyles = 'bg-gray-500 border-gray-400';
      break;
    case 'water':
      extraStyles = 'bg-blue-800 border-blue-300';
      break;
    case 'earth':
      extraStyles = 'bg-green-800 border-green-300';
      break;
    case 'fire':
      extraStyles = 'bg-red-800 border-red-300';
      break;
    default:
      extraStyles = 'border-gray-400';
  }

  return (
    <>
      <button
        type="button"
        className={`w-full rounded border mt-2 px-1 py-0.5 transition-[background,color] ${extraStyles} text-white text-center text-sm`}
        disabled={!isCustomMonster}
        onClick={() => setModalIsOpen(true)}
      >
        {
          element ? `Weak to ${element} spells: +${severity}%` : 'No elemental weakness'
        }
      </button>
      <Modal
        isOpen={modalIsOpen}
        setIsOpen={setModalIsOpen}
        title="Change elemental weakness"
      >
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            type="button"
            className={`transition-colors flex justify-center items-center gap-2 p-2 border rounded border-zinc-400 hover:bg-zinc-700 ${element === undefined && 'bg-zinc-800'}`}
            onClick={() => setElement(undefined)}
          >
            None
          </button>
          <button
            type="button"
            className={`transition-colors flex justify-center items-center gap-2 p-2 border rounded border-gray-400 hover:bg-gray-400 ${element === 'air' && 'bg-gray-500'}`}
            onClick={() => setElement('air')}
          >
            <img alt="Air" src={Air.src} className="w-6" />
            Air
          </button>
          <button
            type="button"
            className={`transition-colors flex justify-center items-center gap-2 p-2 border rounded border-blue-300 hover:bg-blue-400 ${element === 'water' && 'bg-blue-500'}`}
            onClick={() => setElement('water')}
          >
            <img alt="Water" src={Water.src} className="w-6" />
            Water
          </button>
          <button
            type="button"
            className={`transition-colors flex justify-center items-center gap-2 p-2 border rounded border-green-300 hover:bg-green-400 ${element === 'earth' && 'bg-green-500'}`}
            onClick={() => setElement('earth')}
          >
            <img alt="Earth" src={Earth.src} className="w-6" />
            Earth
          </button>
          <button
            type="button"
            className={`transition-colors flex justify-center items-center gap-2 p-2 border rounded border-red-300 hover:bg-red-400 ${element === 'fire' && 'bg-red-500'}`}
            onClick={() => setElement('fire')}
          >
            <img alt="Fire" src={Fire.src} className="w-6" />
            Fire
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <p>Multiplier</p>
          <div className="flex items-center">
            <p>+</p>
            <NumberInput
              disabled={element === undefined}
              className="form-control w-14 rounded mt-auto"
              onChange={(v) => setSeverity(v)}
              min={0}
              max={1000}
              value={severity || 0}
              step={1}
            />
            <p>%</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WeaknessBadge;
