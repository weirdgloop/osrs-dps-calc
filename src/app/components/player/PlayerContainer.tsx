import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {calculateCombatLevel} from "@/utils";
import PlayerInnerContainer from "@/app/components/player/PlayerInnerContainer";
import Bonuses from "@/app/components/player/Bonuses";
import {LoadoutActionButtons} from "@/app/components/player/LoadoutActionButtons";

const PlayerContainer: React.FC = observer(() => {
    const store = useStore();
    const {loadouts, player, selectedLoadout} = store;

    return (
        <div
            className={'bg-tile md:basis-1/4 mx-auto sm:rounded-lg dark:bg-dark-300 text-black dark:text-white shadow-lg flex flex-col'}>
            <div
                className={'sm:rounded sm:rounded-b-none text-sm font-bold font-serif flex justify-between items-center bg-btns-400 dark:bg-dark-400 text-white border-b-4 border-orange-300 dark:border-orange-700'}
            >
                <div className={'my-1 flex h-full'}>
                    {loadouts.map((l, ix) => {
                        return (
                            <button
                                key={ix}
                                className={`min-w-[40px] text-left first:md:rounded-tl px-6 py-1 first:border-l-0 border-l-2 last:border-r-2 border-body-400 dark:border-dark-500 transition-colors ${selectedLoadout === ix ? 'bg-orange-400 dark:bg-orange-900' : 'bg-btns-400 dark:bg-dark-400'}`}
                                onClick={() => {store.setSelectedLoadout(ix)}}
                            >
                                {ix + 1}
                            </button>
                        )
                    })}
                </div>
                <LoadoutActionButtons />
            </div>
            <div className={'px-6 py-4 border-b-body-400 dark:border-b-dark-200 border-b flex justify-between items-center font-serif'}>
                <div>
                    <div className={'text-xs font-bold text-gray-500 dark:text-gray-300'}>Loadout {selectedLoadout + 1}</div>
                    <h1 className={`text-xl tracking-tight font-bold`}>Player</h1>
                </div>
                <span
                    className={'text-gray-500 dark:text-gray-300 font-bold text-sm'}>Level {calculateCombatLevel(player.skills)}</span>
            </div>
            <div className={'flex grow flex-wrap md:flex-nowrap'}>
                <PlayerInnerContainer />
                <Bonuses />
            </div>
        </div>
    )
})

export default PlayerContainer;
