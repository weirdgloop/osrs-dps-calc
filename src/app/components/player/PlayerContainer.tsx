import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {calculateCombatLevel} from "@/utils";
import PlayerInnerContainer from "@/app/components/player/PlayerInnerContainer";
import {IconPlus, IconTrash} from "@tabler/icons-react";

const PlayerContainer: React.FC = observer(() => {
    const store = useStore();
    const {loadouts, prefs, player, selectedLoadout, canCreateLoadout, canRemoveLoadout, createLoadout, deleteLoadout} = store;

    return (
      <div className={'flex flex-col w-[350px]'}>
        <div
          className={'sm:rounded sm:rounded-b-none text-sm font-bold font-serif flex gap-2 items-center bg-transparent text-white border-b-4 border-orange-300 dark:border-orange-700'}
        >
          <div className={'my-1 flex h-full'}>
            {loadouts.map((l, ix) => {
              return (
                <button
                  key={ix}
                  className={`min-w-[40px] text-left first:md:rounded-tl px-4 py-1 border-l-2 first:border-l-0 last:rounded-tr border-body-100 dark:border-dark-300 transition-colors ${selectedLoadout === ix ? 'bg-orange-400 dark:bg-orange-700' : 'bg-btns-400 dark:bg-dark-400'}`}
                  onClick={() => {
                    store.setSelectedLoadout(ix)
                  }}
                >
                  {ix + 1}
                </button>
              )
            })}
          </div>
          <div>
            <button
              disabled={!canCreateLoadout}
              onClick={() => createLoadout(true, selectedLoadout)}
              className={'disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-body-200 dark:disabled:text-dark-500 hover:text-green transition-colors'}
              data-tooltip-id={'tooltip'}
              data-tooltip-content={'Add new loadout'}
            >
              <IconPlus aria-label={'Add new loadout'}/>
            </button>
          </div>
        </div>
        <div
          className={'bg-tile sm:rounded-b-lg dark:bg-dark-300 text-black dark:text-white shadow-lg flex flex-col min-h-[700px]'}>
          <div
            className={'px-5 py-3 border-b-body-400 dark:border-b-dark-200 border-b flex justify-between items-center font-serif'}>
            <div>
              <h1 className={`tracking-tight font-bold`}>Loadout {selectedLoadout + 1}</h1>
              <div className={'text-xs font-bold text-gray-500 dark:text-gray-300'}>Level {calculateCombatLevel(player.skills)}</div>
            </div>
            <div>
              <button
                disabled={!canRemoveLoadout}
                onClick={() => deleteLoadout(selectedLoadout)}
                className={'disabled:cursor-not-allowed text-body-500 dark:text-dark-100 disabled:text-btns-100 dark:disabled:text-dark-500 hover:text-red transition-colors'}
                data-tooltip-id={'tooltip'}
                data-tooltip-content={'Remove loadout'}
              >
                <IconTrash aria-label={'Remove loadout'}/>
              </button>
            </div>
          </div>
          <PlayerInnerContainer/>
        </div>
      </div>
    )
})

export default PlayerContainer;
