import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconCircleCheck, IconCircleCheckFilled} from "@tabler/icons-react";

import LazyImage from "@/app/components/generic/LazyImage";
import {CombatStyleMap, PlayerCombatStyle} from "@/types/PlayerCombatStyle";
import {StaticImageData} from "next/image";

interface CombatStyleProps {
    style: PlayerCombatStyle;
}

export const CombatStyle: React.FC<CombatStyleProps> = observer((props) => {
    const store = useStore();
    const {player} = store;
    const {style} = props;

    const [hovering, setHovering] = useState(false);
    const [styleImage, setStyleImage] = useState<string | null>(null);

    const active = player.style.name === style.name;

    useEffect(() => {
        // Import the combat style image dynamically using the path, because there are a lot of them
        const getStyleImage = async () => {
            const path = CombatStyleMap[player.equipment.weapon.category][style.name];
            console.log('path', path);
            if (path === undefined) {
                setStyleImage('');
                return;
            }
            try {
                const r: StaticImageData = (await import(`@/public/img/styles/${path.image}.png`)).default;
                setStyleImage(r ? r.src : '');
            } catch (e) {
                setStyleImage('');
            }
        }

        getStyleImage();
    }, [style.name, player.equipment.weapon.category]);

    return (
        <button
            className={`flex gap-4 items-center text-sm p-2 px-6 text-left transition-[background] first:border-t border-b text-black border-body-200 bg-gray-100 hover:bg-gray-200`}
            onClick={() => store.updatePlayer({style})}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={'h-[15px] w-[15px]'}>
                {styleImage && <LazyImage responsive={true} src={styleImage} />}
            </div>
            <div>
                <div className={'font-bold font-serif'}>
                    {style.name}
                </div>
                <div className={'text-xs'}>
                    {style.type.charAt(0).toUpperCase() + style.type.slice(1)}, {style.stance}
                </div>
            </div>
            {(hovering || active) && (
                <div className={'ml-auto'}>
                    {active ? <IconCircleCheckFilled className={'text-green-400'}/> :
                        <IconCircleCheck className={'text-gray-300'}/>}
                </div>
            )}
        </button>
    )
})