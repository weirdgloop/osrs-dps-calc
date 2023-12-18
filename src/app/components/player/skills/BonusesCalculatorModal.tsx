import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import Modal from "@/app/components/generic/Modal";
import {Potion, PotionMap} from "@/enums/Potion";
import BuffItem from "@/app/components/player/buffs/BuffItem";
import {classNames} from "@/utils";
import {PlayerSkills} from "@/types/Player";

interface IPreferencesModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
}

const BonusesCalculatorModal: React.FC<IPreferencesModalProps> = observer((props) => {
  const {isOpen, setIsOpen} = props;
  const store = useStore();
  const {player} = store;

  // TODO should people be able to pick multiple potions? or only one?
  const [potions, setPotions] = useState<Potion[]>([]);

  useEffect(() => {
    // When the modal closes, reset the potions array
    if (!isOpen) setPotions([]);
  }, [isOpen]);

  const saveBonuses = () => {
    let bonuses: PlayerSkills = {atk: 0, def: 0, hp: 0, magic: 0, prayer: 0, ranged: 0, str: 0}

    // Calculate what the bonus values should be, and then set them
    for (let p of potions) {
      let result = PotionMap[p].calculateFn(player.skills);
      for (let k of Object.keys(result)) {
        // TODO this probably needs more work, as multiple potions can "compete" over a bonus value for a skill
        bonuses[k as keyof typeof bonuses] = result[k as keyof typeof result] as number;
      }
    }

    // Set the calculated bonuses
    store.updatePlayer({ boosts: bonuses })

    // Close the modal
    setIsOpen(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={'Calculate bonuses'}
      footerChildren={
        <button
          className={classNames(
            'btn',
            'text-sm'
          )}
          onClick={saveBonuses}
        >
          Save
        </button>
      }
    >
      <div className={'text-sm'}>
        <p>
          You can select the bonus items you use below, and we&apos;ll automatically fill in your skill bonus values.
        </p>
        <p className={'mt-2 text-xs'}>
          If you have manually edited your bonuses, they will be reset upon clicking Save below.
        </p>
      </div>
      <div className={'mt-4'}>
        <div
          className={'h-[11.5rem] mt-2 bg-white dark:bg-dark-500 dark:border-dark-200 rounded border border-gray-300 overflow-y-scroll'}
        >
          {
            Object.entries(PotionMap).map(([k, v]) => {
              const potion: Potion = parseInt(k);
              const isActive = potions.includes(potion);

              return <BuffItem
                key={k}
                potion={potion}
                name={v.name}
                image={v.image}
                active={isActive}
                setActive={() => {
                  let p = potions;
                  if (isActive) {
                    p = p.filter((p) => p !== potion);
                  } else {
                    p = [...p, potion];
                  }
                  setPotions(p);
                }}
              />
            })
          }
        </div>
      </div>
    </Modal>
  )
})

export default BonusesCalculatorModal;
