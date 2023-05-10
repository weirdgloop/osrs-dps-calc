import React, {useEffect, useState} from 'react';
import dagger from '@/img/bonuses/dagger.png';
import scimitar from '@/img/bonuses/scimitar.png';
import warhammer from '@/img/bonuses/warhammer.png';
import magic from '@/img/bonuses/magic.png';
import ranged from '@/img/bonuses/ranged.png';
import strength from '@/img/bonuses/strength.png';
import rangedStrength from '@/img/bonuses/ranged_strength.png';
import magicStrength from '@/img/bonuses/magic_strength.png';
import prayer from '@/img/tabs/prayer.png';
import AttributeInput from '@/components/player/AttributeInput';
import HelpLink from '@/components/HelpLink';
import {observer} from 'mobx-react-lite';
import {useStore} from '../state';

const Offensive: React.FC = observer(() => {
  const store = useStore();
  const {prefs, equipmentBonuses} = store;

  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-500'}>Offensive</p>
      <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Dagger'} image={dagger} value={equipmentBonuses.offensive.stab} onChange={(v) => store.updatePlayerCombatAttributes({offensive: {stab: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Scimitar'} image={scimitar} value={equipmentBonuses.offensive.slash} onChange={(v) => store.updatePlayerCombatAttributes({offensive: {slash: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Warhammer'} image={warhammer} value={equipmentBonuses.offensive.crush} onChange={(v) => store.updatePlayerCombatAttributes({offensive: {crush: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Magic'} image={magic} value={equipmentBonuses.offensive.magic} onChange={(v) => store.updatePlayerCombatAttributes({offensive: {magic: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Ranged'} image={ranged} value={equipmentBonuses.offensive.ranged} onChange={(v) => store.updatePlayerCombatAttributes({offensive: {ranged: v}})} />
      </div>
    </div>
  )
})

const Defensive: React.FC = observer(() => {
  const store = useStore();
  const {player, prefs, equipmentBonuses} = store;

  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-500'}>Defensive</p>
      <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Dagger'} image={dagger} value={equipmentBonuses.defensive.stab} onChange={(v) => store.updatePlayerCombatAttributes({defensive: {stab: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Scimitar'} image={scimitar} value={equipmentBonuses.defensive.slash} onChange={(v) => store.updatePlayerCombatAttributes({defensive: {slash: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Warhammer'} image={warhammer} value={equipmentBonuses.defensive.crush} onChange={(v) => store.updatePlayerCombatAttributes({defensive: {crush: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Magic'} image={magic} value={equipmentBonuses.defensive.magic} onChange={(v) => store.updatePlayerCombatAttributes({defensive: {magic: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Ranged'} image={ranged} value={equipmentBonuses.defensive.ranged} onChange={(v) => store.updatePlayerCombatAttributes({defensive: {ranged: v}})} />
      </div>
    </div>
  )
})

const OtherBonuses: React.FC = observer(() => {
  const store = useStore();
  const {player, prefs, equipmentBonuses} = store;

  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-500'}>Other</p>
      <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Strength'} image={strength} value={equipmentBonuses.bonuses.str} onChange={(v) => store.updatePlayerCombatAttributes({bonuses: {strength: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Ranged Strength'} image={rangedStrength} value={equipmentBonuses.bonuses.ranged_str} onChange={(v) => store.updatePlayerCombatAttributes({bonuses: {ranged_str: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Magic Strength'} image={magicStrength} value={equipmentBonuses.bonuses.magic_str} onChange={(v) => store.updatePlayerCombatAttributes({bonuses: {magic_str: v}})} />
        <AttributeInput disabled={!prefs.allowEditingPlayerStats} name={'Prayer'} image={prayer} value={equipmentBonuses.bonuses.prayer} onChange={(v) => store.updatePlayerCombatAttributes({bonuses: {prayer: v}})} />
      </div>
    </div>
  )
})

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
      return 'bg-red-300';
    } else if (speedPerc > 50) {
      return 'bg-orange-300';
    } else if (speedPerc > 35) {
      return 'bg-yellow-300';
    } else {
      return 'bg-green-300';
    }
  }

  return (
    <>
      <div className="mt-2 w-full bg-body-500 rounded-full">
        <div className={`${determineSpeedBg()} transition-[width,background] text-xs font-medium text-black text-center p-0.5 leading-none rounded-full`}
             style={{width: `${speedPerc}%`}}>{speed}s
        </div>
      </div>
      <div className={'mt-1 mb-4 flex justify-between text-xs text-gray-500'}>
        <p>Fast</p>
        <p>Slow</p>
      </div>
    </>
  )
}

export default function BoxCombatAttributes() {
  const [atkSpeed, setAtkSpeed] = useState(2.4);

  return (
    <div className={'grow bg-body-100 text-black rounded-br'}>
      <div className={'px-6 py-4 border-b border-body-400'}>
        <h4 className={'font-serif font-bold'}>Bonuses</h4>
      </div>
      <div className={'p-6'}>
        <div className={'flex gap-4'}>
          <Offensive />
          <Defensive />
          <OtherBonuses />
        </div>
        <div className={'mt-6'}>
          <h4 className={`font-bold font-serif`}>
            Attack speed <HelpLink href={'https://oldschool.runescape.wiki/w/Attack_speed'} />
          </h4>

          <AttackSpeedProgressBar speed={atkSpeed} />
        </div>
      </div>
    </div>
  )
}