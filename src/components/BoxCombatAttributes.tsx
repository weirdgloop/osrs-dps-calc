import React, {useEffect, useState} from 'react';
import Image, {StaticImageData} from 'next/image';
import dagger from '@/img/dagger.png';
import scimitar from '@/img/scimitar.png';
import warhammer from '@/img/warhammer.png';
import magic from '@/img/magic.png';
import ranged from '@/img/ranged.png';
import strength from '@/img/strength.png';
import rangedStrength from '@/img/ranged_strength.png';
import magicStrength from '@/img/magic_strength.png';
import prayer from '@/img/prayer.png';
import AttributeInput from '@/components/inputs/AttributeInput';
import HelpLink from '@/components/HelpLink';

const Offensive: React.FC = () => {
  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-400'}>Offensive</p>
      <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
        <AttributeInput name={'Dagger'} image={dagger} />
        <AttributeInput name={'Scimitar'} image={scimitar} />
        <AttributeInput name={'Warhammer'} image={warhammer} />
        <AttributeInput name={'Magic'} image={magic} />
        <AttributeInput name={'Ranged'} image={ranged} />
      </div>
    </div>
  )
}

const Defensive: React.FC = () => {
  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-400'}>Defensive</p>
      <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
        <AttributeInput name={'Dagger'} image={dagger} />
        <AttributeInput name={'Scimitar'} image={scimitar} />
        <AttributeInput name={'Warhammer'} image={warhammer} />
        <AttributeInput name={'Magic'} image={magic} />
        <AttributeInput name={'Ranged'} image={ranged} />
      </div>
    </div>
  )
}

const OtherBonuses: React.FC = () => {
  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-400'}>Other</p>
      <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
        <AttributeInput name={'Strength'} image={strength} />
        <AttributeInput name={'Ranged Strength'} image={rangedStrength} />
        <AttributeInput name={'Magic Strength'} image={magicStrength} />
        <AttributeInput name={'Prayer'} image={prayer} />
      </div>
    </div>
  )
}

interface AttackSpeedProgressBarProps {
  speed: number;
}

const AttackSpeedProgressBar: React.FC<AttackSpeedProgressBarProps> = (props) => {
  const {speed} = props;
  const [speedPerc, setSpeedPerc] = useState(0);

  useEffect(() => {
    // Calculate the % of the progress bar - 6.0 is the highest that will fill the bar on OSRS' own UI
    let perc = Math.round((speed / 6.0) * 100);
    if (perc > 100) perc = 100;
    setSpeedPerc(perc);
  }, [speed]);

  const determineSpeedBg = () => {
    if (speedPerc > 90) {
      return 'bg-red';
    } else if (speedPerc > 50) {
      return 'bg-orange';
    } else if (speedPerc > 35) {
      return 'bg-yellow';
    } else {
      return 'bg-green';
    }
  }

  return (
    <>
      <div className="mt-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div className={`${determineSpeedBg()} transition-[width,background] text-xs font-medium text-black text-center p-0.5 leading-none rounded-full`}
             style={{width: `${speedPerc}%`}}>{speed}s
        </div>
      </div>
      <div className={'mt-1 mb-4 flex justify-between text-xs text-gray-400'}>
        <p>Fast</p>
        <p>Slow</p>
      </div>
    </>
  )
}

export default function BoxCombatAttributes() {
  const [atkSpeed, setAtkSpeed] = useState(2.4);

  return (
    <div className={'grow bg-[#16161e] rounded-br'}>
      <div className={'px-6 py-4 text-sm border-b border-gray-800 text-gray-300'}>
        <h4 className={'font-mono text-white'}>Bonuses</h4>
        <p className={'text-xs'}>
          These values are determined by your equipment and stats. You usually do not need to set them manually.
        </p>
      </div>
      <div className={'p-6'}>
        <div className={'flex gap-8'}>
          <Offensive />
          <Defensive />
          <OtherBonuses />
        </div>
        <div className={'mt-6'}>
          <h4 className={`font-bold font-mono`}>
            Attack speed <HelpLink href={'https://oldschool.runescape.wiki/w/Attack_speed'} />
          </h4>

          <AttackSpeedProgressBar speed={atkSpeed} />

          <div className={'mt-1'}>
            <input type={'number'} placeholder={'0'} className={'form-control w-16'} defaultValue={atkSpeed} onChange={(evt) => {
              const parsed = parseFloat(evt.currentTarget.value);
              if (!isNaN(parsed)) {
                setAtkSpeed(parsed);
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}