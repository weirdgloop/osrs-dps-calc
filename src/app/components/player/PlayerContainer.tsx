import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import Select from "@/app/components/generic/Select";
import LoadoutSelect from "@/app/components/player/LoadoutSelect";
import {IconClipboardCopy, IconPlus, IconTrash} from "@tabler/icons-react";
import {calculateCombatLevel} from "@/utils";
import PlayerInnerContainer from "@/app/components/player/PlayerInnerContainer";
import Bonuses from "@/app/components/player/Bonuses";

const PlayerContainer: React.FC = observer(() => {
    const store = useStore();
    const {player, selectedLoadout, createLoadout, deleteLoadout, canCreateLoadout, canRemoveLoadout} = store;

    return (
        <div
            className={'bg-tile md:basis-1/4 basis-auto flex-initial md:rounded-lg text-black shadow-lg flex flex-col'}>
            <div
                className={'px-6 py-2 md:rounded md:rounded-b-none text-sm font-bold font-serif flex justify-between items-center bg-btns-400 text-white rounded-t border-b-4 border-body-500'}>
                <Select
                    items={store.loadouts.map((l, ix) => (
                        {label: `Loadout ${ix + 1}`, value: ix}
                    ))}
                    CustomSelectComponent={LoadoutSelect}
                    menuClassName={'left-[-8px]'}
                    onSelectedItemChange={(i) => {
                        if (i) store.setSelectedLoadout(i?.value);
                    }}
                />
                <div className={'flex gap-0.5 text-body-200'}>
                    <button
                        disabled={!canCreateLoadout}
                        onClick={() => createLoadout(true)}
                        className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-green transition-colors'}
                        data-tooltip-id={'tooltip'}
                        data-tooltip-content={'Add new loadout'}
                    >
                        <IconPlus/>
                    </button>
                    <button
                        disabled={!canCreateLoadout}
                        onClick={() => createLoadout(true, selectedLoadout)}
                        className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-orange transition-colors'}
                        data-tooltip-id={'tooltip'}
                        data-tooltip-content={'Clone loadout'}
                    >
                        <IconClipboardCopy/>
                    </button>
                    <button
                        disabled={!canRemoveLoadout}
                        onClick={() => deleteLoadout(selectedLoadout)}
                        className={'disabled:cursor-not-allowed disabled:text-btns-100 hover:text-red transition-colors'}
                        data-tooltip-id={'tooltip'}
                        data-tooltip-content={'Remove loadout'}
                    >
                        <IconTrash/>
                    </button>
                </div>
            </div>
            <div className={'px-6 py-4 border-b-body-400 border-b flex justify-between items-center'}>
                <h1 className={`font-serif text-xl tracking-tight font-bold`}>Player</h1>
                <span
                    className={'text-gray-500 font-bold font-serif text-sm'}>Level {calculateCombatLevel(player.skills)}</span>
            </div>
            <div className={'flex grow flex-wrap md:flex-nowrap'}>
                <PlayerInnerContainer/>
                <Bonuses/>
            </div>
        </div>
    )
})

export default PlayerContainer;
