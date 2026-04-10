import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconAlertTriangleFilled, IconEdit } from '@tabler/icons-react';
import Modal from '@/app/components/generic/Modal';
import SkillTreeDisplay from '@/app/components/player/demonicPactsLeague/SkillTreeDisplay';
import CurrentEffects from '@/app/components/player/demonicPactsLeague/CurrentEffects';
import PactsSpent from '@/app/components/player/demonicPactsLeague/PactsSpent';
import { useStore } from '@/state';
import CullingSpree from '@/public/img/combat_masteries/culling_spree.png';
import Toggle from '@/app/components/generic/Toggle';
import EquipmentSelect from '@/app/components/player/equipment/EquipmentSelect';
// import ShowIfLeagueEffectEnabled from '@/app/components/player/demonicPactsLeague/ShowIfLeagueEffectEnabled';
import { getCdnImage } from '@/utils';
import { MELEE_WEAPONS } from '@/enums/EquipmentCategory';
import { computed } from 'mobx';
import UserIssueType from '@/enums/UserIssueType';
import localforage from 'localforage';
import NumberInput from '../generic/NumberInput';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BlindbagSelector = observer(() => {
  const store = useStore();
  const { blindbagWeapons } = store.player.leagues.six;

  return (
    <div className="mt-4">
      <h5 className="text-sm font-serif font-bold mb-2">
        Blindbag (
        <span className={blindbagWeapons.length >= 28 ? 'text-red-300' : ''}>{blindbagWeapons.length}</span>
        {' '}
        / 28)
      </h5>
      <div className="flex flex-wrap gap-1 my-2">
        {blindbagWeapons.length ? blindbagWeapons.map((weapon) => (
          <button
            key={weapon.id}
            type="button"
            aria-label={weapon.name}
            className="w-8 h-8 bg-dark-200 border border-dark-400 group rounded flex justify-center p-0.5 cursor-pointer"
            onClick={() => store.toggleLeagues6BlindbagWeapon(weapon)}
          >
            <img
              className="group-hover:opacity-50"
              src={getCdnImage(`equipment/${weapon.image}`)}
              alt={weapon.name}
            />
          </button>
        ))
          : (
            <div
              className="w-8 h-8 bg-dark-200 border border-dark-400 group rounded flex justify-center p-0.5 cursor-pointer"
            />
          )}
      </div>
      <EquipmentSelect
        customAvailableEquipmentFilter={(equipment) => equipment.slot === 'weapon'
                    && equipment.weight > 1
                    && MELEE_WEAPONS.includes(equipment.category)}
        onSelectedItemChange={(item) => {
          const current = blindbagWeapons;
          if (item
                        && current.length < 28
                        && !current.find((w) => w.id === item.equipment.id)
          ) {
            store.updatePlayer({
              leagues: {
                six: {
                  blindbagWeapons: [...current, item.equipment],
                },
              },
            });
          }
        }}
      />
    </div>
  );
});

const DemonicPactsLeague: React.FC = observer(() => {
  const [showCombatMasteriesUI, setShowCombatMasteriesUI] = useState(false);
  const store = useStore();
  const { cullingSpree } = store.player.leagues.six;

  const fromUrlInput = useRef<HTMLInputElement>(null);
  const fromUrlBtn = useRef<HTMLButtonElement>(null);

  const unimplementedPacts = computed(() => store.calc.loadouts[store.selectedLoadout].userIssues?.filter((issue) => issue.type === UserIssueType.LEAGUES_SIX_TALENT_UNSUPPORTED) ?? []).get();

  return (
    <>
      {(unimplementedPacts.length > 0) && (
        <div className="w-full">
          <div className="flex justify-center items-center bg-orange-400 border-b border-orange-300 px-4 py-1">
            <div className="flex-col">
              <IconAlertTriangleFilled className="text-orange-300" />
            </div>
            <div className="flex-col">
              <div className="center px-4 text-xs">
                {'The following Demonic Pacts are not supported: '}
                <ul>
                  {unimplementedPacts.map((issue) => (
                    <li className="list-inside list-disc" key={issue.message}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 mb-4">
        <button
          type="button"
          className="mt-2 w-full text-sm transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] py-1.5 px-2.5 rounded-md dark:bg-dark-300 dark:border-dark-200 flex flex-col gap-2"
          onClick={() => setShowCombatMasteriesUI(true)}
        >
          <div className="flex items-center gap-1">
            <IconEdit size={20} aria-label="Select Demonic Pacts" />
            <span>
              Select Demonic Pacts (
              <PactsSpent short />
              )
            </span>
          </div>
        </button>
        <button
          type="button"
          className="w-full"
          aria-label="Select Demonic Pacts"
          onClick={() => setShowCombatMasteriesUI(true)}
        >
          <div className="w-full aspect-square mt-2 pointer-events-none"><SkillTreeDisplay interactive={false} /></div>
        </button>

        <Toggle
          checked={cullingSpree}
          setChecked={(c) => store.updatePlayer({ leagues: { six: { cullingSpree: c } } })}
          label={(
            <>
              <img
                src={CullingSpree.src}
                alt="Culling Spree"
                className={`inline-block w-6 object-contain ${cullingSpree ? '' : 'grayscale opacity-60'}`}
              />
              {' '}
              Culling Spree
            </>
          )}
        />

        <div className="flex items-center gap-2 mt-2">
          <NumberInput
            aria-labelledby="distanceToEnemyLabel"
            className="form-control w-12 text-centerl"
            id="distanceToEnemy"
            min={0}
            max={99}
            title="Distance to enemy"
            value={store.player.leagues.six.distanceToEnemy}
            onChange={(v) => {
              store.updatePlayer({ leagues: { six: { distanceToEnemy: v } } });
            }}
          />
          <span id="distanceToEnemyLabel">Distance to Enemy</span>
        </div>

        {/* @eslint-disable */}
        {/* <ShowIfLeagueEffectEnabled leaguesEffect="talent_free_random_weapon_attack_chance"> */}
        {/*  <BlindbagSelector /> */}
        {/* </ShowIfLeagueEffectEnabled> */}
        {/* @eslint-enable */}

        <Modal
          isOpen={showCombatMasteriesUI}
          setIsOpen={setShowCombatMasteriesUI}
          title={(
            <div className="w-full mx-4 flex flex-row gap-4 justify-between items-center">
              <div className="flex-1 justify-self-start flex justify-center items-center">
                <a
                  href="https://tools.runescape.wiki/demonic-pacts/"
                  target="_blank"
                  className="text-orange-200 flex shrink justify-center items-center gap-1 underline hover:text-orange-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 inline"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  </svg>
                  Pacts Planner
                </a>
              </div>
              <div className="flex-1 justify-self-center">
                <h4 className="font-bold font-serif">Demonic Pacts</h4>
              </div>
              <div className="flex-1 justify-self-end pr-6"><PactsSpent /></div>
            </div>
          )}
          maxWidth="max-w-[90vh]"
        >
          <div className="text-sm mb-4 flex items-center justify-end gap-2">
            <p>Import from Pacts Planner</p>
            <div>
              <button
                type="button"
                className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] py-1.5 px-2.5 rounded-md dark:bg-dark-300 dark:border-dark-200 w-fit"
                onClick={async () => {
                  const data: string[] | null = await localforage.getItem('demonicpacts-nodes');
                  if (data) {
                    store.updatePlayer({
                      leagues: {
                        six: {
                          selectedNodeIds: new Set(data as string[]),
                        },
                      },
                    });
                    store.recalculateLeaguesEffects();
                  }
                }}
              >
                Current tree
              </button>
            </div>
            <p>or</p>
            <div className="flex gap-1 items-center">
              <input
                ref={fromUrlInput}
                type="text"
                className="form-control rounded w-full"
                placeholder="Planner URL"
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    fromUrlBtn.current?.click();
                  }
                }}
              />
              <button
                ref={fromUrlBtn}
                type="button"
                className="transition-all hover:scale-105 hover:text-white border border-body-500 bg-[#3e2816] py-1.5 px-2.5 rounded-md dark:bg-dark-300 dark:border-dark-200 w-32"
                onClick={() => {
                  const input = fromUrlInput.current?.value;
                  if (!input) return;

                  try {
                    const url = new URL(input);
                    if (url.hostname !== 'tools.runescape.wiki' || !url.searchParams.has('n')) {
                      return;
                    }
                    console.log(url);
                    const nodes = url.searchParams.get('n')?.split('-').map((n) => `node${parseInt(n.replace('"', ''))}`);
                    if (!nodes) return;
                    store.updatePlayer({
                      leagues: {
                        six: {
                          selectedNodeIds: new Set(nodes),
                        },
                      },
                    });
                    store.recalculateLeaguesEffects();
                  } catch (e) {
                    // Do nothing
                  }
                }}
              >
                From URL
              </button>
            </div>
          </div>
          <div className="flex flex-col h-[80vh]">
            <div className="flex-grow outline outline-gray-500"><SkillTreeDisplay interactive /></div>
            <div
              className="max-h-64 flex mt-4 h-auto rounded bg-[#1b1612] text-white outline outline-[#736559] shadow-xl"
            >
              <CurrentEffects />
            </div>
          </div>
        </Modal>
      </div>
      <CurrentEffects />
    </>
  );
});

export default DemonicPactsLeague;
