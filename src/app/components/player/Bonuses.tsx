import React, {useEffect, useState} from 'react';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import strength from '@/public/img/bonuses/strength.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import prayer from '@/public/img/tabs/prayer.png';
import AttributeInput from '../generic/AttributeInput';
import {observer} from 'mobx-react-lite';
import {useStore} from '@/state';
import HitDistribution from "@/app/components/results/HitDistribution";

const Offensive: React.FC = observer(() => {
  const store = useStore();
  const {prefs, player, equipmentBonuses} = store;

  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-500 dark:text-gray-300'}>Offensive</p>
      <div className={'flex flex-col gap-2 mt-3 text-center'}>
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Dagger'}
          image={dagger}
          value={player.offensive.stab}
          className={`${(player.offensive.stab !== equipmentBonuses.offensive.stab) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({offensive: {stab: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Scimitar'} image={scimitar}
          value={player.offensive.slash}
          className={`${(player.offensive.slash !== equipmentBonuses.offensive.slash) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({offensive: {slash: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Warhammer'}
          image={warhammer}
          value={player.offensive.crush}
          className={`${(player.offensive.crush !== equipmentBonuses.offensive.crush) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({offensive: {crush: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Magic'}
          image={magic}
          value={player.offensive.magic}
          className={`${(player.offensive.magic !== equipmentBonuses.offensive.magic) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({offensive: {magic: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Ranged'}
          image={ranged}
          value={player.offensive.ranged}
          className={`${(player.offensive.ranged !== equipmentBonuses.offensive.ranged) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({offensive: {ranged: v}})}
        />
      </div>
    </div>
  )
})

const Defensive: React.FC = observer(() => {
  const store = useStore();
  const {prefs, player, equipmentBonuses} = store;

  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-500 dark:text-gray-300'}>Defensive</p>
      <div className={'flex flex-col gap-2 mt-3 text-center'}>
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Dagger'}
          image={dagger}
          value={player.defensive.stab}
          className={`${(player.defensive.stab !== equipmentBonuses.defensive.stab) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({defensive: {stab: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Scimitar'}
          image={scimitar}
          value={player.defensive.slash}
          className={`${(player.defensive.slash !== equipmentBonuses.defensive.slash) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({defensive: {slash: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Warhammer'}
          image={warhammer}
          value={player.defensive.crush}
          className={`${(player.defensive.crush !== equipmentBonuses.defensive.crush) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({defensive: {crush: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Magic'}
          image={magic}
          value={player.defensive.magic}
          className={`${(player.defensive.magic !== equipmentBonuses.defensive.magic) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({defensive: {magic: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Ranged'}
          image={ranged}
          value={player.defensive.ranged}
          className={`${(player.defensive.ranged !== equipmentBonuses.defensive.ranged) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({defensive: {ranged: v}})}
        />
      </div>
    </div>
  )
})

const OtherBonuses: React.FC = observer(() => {
  const store = useStore();
  const {prefs, player, equipmentBonuses} = store;

  return (
    <div className={'w-[95px]'}>
      <p className={'text-sm text-gray-500 dark:text-gray-300'}>Other</p>
      <div className={'flex flex-col gap-2 mt-3 text-center'}>
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Strength'}
          image={strength}
          value={player.bonuses.str}
          className={`${(player.bonuses.str !== equipmentBonuses.bonuses.str) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({bonuses: {str: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Ranged Strength'}
          image={rangedStrength}
          value={player.bonuses.ranged_str}
          className={`${(player.bonuses.ranged_str !== equipmentBonuses.bonuses.ranged_str) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({bonuses: {ranged_str: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Magic Strength'}
          image={magicStrength}
          value={player.bonuses.magic_str}
          className={`${(player.bonuses.magic_str !== equipmentBonuses.bonuses.magic_str) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({bonuses: {magic_str: v}})}
        />
        <AttributeInput
          disabled={!prefs.allowEditingPlayerStats}
          name={'Prayer'}
          image={prayer}
          value={player.bonuses.prayer}
          className={`${(player.bonuses.prayer !== equipmentBonuses.bonuses.prayer) ? 'bg-yellow-200' : ''}`}
          onChange={(v) => store.updatePlayer({bonuses: {prayer: v}})}
        />
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

const Bonuses: React.FC = observer(() => {
  const store = useStore();
  const {prefs} = store;
  const [atkSpeed] = useState(2.4);

  return (
    <div className={'grow bg-body-100 dark:bg-dark-400 text-black dark:text-white rounded-br'}>
      <div className={'px-6 py-2 border-b border-body-400 dark:border-dark-200'}>
        <h4 className={'font-serif font-bold'}>Bonuses</h4>
      </div>
      <div className={'px-6 py-4'}>
        <div className={'flex gap-4 justify-center'}>
          <Offensive />
          <Defensive />
          <OtherBonuses />
        </div>
      </div>
      {prefs.showHitDistribution && (
        <>
          <div className={'px-6 py-2 border-y border-body-400 dark:border-dark-200'}>
            <h4 className={'font-serif font-bold'}>Hit Distribution</h4>
          </div>
          <div className={'mt-2 px-2'}>
            <HitDistribution />
          </div>
        </>
      )}
    </div>
  )
})

export default Bonuses;
