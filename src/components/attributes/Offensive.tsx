import dagger from '../../public/img/dagger.png';
import scimitar from '../../public/img/scimitar.png';
import warhammer from '../../public/img/warhammer.png';
import magic from '../../public/img/magic.png';
import ranged from '../../public/img/ranged.png';
import Image from 'next/image';

export default function Offensive() {
  return (
    <>
      <h4 className={'font-bold text-center'}>
        Offensive bonuses
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-end'}>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={dagger} alt={'Dagger'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={scimitar} alt={'Scimitar'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={warhammer} alt={'Warhammer'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={magic} alt={'Magic'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} />
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={ranged} alt={'Ranged'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center mt-auto'} />
        </div>
      </div>
    </>
  )
}