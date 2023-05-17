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
  const [additionalData, setAdditionalData] = useState<AdditionalDataTypes[]>([]);

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
      <div className={'max-w-xl mx-auto bg-gray-700 md:rounded p-4 shadow mb-4'}>
        <h3 className={'font-bold mb-2 text-white text-sm'}>
            <IconChartBar className={'inline-block mr-1'} />
            Toggle additional data and graphs
        </h3>
        <MultiSelect
            id={'results-outputs'}
            items={[{
              label: 'Hit distribution graph',
              value: AdditionalDataTypes.HIT_DISTRIBUTION
            }, {
              label: 'Loadout comparison graph',
              value: AdditionalDataTypes.LOADOUT_COMPARISON
            }]}
            onSelectedItemChange={(it) => {
              if (it) setAdditionalData(it.map((i) => i.value));
            }}
        />
      </div>
      <div className={'flex gap-4 flex-wrap'}>
        {
          additionalData.includes(AdditionalDataTypes.HIT_DISTRIBUTION) && (
            <div className={'grow bg-tile md:rounded shadow-lg max-w-[100vw]'}>
              <div className={'px-6 py-4 bg-gray-700 text-white md:rounded-t border-b-4 border-gray-300'}>
                <h3 className={'font-serif font-bold'}>Hit Distribution</h3>
              </div>
              <div className={'px-6 py-4'}>
                <p className={'text-xs mb-4 text-gray-500'}>
                  This graph shows the probabilities of dealing specific damage to the monster.
                </p>
                <HitDistribution />
              </div>
            </div>
          )
        }
        {
          additionalData.includes(AdditionalDataTypes.LOADOUT_COMPARISON) && (
            <div className={'grow bg-tile md:rounded shadow-lg max-w-[100vw]'}>
              <div className={'px-6 py-4 bg-gray-700 text-white md:rounded-t border-b-4 border-gray-300'}>
                <h3 className={'font-serif font-bold'}>Loadout Comparison</h3>
              </div>
              <div className={'px-6 py-4'}>
                <LoadoutComparison />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
})

export default BoxResults;