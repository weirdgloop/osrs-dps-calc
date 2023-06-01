import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconPlus, IconTrash} from "@tabler/icons-react";
import {calculateCombatLevel} from "@/utils";
import PlayerInnerContainer from "@/app/components/player/PlayerInnerContainer";
import Bonuses from "@/app/components/player/Bonuses";

const LoadoutActionButtons: React.FC = observer(() => {
  const store = useStore();
  const {selectedLoadout, createLoadout, deleteLoadout, canCreateLoadout, canRemoveLoadout} = store;

  return (
      <div className={'flex gap-0.5 text-body-200 mr-4'}>
          <button
              disabled={!canCreateLoadout}
              onClick={() => createLoadout(true, selectedLoadout)}
              className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-green transition-colors'}
              data-tooltip-id={'tooltip'}
              data-tooltip-content={'Add new loadout'}
          >
              <IconPlus aria-label={'Add new loadout'} />
          </button>
          {/*<button*/}
          {/*    disabled={!canCreateLoadout}*/}
          {/*    onClick={() => createLoadout(true, selectedLoadout)}*/}
          {/*    className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-orange transition-colors'}*/}
          {/*    data-tooltip-id={'tooltip'}*/}
          {/*    data-tooltip-content={'Clone loadout'}*/}
          {/*>*/}
          {/*    <IconClipboardCopy/>*/}
          {/*</button>*/}
          <button
              disabled={!canRemoveLoadout}
              onClick={() => deleteLoadout(selectedLoadout)}
              className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-red transition-colors'}
              data-tooltip-id={'tooltip'}
              data-tooltip-content={'Remove loadout'}
          >
              <IconTrash aria-label={'Remove loadout'} />
          </button>
      </div>
  )
})

const PlayerContainer: React.FC = observer(() => {
    const store = useStore();
    const {loadouts, player, selectedLoadout, createLoadout, deleteLoadout, canCreateLoadout, canRemoveLoadout} = store;

    return (
        <div
            className={'bg-tile md:basis-1/4 mx-auto sm:rounded-lg text-black shadow-lg flex flex-col'}>
            <div
                className={'sm:rounded sm:rounded-b-none text-sm font-bold font-serif flex justify-between items-center bg-btns-400 text-white border-b-4 border-orange-300'}
            >
                <div className={'my-1 flex h-full'}>
                    {loadouts.map((l, ix) => {
                        return (
                            <button
                                key={ix}
                                className={`min-w-[40px] text-left first:md:rounded-tl px-6 py-1 first:border-l-0 border-l-2 last:border-r-2 border-body-400 transition-colors ${selectedLoadout === ix ? 'bg-orange-400' : 'bg-btns-400'}`}
                                onClick={() => {store.setSelectedLoadout(ix)}}
                            >
                                {ix + 1}
                            </button>
                        )
                    })}
                </div>
                <LoadoutActionButtons />
            </div>
            <div className={'px-6 py-4 border-b-body-400 border-b flex justify-between items-center font-serif'}>
                <div>
                    <div className={'text-xs font-bold text-gray-500'}>Loadout {selectedLoadout + 1}</div>
                    <h1 className={`text-xl tracking-tight font-bold`}>Player</h1>
                </div>
                <span
                    className={'text-gray-500 font-bold text-sm'}>Level {calculateCombatLevel(player.skills)}</span>
            </div>
            <div className={'flex grow flex-wrap md:flex-nowrap'}>
                <PlayerInnerContainer/>
                <Bonuses/>
            </div>
        </div>
    )
})

export default PlayerContainer;
