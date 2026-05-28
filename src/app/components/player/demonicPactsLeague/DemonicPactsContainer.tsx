import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';

import localforage from 'localforage';
import PactsSpent from '@/app/components/player/demonicPactsLeague/pactSelector/PactsSpent';
import Modal from '@/app/components/generic/Modal';
import { usePlayer } from '@/state/LoadoutStore';
import SkillTreeDisplay from '@/app/components/player/demonicPactsLeague/pactSelector/SkillTreeDisplay';
import SearchBox from '@/app/components/player/demonicPactsLeague/pactSelector/SearchBox';
import CurrentEffects from '@/app/components/player/demonicPactsLeague/pactSelector/CurrentEffects';
import { IconEdit } from '@tabler/icons-react';

interface DemonicPactsModalProps {
  showCombatMasteriesUI: boolean;
  setShowCombatMasteriesUI: (show: boolean) => void;
}

// todo(mobx)
const DemonicPactsModal: React.FC<DemonicPactsModalProps> = observer((props) => {
  const { showCombatMasteriesUI, setShowCombatMasteriesUI } = props;
  const { updateBasePlayer } = usePlayer();

  const fromUrlInput = useRef<HTMLInputElement>(null);
  const fromUrlBtn = useRef<HTMLButtonElement>(null);

  return (
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
                updateBasePlayer({
                  leagues: {
                    six: {
                      selectedNodeIds: new Set(data as string[]),
                    },
                  },
                });
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
                updateBasePlayer({
                  leagues: {
                    six: {
                      selectedNodeIds: new Set(nodes),
                    },
                  },
                });
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
          <SearchBox />
        </div>
        <div
          className="max-h-64 flex mt-4 h-auto rounded bg-[#1b1612] text-white outline outline-[#736559] shadow-xl"
        >
          <CurrentEffects />
        </div>
      </div>
    </Modal>
  );
});

const DemonicPactsContainer: React.FC = observer(() => {
  const [showCombatMasteriesUI, setShowCombatMasteriesUI] = useState(false);

  return (
    <>
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
    </>
  );
});

export default DemonicPactsContainer;
