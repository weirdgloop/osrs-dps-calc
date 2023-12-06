import Image, {StaticImageData} from "next/image";
import React from "react";
import {observer} from "mobx-react-lite";
import {IconCircleCheckFilled} from "@tabler/icons-react";

interface IGridItemProps {
  item: any;
  name: string;
  image: string | StaticImageData;
  onClick: (item: any) => void;
  active: boolean;
}

/**
 * Reusable component for clickable cells of certain grids, such as the Prayer grid.
 */
const GridItem: React.FC<IGridItemProps> = observer((props) => {
  const {item, name, image, active, onClick} = props;

  return (
    <div
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
      onClick={() => onClick(item)}
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

export default GridItem;
