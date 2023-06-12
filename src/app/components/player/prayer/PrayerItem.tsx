import {Prayer} from "@/enums/Prayer";
import Image, {StaticImageData} from "next/image";
import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@/state";
import {IconCircleCheckFilled} from "@tabler/icons-react";

interface IPrayerItemProps {
  prayer: Prayer;
  name: string;
  image: string | StaticImageData;
}

const PrayerItem: React.FC<IPrayerItemProps> = observer((props) => {
  const {prayer, name, image} = props;
  const store = useStore();
  const {prayers} = store.player;
  const active = prayers.includes(prayer);

  return (
    <div
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
      onClick={() => store.togglePlayerPrayer(prayer)}
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

export default PrayerItem;