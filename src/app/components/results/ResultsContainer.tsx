import React, {PropsWithChildren, useState} from 'react';
import HitDistribution from './HitDistribution';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import LoadoutComparison from './LoadoutComparison';
import MultiSelect from "@/app/components/generic/MultiSelect";

enum AdditionalDataTypes {
  HIT_DISTRIBUTION,
  LOADOUT_COMPARISON,
}

interface StatDisplay {
  name: string | JSX.Element;
}

const StatDisplay: React.FC<PropsWithChildren<StatDisplay>> = (props) => {
  const {name, children} = props;
  return (
    <div className={'flex gap-4 px-6 justify-between'}>
      <div className={'basis-60'}>
        <h3 className={'font-bold'}>{name}</h3>
      </div>
      <div className={'font-mono'}>
        {children}
      </div>
    </div>

  )
}

const BoxResults = observer(() => {
  const store = useStore();
  const [additionalData, setAdditionalData] = useState<AdditionalDataTypes[]>([]);

  // const additionalDropdownChange = (c: MultiValue<{label: string, value: AdditionalDataTypes}>) => {
  //   setAdditionalData(c.map((d) => d.value));
  // }

  return (
    <div className={'my-4'}>
      <div className={'flex gap-4 flex-wrap'}>
        <div className={'grow bg-tile rounded shadow-lg basis-1/2'}>
          <div className={'px-6 py-4 bg-btns-400 text-white rounded-t border-b-4 border-body-500'}>
            <h3 className={'font-serif font-bold'}>Stats</h3>
          </div>
          <div className={'pt-4 text-sm'}>
            <StatDisplay name={'Max hit'}>
              <p>43</p>
            </StatDisplay>
            <StatDisplay name={'Accuracy'}>
              <p>82.75%</p>
            </StatDisplay>
            <StatDisplay name={'Damage per second (DPS)'}>
              <p className={'text-orange-500 font-bold'}>5.9304</p>
            </StatDisplay>
            <StatDisplay name={'Average time-to-kill (TTK)'}>
              <p>56.25 seconds</p>
            </StatDisplay>
            <StatDisplay name={'Average damage taken'}>
              <p>18.71</p>
            </StatDisplay>
          </div>
          <div className={'px-6 my-6 border-t pt-4 border-body-400'}>
            <h3 className={'font-serif font-bold mb-2'}>Additional outputs and graphs</h3>
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
        </div>
        {
          additionalData.includes(AdditionalDataTypes.HIT_DISTRIBUTION) && (
            <div className={'grow bg-tile rounded shadow-lg max-w-[100vw]'}>
              <div className={'px-6 py-4 bg-btns-400 text-white rounded-t border-b-4 border-body-500'}>
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
            <div className={'grow bg-tile rounded shadow-lg max-w-[100vw]'}>
              <div className={'px-6 py-4 bg-btns-400 text-white rounded-t border-b-4 border-body-500'}>
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