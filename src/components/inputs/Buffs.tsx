import React from 'react';
import Toggle from '@/components/generic/Toggle';
import Image, {StaticImageData} from 'next/image';
import {Potion as PotionEnum} from '@/lib/enums/Potion';

import Ancient from '@/img/potions/Ancient brew.png';
import Attack from '@/img/potions/Attack.png';
import Forgotten from '@/img/potions/Forgotten brew.png';
import Imbued from '@/img/potions/Imbued heart.png';
import Magic from '@/img/potions/Magic.png';
import Overload from '@/img/potions/Overload.png';
import Ranging from '@/img/potions/Ranging.png';
import Saturated from '@/img/potions/Saturated heart.png';
import Salts from '@/img/potions/Smelling salts.png';
import Strength from '@/img/potions/Strength.png';
import SuperAttack from '@/img/potions/Super attack.png';
import SuperStrength from '@/img/potions/Super strength.png';
import {observer} from 'mobx-react-lite';
import {useStore} from '../../state/state';

interface PotionProps {
  name: PotionEnum;
  img: StaticImageData | string;
}

const Potion: React.FC<PotionProps> = observer((props) => {
  const store = useStore();
  const {playerBuffs} = store;
  const {name, img} = props;

  return (
    <div
      className={`w-10 flex justify-center cursor-pointer`}
      data-tooltip-id={'tooltip'}
      data-tooltip-content={name}
      onClick={() => store.togglePlayerPotion(name)}
    >
      <Image className={`${playerBuffs.potions.includes(name) ? 'filter drop-shadow-[0_0_5px_#fff]' : ''}`} src={img} alt={name} />
    </div>
  )
})

const Buffs: React.FC = observer(() => {
  const store = useStore();
  const {playerBuffs} = store;

  return (
    <div className={'mt-4'}>
      <h4 className={`font-bold font-mono`}>
        Buffs
      </h4>
      <div className={'mt-2 mb-4'}>
        <Toggle checked={playerBuffs.onSlayerTask} setChecked={(c) => store.updatePlayerBuffs({onSlayerTask: c})} label={'On Slayer task'} />
        <Toggle checked={playerBuffs.inWilderness} setChecked={(c) => store.updatePlayerBuffs({inWilderness: c})} label={'In the Wilderness'} />
        <Toggle checked={playerBuffs.kandarinDiary} setChecked={(c) => store.updatePlayerBuffs({kandarinDiary: c})} label={'Kandarin Hard Diary'} />
      </div>
      <h4 className={'font-bold font-mono'}>
        <span className={'text-gray-500 text-sm'}>({playerBuffs.potions.length})</span> Potions
      </h4>
      <div className={'mt-4 flex flex-wrap grow justify-center items-center gap-4'}>
        <Potion name={PotionEnum.ANCIENT} img={Ancient} />
        <Potion name={PotionEnum.ATTACK} img={Attack} />
        <Potion name={PotionEnum.FORGOTTEN_BREW} img={Forgotten} />
        <Potion name={PotionEnum.IMBUED_HEART} img={Imbued} />
        <Potion name={PotionEnum.MAGIC} img={Magic} />
        <Potion name={PotionEnum.OVERLOAD} img={Overload} />
        <Potion name={PotionEnum.RANGING} img={Ranging} />
        <Potion name={PotionEnum.SATURATED_HEART} img={Saturated} />
        <Potion name={PotionEnum.SMELLING_SALTS} img={Salts} />
        <Potion name={PotionEnum.STRENGTH} img={Strength} />
        <Potion name={PotionEnum.SUPER_ATTACK} img={SuperAttack} />
        <Potion name={PotionEnum.SUPER_STRENGTH} img={SuperStrength} />
      </div>
    </div>

  )
})

export default Buffs;