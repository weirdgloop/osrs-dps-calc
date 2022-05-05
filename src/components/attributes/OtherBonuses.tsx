import strength from '@/img/strength.png';
import rangedStrength from '@/img/ranged_strength.png';
import magicStrength from '@/img/magic_strength.png';
import prayer from '@/img/prayer.png';
import Image from 'next/image';

export default function OtherBonuses() {
  return (
    <>
      <h4 className={'font-bold text-center mt-3'}>
        Other bonuses
      </h4>
      <div className={'flex gap-2 mt-3 text-center items-end'}>
        <div className={'grow p-2'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={strength} alt={'Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} />
        </div>
        <div className={'grow p-2'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={rangedStrength} alt={'Ranged Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} />
        </div>
        <div className={'grow p-2'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={magicStrength} alt={'Magic Strength'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} />
        </div>
        <div className={'grow p-2'}>
          <div className={'flex justify-center mb-2'}>
            <Image src={prayer} alt={'Prayer'}  />
          </div>
          <input type={'number'} className={'rounded w-full text-center'} />
        </div>
      </div>
    </>
  )
}