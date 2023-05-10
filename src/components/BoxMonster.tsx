import React from 'react';
import AttributeInput from '@/components/player/AttributeInput';
import dagger from '@/img/bonuses/dagger.png';
import scimitar from '@/img/bonuses/scimitar.png';
import warhammer from '@/img/bonuses/warhammer.png';
import magic from '@/img/bonuses/magic.png';
import ranged from '@/img/bonuses/ranged.png';
import hitpoints from '@/img/bonuses/hitpoints.png';
import attack from '@/img/bonuses/attack.png';
import strength from '@/img/bonuses/strength.png';
import defence from '@/img/bonuses/defence.png';
import magicStrength from '@/img/bonuses/magic_strength.png';
import rangedStrength from '@/img/bonuses/ranged_strength.png';
import Image from 'next/image';
import noMonster from '@/img/no_monster.png';
import HelpLink from '@/components/HelpLink';
import MonsterSelect from '@/components/MonsterSelect';
import {useStore} from '../state';
import {observer} from 'mobx-react-lite';
import {MonsterAttribute} from '@/lib/enums/MonsterAttribute';
import {getWikiImage} from '@/lib/utilities';

interface PresetAttributeButtonProps {
  attr: MonsterAttribute;
}

const PresetAttributeButton: React.FC<PresetAttributeButtonProps> = observer((props) => {
  const store = useStore();
  const {monster, prefs} = store;
  const {attr} = props;

  const isSelected = monster.attributes.includes(attr);

  return (
    <button disabled={!prefs.allowEditingMonsterStats} className={`rounded px-1 transition-[background,color] ${isSelected ? 'bg-blue-600 text-white' : 'bg-body-100 hover:bg-body-200'}`} onClick={() => {
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
  const {monster, prefs} = store;

  return (
    <div className={'mb-4'}>
      <div className={'flex gap-8 flex-wrap'}>
        <div>
          <div className={'mb-4'}>
            <MonsterSelect />
          </div>
          <h4 className={`font-bold font-serif`}>
            Stats
          </h4>
          <div className={'flex gap-4'}>
            <div className={'w-[95px]'}>
              <p className={'text-sm text-gray-400'}>Skills</p>
              <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
                <AttributeInput name={'Hitpoints'} disabled={!prefs.allowEditingMonsterStats} image={hitpoints} value={monster.skills.hp} onChange={(v) => store.updateMonster({skills: {hp: v}})} />
                <AttributeInput name={'Attack'} disabled={!prefs.allowEditingMonsterStats} image={attack} value={monster.skills.atk} onChange={(v) => store.updateMonster({skills: {atk: v}})}  />
                <AttributeInput name={'Strength'} disabled={!prefs.allowEditingMonsterStats} image={strength} value={monster.skills.str} onChange={(v) => store.updateMonster({skills: {str: v}})}  />
                <AttributeInput name={'Defence'} disabled={!prefs.allowEditingMonsterStats} image={defence} value={monster.skills.def} onChange={(v) => store.updateMonster({skills: {def: v}})}  />
                <AttributeInput name={'Magic'} disabled={!prefs.allowEditingMonsterStats} image={magic} value={monster.skills.magic} onChange={(v) => store.updateMonster({skills: {magic: v}})}  />
                <AttributeInput name={'Ranged'} disabled={!prefs.allowEditingMonsterStats} image={ranged} value={monster.skills.ranged} onChange={(v) => store.updateMonster({skills: {ranged: v}})}  />
              </div>
            </div>
            <div className={'w-[95px]'}>
              <p className={'text-sm text-gray-400'}>Offensive</p>
              <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
                <AttributeInput name={'Attack'} disabled={!prefs.allowEditingMonsterStats} image={attack} value={monster.offensive.atk} onChange={(v) => store.updateMonster({offensive: {atk: v}})}  />
                <AttributeInput name={'Strength'} disabled={!prefs.allowEditingMonsterStats} image={strength} value={monster.offensive.str} onChange={(v) => store.updateMonster({offensive: {str: v}})} />
                <AttributeInput name={'Magic'} disabled={!prefs.allowEditingMonsterStats} image={magic} value={monster.offensive.magic} onChange={(v) => store.updateMonster({offensive: {magic: v}})} />
                <AttributeInput name={'Magic Strength'} disabled={!prefs.allowEditingMonsterStats} image={magicStrength} value={monster.offensive.magic_str} onChange={(v) => store.updateMonster({offensive: {magic_str: v}})} />
                <AttributeInput name={'Ranged'} disabled={!prefs.allowEditingMonsterStats} image={ranged} value={monster.offensive.ranged} onChange={(v) => store.updateMonster({offensive: {ranged: v}})} />
                <AttributeInput name={'Ranged Strength'} disabled={!prefs.allowEditingMonsterStats} image={rangedStrength} value={monster.offensive.ranged_str} onChange={(v) => store.updateMonster({offensive: {ranged_str: v}})} />
              </div>
            </div>
            <div className={'w-[95px]'}>
              <p className={'text-sm text-gray-400'}>Defensive</p>
              <div className={'flex flex-col gap-2 mt-3 text-center items-end'}>
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
        </div>
        <div className={'grow-0 flex items-center'}>
          <div>
            <Image
              className={'max-w-[100px] max-h-[300px] w-auto h-auto'}
              height={100}
              width={200}
              src={
                store.monster.image ? getWikiImage(store.monster.image) : noMonster
              }
              alt={store.monster.name || 'Unknown'}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default BoxMonster;