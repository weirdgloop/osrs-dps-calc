import {Monster} from '@/types/Monster';
import React, {PropsWithChildren, useEffect, useMemo, useState} from 'react';
import AttributeInput from '@/components/inputs/AttributeInput';
import dagger from '@/img/dagger.png';
import scimitar from '@/img/scimitar.png';
import warhammer from '@/img/warhammer.png';
import magic from '@/img/magic.png';
import ranged from '@/img/ranged.png';
import hitpoints from '@/img/hitpoints.png';
import attack from '@/img/attack.png';
import strength from '@/img/strength.png';
import defence from '@/img/defence.png';
import magicStrength from '@/img/magic_strength.png';
import rangedStrength from '@/img/ranged_strength.png';
import Image from 'next/image';
import noMonster from '@/img/no_monster.png';
import HelpLink from '@/components/HelpLink';
import MonsterSelect from '@/components/MonsterSelect';
import {useStore} from '../state/state';
import {observer} from 'mobx-react-lite';
import {MonsterAttribute} from '@/lib/enums/MonsterAttribute';

interface PresetAttributeButtonProps {
  attr: MonsterAttribute;
}

const PresetAttributeButton: React.FC<PresetAttributeButtonProps> = observer((props) => {
  const store = useStore();
  const {monster} = store;
  const {attr} = props;

  const isSelected = monster.attributes.includes(attr);

  return (
    <button className={`rounded px-1 transition-[background,color] ${isSelected ? 'bg-dracula text-black' : 'bg-darker-900 hover:bg-gray-600'}`} onClick={() => {
      if (isSelected) {
        // If this attribute is already selected, de-select it
        store.updateMonster({attributes: store.monster.attributes.filter((a) => a !== attr)});
      } else {
        // If it is not selected, select it
        store.updateMonster({attributes: [...store.monster.attributes, attr]});
      }
    }}>
      {attr}
    </button>
  )
})

const BoxMonster: React.FC = observer(() => {
  const store = useStore();
  const {monster} = store;

  return (
    <div className={'mb-4'}>
      <div className={'flex gap-8 mt-2 justify-center flex-wrap'}>
        <div>
          <div className={'mb-4'}>
            <MonsterSelect />
          </div>
          <h4 className={`font-bold font-mono`}>
            Stats
          </h4>
          <div className={'flex gap-8'}>
            <div className={'w-[95px]'}>
              <p className={'text-sm text-gray-400'}>Skills</p>
              <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
                <AttributeInput name={'Hitpoints'} image={hitpoints} value={monster.combat.hp} onChange={(v) => store.updateMonster({combat: {hp: v}})} />
                <AttributeInput name={'Attack'} image={attack} value={monster.combat.attack} onChange={(v) => store.updateMonster({combat: {attack: v}})} />
                <AttributeInput name={'Strength'} image={strength} value={monster.combat.strength} onChange={(v) => store.updateMonster({combat: {strength: v}})} />
                <AttributeInput name={'Defence'} image={defence} value={monster.combat.defence} onChange={(v) => store.updateMonster({combat: {defence: v}})} />
                <AttributeInput name={'Magic'} image={magic} value={monster.combat.magic} onChange={(v) => store.updateMonster({combat: {magic: v}})} />
                <AttributeInput name={'Ranged'} image={ranged} value={monster.combat.ranged} onChange={(v) => store.updateMonster({combat: {ranged: v}})} />
              </div>
            </div>
            <div className={'w-[95px]'}>
              <p className={'text-sm text-gray-400'}>Offensive</p>
              <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
                <AttributeInput name={'Attack'} image={attack} value={monster.offensive.attack} onChange={(v) => store.updateMonster({offensive: {attack: v}})} />
                <AttributeInput name={'Strength'} image={strength} value={monster.offensive.strength} onChange={(v) => store.updateMonster({offensive: {strength: v}})} />
                <AttributeInput name={'Magic'} image={magic} value={monster.offensive.magic} onChange={(v) => store.updateMonster({offensive: {magic: v}})} />
                <AttributeInput name={'Magic Strength'} image={magicStrength} value={monster.offensive.magic_str} onChange={(v) => store.updateMonster({offensive: {magic_str: v}})} />
                <AttributeInput name={'Ranged'} image={ranged} value={monster.offensive.ranged} onChange={(v) => store.updateMonster({offensive: {ranged: v}})} />
                <AttributeInput name={'Ranged Strength'} image={rangedStrength} value={monster.offensive.ranged_str} onChange={(v) => store.updateMonster({offensive: {ranged_str: v}})} />
              </div>
            </div>
            <div className={'w-[95px]'}>
              <p className={'text-sm text-gray-400'}>Defensive</p>
              <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
                <AttributeInput name={'Stab'} image={dagger} value={monster.defensive.stab} onChange={(v) => store.updateMonster({defensive: {stab: v}})} />
                <AttributeInput name={'Slash'} image={scimitar} value={monster.defensive.slash} onChange={(v) => store.updateMonster({defensive: {slash: v}})} />
                <AttributeInput name={'Crush'} image={warhammer} value={monster.defensive.crush} onChange={(v) => store.updateMonster({defensive: {crush: v}})} />
                <AttributeInput name={'Magic'} image={magic} value={monster.defensive.magic} onChange={(v) => store.updateMonster({defensive: {magic: v}})}  />
                <AttributeInput name={'Ranged'} image={ranged} value={monster.defensive.ranged} onChange={(v) => store.updateMonster({defensive: {ranged: v}})}  />
              </div>
            </div>
          </div>
          <div className={'mt-4'}>
            <h4 className={`font-bold font-mono`}>
              <span className={'text-gray-500 text-sm'}>({monster.attributes.length})</span> Attributes <HelpLink href={'https://oldschool.runescape.wiki/w/Monster_attribute'} />
            </h4>
            <div className={'mt-2 text-sm flex flex-wrap gap-1.5 w-80'}>
              {
                Object.values(MonsterAttribute).map((attr, idx) => {
                  return <PresetAttributeButton key={idx} attr={attr} />
                })
              }
            </div>
          </div>
        </div>
        <div className={'grow-0'}>
          <Image
            className={'max-w-[300px] max-h-[300px] w-auto h-auto'}
            height={100}
            width={200}
            src={
              store.monster.image || noMonster
            }
            alt={store.monster.name || 'Unknown'}
          />
        </div>
      </div>
    </div>
  )
})

export default BoxMonster;