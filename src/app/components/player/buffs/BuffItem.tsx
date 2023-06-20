import {Potion} from "@/enums/Potion";
import {StaticImageData} from "next/image";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import LazyImage from "@/app/components/generic/LazyImage";
import {IconCircleCheck, IconCircleCheckFilled} from "@tabler/icons-react";

interface IBuffItemProps {
  potion: Potion;
  name: string;
  image: StaticImageData;
  tooltip?: string;
}

const BuffItem: React.FC<IBuffItemProps> = observer((props) => {
  const {potion, name, tooltip, image} = props;
  const store = useStore();
  const [hovering, setHovering] = useState(false);
  const {buffs} = store.player;
  const active = buffs.potions.includes(potion);

  return (
    <button
      data-tooltip-id={'tooltip'}
      data-tooltip-content={tooltip}
      data-tooltip-place={'right'}
      onClick={() => store.togglePlayerPotion(potion)}
      className={`w-full px-4 py-1 first:mt-0 first:border-0 border-t dark:border-dark-200 flex gap-4 items-center hover:bg-gray-200 dark:hover:bg-dark-400`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={'w-[20px] h-[23px] flex'}>
        <LazyImage responsive={true} src={image.src} alt={name}/>
      </div>
      <div className={'text-xs'}>
        {name}
      </div>
      <div className={'ml-auto h-6'}>
        {(hovering || active) && (
          active ? <IconCircleCheckFilled className={'text-green-400 dark:text-green-200 w-4'}/> :
            <IconCircleCheck className={'text-gray-300 w-4'}/>
        )}
      </div>
    </button>
  )
})

export default BuffItem;