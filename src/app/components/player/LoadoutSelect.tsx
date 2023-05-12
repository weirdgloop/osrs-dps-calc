import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconChevronDown} from "@tabler/icons-react";

const LoadoutSelect: React.FC<{ getToggleButtonProps: () => any }> = observer((props) => {
    const store = useStore();
    const {selectedLoadout} = store;
    const {getToggleButtonProps} = props;

    return (
        <div
            {...getToggleButtonProps()}
            className={'flex gap-1 bg-[#3e2816] justify-center items-center cursor-pointer border border-body-500 shadow rounded px-2 py-1 relative left-[-8px]'}
        >
            <div>
                Loadout <span className={'text-body-200'}>{selectedLoadout + 1}</span>
            </div>
            <IconChevronDown className={'inline-block w-5 text-gray-300 relative'}/>
        </div>
    )
})

export default LoadoutSelect;