import React, { useEffect, useState } from 'react';
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
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { getCdnImage } from '@/utils';
import PresetAttributeButton from '@/app/components/monster/PresetAttributeButton';
import {
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
} from '@tabler/icons-react';
import { scaleMonster } from '@/lib/MonsterScaling';
import LazyImage from '@/app/components/generic/LazyImage';
import { reaction } from 'mobx';
import DefensiveReductions from '@/app/components/monster/DefensiveReductions';
import ExtraContainerPartySize from '@/app/components/monster/containers/ExtraContainerPartySize';
import ExtraContainerTombsOfAmascut from '@/app/components/monster/containers/ExtraContainerTombsOfAmascut';
import ExtraContainerChambersOfXeric from '@/app/components/monster/containers/ExtraContainerChambersOfXeric';
import ExtraContainerMonsterCurrentHp from '@/app/components/monster/containers/ExtraContainerMonsterCurrentHp';
import AttributeInput from '../generic/AttributeInput';
import HelpLink from '../HelpLink';
import MonsterSelect from './MonsterSelect';

const MonsterContainer: React.FC = observer(() => {
  const store = useStore();
  const { monster, prefs } = store;
  const [attributesExpanded, setAttributesExpanded] = useState(false);

  // Don't automatically update the stat inputs if manual editing is on
  const displayMonster = prefs.manualMode ? monster : scaleMonster(monster);

  useEffect(() => reaction(() => displayMonster.skills.hp, () => {
    if (monster.inputs.monsterCurrentHp !== displayMonster.skills.hp) {
      store.updateMonster({ inputs: { monsterCurrentHp: displayMonster.skills.hp } });
    }
  }), []);

  return (
    <div className="basis-4 flex flex-col grow mt-3 md:grow-0">
      <div
        className="bg-tile dark:bg-dark-300 sm:rounded-lg mt-6 text-black dark:text-white shadow-lg"
      >
        <div
          className="px-6 py-2 border-b-body-400 dark:border-b-dark-200 border-b md:rounded md:rounded-bl-none md:rounded-br-none flex justify-between items-center bg-body-100 dark:bg-dark-400"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex">
              <LazyImage
                responsive
                src={
                  store.monster.image ? getCdnImage(`monsters/${store.monster.image}`) : undefined
                }
                alt={store.monster.name || 'Unknown'}
              />
            </div>
            <h2 className="font-serif tracking-tight font-bold leading-4">
              {monster.name ? monster.name : 'Monster'}
              <br />
              <span className="text-xs text-gray-500 dark:text-gray-300">{monster.version}</span>
            </h2>
          </div>
          {monster.id && (
            <a
              className="text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:text-gray-400"
              href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=npc&id=${monster.id}`}
              target="_blank"
              title="Open wiki page"
              aria-label="Open wiki page"
            >
              <IconExternalLink size={20} />
            </a>
          )}
        </div>
        <div className="py-4 px-4">
          <div className="mb-4">
            <MonsterSelect />
          </div>
          <div>
            <div className="flex gap-8 flex-wrap justify-center">
              <div className="w-72">
                <div className="flex gap-4">
                  <div className="w-[95px]">
                    <p className="text-sm text-gray-400 dark:text-gray-300">Skills</p>
                    <div className="flex flex-col gap-2 mt-3 text-center">
                      <AttributeInput
                        name="Hitpoints"
                        max={50000}
                        disabled={!prefs.manualMode}
                        image={hitpoints}
                        value={displayMonster.skills.hp}
                        onChange={(v) => store.updateMonster({ skills: { hp: v } })}
                      />
                      <AttributeInput
                        name="Attack"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={attack}
                        value={displayMonster.skills.atk}
                        onChange={(v) => store.updateMonster({ skills: { atk: v } })}
                      />
                      <AttributeInput
                        name="Strength"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={strength}
                        value={displayMonster.skills.str}
                        onChange={(v) => store.updateMonster({ skills: { str: v } })}
                      />
                      <AttributeInput
                        name="Defence"
                        max={40000}
                        disabled={!prefs.manualMode}
                        image={defence}
                        value={displayMonster.skills.def}
                        onChange={(v) => store.updateMonster({ skills: { def: v } })}
                      />
                      <AttributeInput
                        name="Magic"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={magic}
                        value={displayMonster.skills.magic}
                        onChange={(v) => store.updateMonster({ skills: { magic: v } })}
                      />
                      <AttributeInput
                        name="Ranged"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={ranged}
                        value={displayMonster.skills.ranged}
                        onChange={(v) => store.updateMonster({ skills: { ranged: v } })}
                      />
                    </div>
                  </div>
                  <div className="w-[95px]">
                    <p className="text-sm text-gray-400 dark:text-gray-300">Offensive</p>
                    <div className="flex flex-col gap-2 mt-3 text-center">
                      <AttributeInput
                        name="Attack"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={attack}
                        value={displayMonster.offensive.atk}
                        onChange={(v) => store.updateMonster({ offensive: { atk: v } })}
                      />
                      <AttributeInput
                        name="Strength"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={strength}
                        value={displayMonster.offensive.str}
                        onChange={(v) => store.updateMonster({ offensive: { str: v } })}
                      />
                      <AttributeInput
                        name="Magic"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={magic}
                        value={displayMonster.offensive.magic}
                        onChange={(v) => store.updateMonster({ offensive: { magic: v } })}
                      />
                      <AttributeInput
                        name="Magic Strength"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={magicStrength}
                        value={displayMonster.offensive.magic_str}
                        onChange={(v) => store.updateMonster({ offensive: { magic_str: v } })}
                      />
                      <AttributeInput
                        name="Ranged"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={ranged}
                        value={displayMonster.offensive.ranged}
                        onChange={(v) => store.updateMonster({ offensive: { ranged: v } })}
                      />
                      <AttributeInput
                        name="Ranged Strength"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={rangedStrength}
                        value={displayMonster.offensive.ranged_str}
                        onChange={(v) => store.updateMonster({ offensive: { ranged_str: v } })}
                      />
                    </div>
                  </div>
                  <div className="w-[95px]">
                    <p className="text-sm text-gray-400 dark:text-gray-300">Defensive</p>
                    <div className="flex flex-col gap-2 mt-3 text-center">
                      <AttributeInput
                        name="Stab"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={dagger}
                        value={displayMonster.defensive.stab}
                        onChange={(v) => store.updateMonster({ defensive: { stab: v } })}
                      />
                      <AttributeInput
                        name="Slash"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={scimitar}
                        value={displayMonster.defensive.slash}
                        onChange={(v) => store.updateMonster({ defensive: { slash: v } })}
                      />
                      <AttributeInput
                        name="Crush"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={warhammer}
                        value={displayMonster.defensive.crush}
                        onChange={(v) => store.updateMonster({ defensive: { crush: v } })}
                      />
                      <AttributeInput
                        name="Magic"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={magic}
                        value={displayMonster.defensive.magic}
                        onChange={(v) => store.updateMonster({ defensive: { magic: v } })}
                      />
                      <AttributeInput
                        name="Ranged"
                        max={1000}
                        disabled={!prefs.manualMode}
                        image={ranged}
                        value={displayMonster.defensive.ranged}
                        onChange={(v) => store.updateMonster({ defensive: { ranged: v } })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <div className="rounded bg-body-100 dark:bg-dark-500">
                    <button
                      type="button"
                      className={`w-full pt-1 border-b-body-400 dark:border-b-dark-300 px-2 flex text-gray-500 dark:text-gray-300 font-semibold justify-between gap-2 ${attributesExpanded ? 'border-b' : ''}`}
                      onClick={() => setAttributesExpanded(!attributesExpanded)}
                    >
                      <div>
                        Attributes
                        {' '}
                        <HelpLink href="https://oldschool.runescape.wiki/w/Monster_attribute" />
                      </div>
                      <div className="relative top-[-2px]">{attributesExpanded ? <IconChevronUp width={20} /> : <IconChevronDown width={20} />}</div>
                    </button>

                    {attributesExpanded && (
                      <div className="py-2 px-2 flex flex-wrap gap-1.5">
                        {
                          Object.values(MonsterAttribute).map((attr) => <PresetAttributeButton key={attr} attr={attr} />)
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-1 text-sm">
                  <DefensiveReductions />
                </div>
                <div className="flex flex-wrap gap-x-4">
                  <ExtraContainerPartySize monster={monster} />
                  <ExtraContainerTombsOfAmascut monster={monster} />
                  <ExtraContainerChambersOfXeric monster={monster} />
                  <ExtraContainerMonsterCurrentHp monster={monster} displayMonster={displayMonster} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MonsterContainer;
