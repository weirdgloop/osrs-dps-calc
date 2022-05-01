import Image from 'next/image';

import {PRAYERS} from '@/lib/constants';

export default function Prayers() {
  return (
    <>
      <h4 className={'font-bold text-center'}>
        Prayers
      </h4>
      <div className={'flex flex-wrap gap-2 mt-3 text-center items-center justify-center'}>
        {
          Object.entries(PRAYERS).map(([name, info], i) => {
            return <div key={i} style={{
              flex: '0 0 20%'
            }}>
              <Image src={info.img} alt={name} />
            </div>
          })
        }
      </div>
    </>
  )
}