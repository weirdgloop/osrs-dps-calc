import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { generateEmptyPlayer, useStore } from '@/state';
import SectionAccordion from '@/app/components/generic/SectionAccordion';
import defence from '@/public/img/bonuses/defence.png';
import attack from '@/public/img/bonuses/attack.png';
import ranged from '@/public/img/bonuses/ranged.png';
import magic from '@/public/img/bonuses/magic.png';
import LazyImage from '@/app/components/generic/LazyImage';
import { IconAlertTriangle } from '@tabler/icons-react';
import NPCVersusPlayerResultsTable from '@/app/components/results/NPCVersusPlayerResultsTable';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { toJS } from 'mobx';

const NPCVersusPlayerResultsContainer: React.FC = observer(() => {
  const store = useStore();
  const { monster, isNonStandardMonster } = store;
  const { showNPCVersusPlayerResults } = store.prefs;

  const monsterJs = toJS(monster);

  /**
   * Get the monster's base max hit, based on a one-time calculation against an empty loadout.
   * Max hit may be different on a per-loadout basis in the future if something like Weaken is used.
   */
  const computedBaseMaxHit = useMemo(() => {
    const calc = new NPCVsPlayerCalc(generateEmptyPlayer(), monsterJs);
    return calc.getNPCMaxHit();
  }, [monsterJs]);

  const renderMonsterStyle = useMemo(() => {
    if (['slash', 'stab', 'crush'].includes(monster.style || '')) {
      return (
        <>
          <img src={attack.src} className="w-5 inline-block" alt="Melee" />
          {' '}
          <span className="capitalize">{monster.style}</span>
        </>
      );
    }
    if (['light', 'standard', 'heavy'].includes(monster.style || '')) {
      return (
        <>
          <img src={ranged.src} className="w-5 inline-block" alt="Ranged" />
          {' '}
          <span className="capitalize">{monster.style}</span>
        </>
      );
    }
    if (monster.style === 'magic') {
      return (
        <>
          <img src={magic.src} className="w-5 inline-block" alt="Magic" />
          {' '}
          <span className="capitalize">{monster.style}</span>
        </>
      );
    }
    return <span className="text-gray-300 italic">Unknown</span>;
  }, [monster.style]);

  const renderWarning = () => {
    if (monster.id !== -1 && monster.maxHit !== undefined && monster.maxHit !== computedBaseMaxHit) {
      return (
        <div
          className="w-full bg-orange-500 text-white px-4 py-1 text-sm border-b border-orange-400 flex items-center gap-2"
        >
          <IconAlertTriangle className="text-orange-200" />
          This calculation uses the max hit shown by Monster Examine, but the wiki reports a different max hit for this monster. Results may be inaccurate.
        </div>
      );
    }

    return (
      <div
        className="w-full bg-yellow-500 text-white px-4 py-1 text-sm border-b border-yellow-400 flex items-center gap-2"
      >
        <IconAlertTriangle className="text-orange-200" />
        <div>
          This is an experimental feature and may not be 100% accurate. Report issues on
          {' '}
          <a href="https://discord.gg/JXeUnR9stP" target="_blank">Discord</a>
          .
        </div>
      </div>
    );
  };

  return (
    <SectionAccordion
      defaultIsOpen={showNPCVersusPlayerResults}
      onIsOpenChanged={(o) => store.updatePreferences({ showNPCVersusPlayerResults: o })}
      title={(
        <div className="flex items-center gap-2">
          <div className="w-6 flex justify-center"><LazyImage src={defence.src} /></div>
          <h3 className="font-serif font-bold">
            Damage taken from
            {' '}
            {monster.name}
          </h3>
        </div>
      )}
    >
      {isNonStandardMonster ? (
        <div
          className="w-full bg-red-500 text-white px-4 py-1 text-sm border-b border-red-400 flex items-center gap-2"
        >
          <IconAlertTriangle className="text-red-200" />
          This monster has non-standard attacks, so we&apos;re currently unable to calculate these metrics.
        </div>
      ) : (
        <>
          {renderWarning()}
          <div>
            <div className="overflow-x-auto max-w-[100vw]">
              <NPCVersusPlayerResultsTable />
            </div>
            <div className="flex-grow text-white m-4 pb-4">
              <h2 className="font-serif font-bold">Additional information</h2>
              <div className="flex flex-wrap gap-2 mt-2 text-sm items-center">
                <div
                  className="border-l-2 bg-dark-500 py-1 px-3 border-blue-300"
                >
                  <span className="text-gray-300">NPC style:</span>
                  {' '}
                  <div className="inline-block gap-1">
                    {renderMonsterStyle}
                  </div>
                </div>
                <div
                  className="border-l-2 bg-dark-500 py-1 px-3 border-blue-300"
                >
                  <span className="text-gray-300">NPC speed:</span>
                  {' '}
                  {monster.speed}
                  {' '}
                  <span className="text-gray-300">
                    (
                    {parseFloat((monster.speed * 0.6).toFixed(1))}
                    s)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </SectionAccordion>
  );
});

export default NPCVersusPlayerResultsContainer;
