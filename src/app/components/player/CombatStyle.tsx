import {PlayerCombatStyle} from "@/types/Player";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconCircleCheck, IconCircleCheckFilled} from "@tabler/icons-react";

interface CombatStyleProps {
    style: PlayerCombatStyle;
}

export const CombatStyle: React.FC<CombatStyleProps> = observer((props) => {
    const store = useStore();
    const {player} = store;
    const {style} = props;
    const [hovering, setHovering] = useState(false);
    const active = player.style.name === style.name;

    return (
        <button
            className={`flex items-center justify-between text-sm p-2 px-6 text-left transition-[background] first:border-t border-b text-black border-body-200 bg-gray-100 hover:bg-gray-200`}
            onClick={() => store.updatePlayer({style})}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div>
                <div className={'font-bold font-serif'}>
                    {style.name}
                </div>
                <div className={'text-xs'}>
                    {style.type.charAt(0).toUpperCase() + style.type.slice(1)}, {style.stance}
                </div>
            </div>
            {(hovering || active) && (
                <div>
                    {active ? <IconCircleCheckFilled className={'text-green-400'}/> :
                        <IconCircleCheck className={'text-gray-300'}/>}
                </div>
            )}
        </button>
    )
})