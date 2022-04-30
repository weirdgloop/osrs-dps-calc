import Image from 'next/image';

import Offensive from './attributes/Offensive';
import Defensive from './attributes/Defensive';
import OtherBonuses from './attributes/OtherBonuses';

export default function BoxCombatAttributes() {
  return (
    <div className={''}>
      <div className={'bg-gray-600 rounded p-4 text-white'}>
        <h3 className={'text-center font-semibold'}>
          Combat Attributes
        </h3>
      </div>
      <div className={'bg-gray-300 rounded mt-2 p-4'}>
        <Offensive />
        <Defensive />
        <OtherBonuses />
        <h4 className={'font-bold text-center mt-3'}>
          Attack speed
        </h4>
        <div className={'flex justify-center mt-1'}>
          <select className={'rounded'}>
            <option value={4}>4 (2.4 seconds)</option>
          </select>
        </div>
      </div>
    </div>
  )
}