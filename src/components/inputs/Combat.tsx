import Image from 'next/image';
import chop from '../../public/img/styles/chop.png';
import lunge from '../../public/img/styles/lunge.png';
import slash from '../../public/img/styles/slash.png';
import block from '../../public/img/styles/block.png';

export default function Combat() {
  return (
    <>
      <h4 className={'font-bold text-center'}>
        Combat style
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-center'}>
        <div className={'grow rounded bg-gray-200 p-2 shadow cursor-pointer'}>
          <Image src={chop} alt={'Chop'}  />
          <span className={'text-sm block'}>Chop</span>
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow cursor-pointer'}>
          <Image src={lunge} alt={'Lunge'}  />
          <span className={'text-sm block'}>Lunge</span>
        </div>
      </div>
      <div className={'flex gap-2 mt-3 text-center items-center'}>
        <div className={'grow rounded bg-gray-200 p-2 shadow cursor-pointer'}>
          <Image src={slash} alt={'Slash'}  />
          <span className={'text-sm block'}>Slash</span>
        </div>
        <div className={'grow rounded bg-gray-200 p-2 shadow cursor-pointer'}>
          <Image src={block} alt={'Block'}  />
          <span className={'text-sm block'}>Block</span>
        </div>
      </div>
    </>
  )
}