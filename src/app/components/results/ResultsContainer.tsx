import React, {PropsWithChildren, useState} from 'react';
import {observer} from 'mobx-react-lite';
import MultiSelect from "@/app/components/generic/MultiSelect";
import dynamic from "next/dynamic";
import {
    IconChartBar,
    IconClockHour3,
    IconEye,
    IconHeartMinus,
    IconSword,
    IconTimeline
} from "@tabler/icons-react";

const HitDistribution = dynamic(() => import('@/app/components/results/HitDistribution'));
const LoadoutComparison = dynamic(() => import('@/app/components/results/LoadoutComparison'));

enum AdditionalDataTypes {
  HIT_DISTRIBUTION,
  LOADOUT_COMPARISON,
}

interface StatDisplay {
  name: string | JSX.Element;
  icon?: JSX.Element;
}

const StatDisplay: React.FC<PropsWithChildren<StatDisplay>> = (props) => {
  const {icon, name, children} = props;
  return (
    <div className={'grow bg-white shadow md:rounded items-center justify-center flex flex-col text-center min-h-[85px]'}>
      <div className={'py-2 bg-btns-400 border-b-2 border-body-500 text-white md:rounded-t w-full'}>
        <h3 className={'font-bold text-md select-none flex justify-center gap-1'}>
          <div className={'inline-block'}>{icon}</div>
          <div>{name}</div>
        </h3>
      </div>
      <div className={'p-2 flex justify-center items-center grow'}>
        <div className={'font-mono'}>
          {children}
        </div>
      </div>
    </div>

  )
}

const BoxResults = observer(() => {
  return (
    <div className={'my-4'}>
      <div className={'pb-4 text-sm flex gap-2 flex-wrap'}>
        <StatDisplay name={'Max hit'} icon={<IconSword />}>
          <p>43</p>
        </StatDisplay>
        <StatDisplay name={'Accuracy'} icon={<IconEye />}>
          <p>82.75%</p>
        </StatDisplay>
        <StatDisplay name={'Damage per second (DPS)'} icon={<IconTimeline />}>
          <p className={'text-orange-500 font-bold'}>5.9304</p>
        </StatDisplay>
        <StatDisplay name={'Average time-to-kill (TTK)'} icon={<IconClockHour3 />}>
          <p>56.25 seconds</p>
        </StatDisplay>
        <StatDisplay name={'Average damage taken'} icon={<IconHeartMinus />}>
          <p>18.71</p>
        </StatDisplay>
      </div>
    </div>
  )
})

export default BoxResults;