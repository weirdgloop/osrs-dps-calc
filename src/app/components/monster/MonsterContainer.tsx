import React from 'react';
import AttributeInput from '../generic/AttributeInput';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import toaRaidLevel from '@/public/img/toa_raidlevel.webp';
import Image from 'next/image';
import noMonster from '@/public/img/no_monster.png';
import HelpLink from '../HelpLink';
import MonsterSelect from './MonsterSelect';
import {useStore} from '@/state';
import {observer} from 'mobx-react-lite';
import {MonsterAttribute} from '@/enums/MonsterAttribute';
import {getCdnImage} from '@/utils';
import PresetAttributeButton from "@/app/components/monster/PresetAttributeButton";
import NumberInput from "@/app/components/generic/NumberInput";
import {TOMBS_OF_AMASCUT_MONSTER_IDS} from "@/constants";

const MonsterContainer: React.FC = observer(() => {
  const store = useStore();
  const {monster, prefs} = store;

  return (
    <div className={'bg-tile dark:bg-dark-300 max-w-[540px] mx-auto lg:basis-auto sm:rounded-lg text-black dark:text-white shadow-lg'}>
      <div className={'px-6 py-4 border-b-body-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center'}>
        <h1 className={`font-serif text-xl tracking-tight font-bold`}>
          {monster.name ? monster.name : 'Monster'}
        </h1>
      </div>
      <div className={'p-6'}>
        <div className={'mb-4'}>
          <div className={'flex gap-8 flex-wrap justify-center'}>
            <div className={'basis-1/4'}>
              <div className={'mb-4'}>
                <MonsterSelect />
              </div>
              <h4 className={`font-bold font-serif`}>
                Stats
              </h4>
              <div className={'flex gap-4'}>
                <div className={'w-[95px]'}>
                  <p className={'text-sm text-gray-400 dark:text-gray-300'}>Skills</p>
                  <div className={'flex flex-col gap-2 mt-3 text-center'}>
                    <AttributeInput name={'Hitpoints'} disabled={!prefs.allowEditingMonsterStats} image={hitpoints} value={monster.skills.hp} onChange={(v) => store.updateMonster({skills: {hp: v}})} />
                    <AttributeInput name={'Attack'} disabled={!prefs.allowEditingMonsterStats} image={attack} value={monster.skills.atk} onChange={(v) => store.updateMonster({skills: {atk: v}})}  />
                    <AttributeInput name={'Strength'} disabled={!prefs.allowEditingMonsterStats} image={strength} value={monster.skills.str} onChange={(v) => store.updateMonster({skills: {str: v}})}  />
                    <AttributeInput name={'Defence'} disabled={!prefs.allowEditingMonsterStats} image={defence} value={monster.skills.def} onChange={(v) => store.updateMonster({skills: {def: v}})}  />
                    <AttributeInput name={'Magic'} disabled={!prefs.allowEditingMonsterStats} image={magic} value={monster.skills.magic} onChange={(v) => store.updateMonster({skills: {magic: v}})}  />
                    <AttributeInput name={'Ranged'} disabled={!prefs.allowEditingMonsterStats} image={ranged} value={monster.skills.ranged} onChange={(v) => store.updateMonster({skills: {ranged: v}})}  />
                  </div>
                </div>
                <div className={'w-[95px]'}>
                  <p className={'text-sm text-gray-400 dark:text-gray-300'}>Offensive</p>
                  <div className={'flex flex-col gap-2 mt-3 text-center'}>
                    <AttributeInput name={'Attack'} disabled={!prefs.allowEditingMonsterStats} image={attack} value={monster.offensive.atk} onChange={(v) => store.updateMonster({offensive: {atk: v}})}  />
                    <AttributeInput name={'Strength'} disabled={!prefs.allowEditingMonsterStats} image={strength} value={monster.offensive.str} onChange={(v) => store.updateMonster({offensive: {str: v}})} />
                    <AttributeInput name={'Magic'} disabled={!prefs.allowEditingMonsterStats} image={magic} value={monster.offensive.magic} onChange={(v) => store.updateMonster({offensive: {magic: v}})} />
                    <AttributeInput name={'Magic Strength'} disabled={!prefs.allowEditingMonsterStats} image={magicStrength} value={monster.offensive.magic_str} onChange={(v) => store.updateMonster({offensive: {magic_str: v}})} />
                    <AttributeInput name={'Ranged'} disabled={!prefs.allowEditingMonsterStats} image={ranged} value={monster.offensive.ranged} onChange={(v) => store.updateMonster({offensive: {ranged: v}})} />
                    <AttributeInput name={'Ranged Strength'} disabled={!prefs.allowEditingMonsterStats} image={rangedStrength} value={monster.offensive.ranged_str} onChange={(v) => store.updateMonster({offensive: {ranged_str: v}})} />
                  </div>
                </div>
                <div className={'w-[95px]'}>
                  <p className={'text-sm text-gray-400 dark:text-gray-300'}>Defensive</p>
                  <div className={'flex flex-col gap-2 mt-3 text-center'}>
                    <AttributeInput name={'Stab'} disabled={!prefs.allowEditingMonsterStats} image={dagger} value={monster.defensive.stab} onChange={(v) => store.updateMonster({defensive: {stab: v}})} />
                    <AttributeInput name={'Slash'} disabled={!prefs.allowEditingMonsterStats} image={scimitar} value={monster.defensive.slash} onChange={(v) => store.updateMonster({defensive: {slash: v}})} />
                    <AttributeInput name={'Crush'} disabled={!prefs.allowEditingMonsterStats} image={warhammer} value={monster.defensive.crush} onChange={(v) => store.updateMonster({defensive: {crush: v}})} />
                    <AttributeInput name={'Magic'} disabled={!prefs.allowEditingMonsterStats} image={magic} value={monster.defensive.magic} onChange={(v) => store.updateMonster({defensive: {magic: v}})}  />
                    <AttributeInput name={'Ranged'} disabled={!prefs.allowEditingMonsterStats} image={ranged} value={monster.defensive.ranged} onChange={(v) => store.updateMonster({defensive: {ranged: v}})}  />
                  </div>
                </div>
              </div>
              <div className={'mt-4'}>
                <h4 className={`font-bold font-serif`}>
                  Attributes <HelpLink href={'https://oldschool.runescape.wiki/w/Monster_attribute'} />
                </h4>
                <div className={'mt-2 text-sm flex flex-wrap gap-1.5 w-80'}>
                  {
                    Object.values(MonsterAttribute).map((attr, idx) => {
                      return <PresetAttributeButton key={idx} attr={attr} />
                    })
                  }
                </div>
              </div>
              {(monster.id && TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id)) && (
                <div className={'mt-4'}>
                  <h4 className={'font-bold font-serif'}>
                    <img src={toaRaidLevel.src} alt={''} className={'inline-block'} />{' '}
                    Tombs of Amascut raid level
                  </h4>
                  <p className={'text-xs text-gray-400'}>You can set your raid level here to change how this monster&apos;s health and other stats are calculated. <span className={'font-bold'}>(0-600)</span></p>
                  <div className={'mt-2'}>
                    <NumberInput
                      value={monster.invocationLevel}
                      min={0}
                      max={600}
                      step={5}
                      onChange={(v) => store.updateMonster({invocationLevel: v})}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={'flex items-center justify-center'}>
              <div>
                <Image
                    className={'max-w-[100px] max-h-[300px] w-auto h-auto'}
                    height={100}
                    width={200}
                    src={
                      store.monster.image ? getCdnImage(`monsters/${store.monster.image}`) : noMonster
                    }
                    alt={store.monster.name || 'Unknown'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default MonsterContainer;
