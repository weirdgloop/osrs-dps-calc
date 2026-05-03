import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import CustomMonsterInputs from '@/app/components/monster/MonsterCombatStyle';
import MonsterToaInputs from '@/app/components/monster/MonsterToaInputs';
import MonsterCoxInputs from '@/app/components/monster/MonsterCoxInputs';
import MonsterPhaseSelect from '@/app/components/monster/MonsterPhaseSelect';
import MonsterCurrentHp from '@/app/components/monster/MonsterCurrentHp';
import MonsterHeader from '@/app/components/monster/MonsterHeader';
import MonsterNotices from '@/app/components/monster/MonsterNotices';
import MonsterStatInputs from '@/app/components/monster/MonsterStatInputs';
import MonsterAttributes from '@/app/components/monster/MonsterAttributes';
import HelpLink from '@/app/components/HelpLink';
import MonsterPrayers from '@/app/components/monster/MonsterPrayers';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import MonsterDemonbaneInput from './MonsterDemonbaneInput';
import MonsterPartySizeInput from './MonsterPartySizeInput';
import MonsterWeaknessBadge from './MonsterWeaknessBadge';
import MonsterDefensiveReductions from './MonsterDefensiveReductions';
import MonsterSelect from './MonsterSelect';

interface MonsterAccordionProps extends React.PropsWithChildren {
  headerContent: React.ReactNode;
}

const MonsterAccordion: React.FC<MonsterAccordionProps> = observer(({
  headerContent,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-2 text-sm">
      <div className="rounded bg-body-100 dark:bg-dark-500">
        <button
          type="button"
          className={`w-full pt-1 border-b-body-400 dark:border-b-dark-300 px-2 flex text-gray-500 dark:text-gray-300 font-semibold justify-between gap-2 ${isOpen ? 'border-b' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {headerContent}
          <div className="relative top-[-2px]">
            {isOpen ? <IconChevronUp width={20} />
              : <IconChevronDown width={20} />}
          </div>
        </button>
        {isOpen && children}
      </div>
    </div>
  );
});

const MonsterContainer: React.FC = observer(() => (
  <div className="basis-4 flex flex-col grow mt-3 md:grow-0">
    <div
      className="bg-dark-300 sm:rounded-lg mt-6 text-white shadow-lg"
    >
      <MonsterHeader />
      <MonsterNotices />
      <div className="py-4 px-4">
        <div className="mb-4">
          <MonsterSelect />
        </div>
        <div>
          <div className="flex gap-8 flex-wrap justify-center">
            <div className="w-72">
              <div className="flex gap-4">
                <MonsterStatInputs />
              </div>
              <MonsterWeaknessBadge />
              <MonsterAccordion headerContent={(
                <>
                  Attributes
                  {' '}
                  <HelpLink href="https://oldschool.runescape.wiki/w/Monster_attribute" />
                </>
              )}
              >
                <MonsterAttributes />
              </MonsterAccordion>
              <MonsterAccordion headerContent="Defensive Reductions">
                <MonsterDefensiveReductions />
              </MonsterAccordion>
              <MonsterAccordion headerContent="Monster Settings">
                <CustomMonsterInputs key="custom" />
                <MonsterToaInputs key="toa" />
                <MonsterCoxInputs key="cox" />
                <MonsterPartySizeInput key="party-size" />
                <MonsterPhaseSelect key="phase" />
                <MonsterDemonbaneInput key="demonbane" />
                <MonsterCurrentHp key="current-hp" />
              </MonsterAccordion>
              <MonsterAccordion headerContent="Monster Prayers">
                <MonsterPrayers />
              </MonsterAccordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

export default MonsterContainer;
