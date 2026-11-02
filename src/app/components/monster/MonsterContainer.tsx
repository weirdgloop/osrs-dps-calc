import React from 'react';
import MonsterHeader from '@/app/components/monster/MonsterHeader';
import MonsterNotices from '@/app/components/monster/MonsterNotices';
import MonsterSelect from '@/app/components/monster/MonsterSelect';
import MonsterStatInputs from '@/app/components/monster/stats/MonsterStatInputs';
import WeaknessBadge from '@/app/components/monster/WeaknessBadge';
import MonsterAttributes from '@/app/components/monster/MonsterAttributes';
import DefensiveReductions from '@/app/components/monster/DefensiveReductions';
import MonsterSettings from '@/app/components/monster/settings/MonsterSettings';

const MonsterContainer: React.FC = () => (
  <div className="basis-4 flex flex-col grow mt-3 md:grow-0">
    <div
      className="bg-tile dark:bg-dark-300 sm:rounded-lg mt-6 text-black dark:text-white shadow-lg"
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
              <MonsterStatInputs />
              <WeaknessBadge />
              <div className="mt-2 text-sm">
                <MonsterAttributes />
              </div>
              <div className="mt-1 text-sm">
                <DefensiveReductions />
              </div>
              <div className="mt-1 text-sm">
                <MonsterSettings />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MonsterContainer;
