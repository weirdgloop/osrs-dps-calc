import Image, {StaticImageData} from "next/image";
import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconCircleCheckFilled} from "@tabler/icons-react";
import {TrailblazerRelic} from "@/enums/TrailblazerRelic";

interface ITrailblazerRelicItemProps {
  relic: TrailblazerRelic;
  name: string;
  image: string | StaticImageData;
}

const TrailblazerRelicItem: React.FC<ITrailblazerRelicItemProps> = observer((props) => {
  const {relic, name, image} = props;
  const store = useStore();
  const {trailblazerRelics} = store.player;
  const active = trailblazerRelics.includes(relic);

  return (
    <div
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
      onClick={() => store.togglePlayerTrailblazerRelic(relic)}
      className={`cursor-pointer w-[28px] h-[23px] flex justify-center items-center`}
    >
      <div className={'relative'}>
        {active && <IconCircleCheckFilled
            className={'filter drop-shadow absolute top-[-10px] left-[-12px] text-green-400 dark:text-green-200 w-5'}/>}
        <Image src={image} alt={name}/>
      </div>
    </div>
  )
})

export default TrailblazerRelicItem;
