import React, { useEffect, useMemo, useState } from 'react';
import dagger from '@/public/img/bonuses/dagger.png';
import scimitar from '@/public/img/bonuses/scimitar.png';
import warhammer from '@/public/img/bonuses/warhammer.png';
import magic from '@/public/img/bonuses/magic.png';
import ranged from '@/public/img/bonuses/ranged.png';
import hitpoints from '@/public/img/bonuses/hitpoints.png';
import attack from '@/public/img/bonuses/attack.png';
import strength from '@/public/img/bonuses/strength.png';
import defence from '@/public/img/bonuses/defence.png';
import mining from '@/public/img/bonuses/mining.png';
import magicStrength from '@/public/img/bonuses/magic_strength.png';
import rangedStrength from '@/public/img/bonuses/ranged_strength.png';
import toaRaidLevel from '@/public/img/toa_raidlevel.webp';
import raidsIcon from '@/public/img/raids_icon.webp';
import coxCmIcon from '@/public/img/cox_challenge_mode.png';
import { useStore } from '@/state';
import { observer } from 'mobx-react-lite';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import { getCdnImage } from '@/utils';
import PresetAttributeButton from '@/app/components/monster/PresetAttributeButton';
import NumberInput from '@/app/components/generic/NumberInput';
import {
  GUARDIAN_IDS,
  PARTY_SIZE_REQUIRED_MONSTER_IDS,
  TOMBS_OF_AMASCUT_MONSTER_IDS,
  TOMBS_OF_AMASCUT_PATH_MONSTER_IDS,
} from '@/lib/constants';
import {
  IconChevronDown,
  IconChevronUp,
  IconExternalLink,
} from '@tabler/icons-react';
import { scaledMonster } from '@/lib/MonsterScaling';
import { Monster } from '@/types/Monster';
import LazyImage from '@/app/components/generic/LazyImage';
import Toggle from '@/app/components/generic/Toggle';
import { toJS } from 'mobx';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import DefensiveReductions from '@/app/components/monster/DefensiveReductions';
import MonsterSelect from './MonsterSelect';
import HelpLink from '../HelpLink';
import AttributeInput from '../generic/AttributeInput';

interface ITombsOfAmascutMonsterContainerProps {
  monster: Monster;
  isPathMonster?: boolean;
}

const TombsOfAmascutMonsterContainer: React.FC<ITombsOfAmascutMonsterContainerProps> = (props) => {
  const store = useStore();
  const { monster, isPathMonster } = props;

  return (
    <>
      <div className="mt-4">
        <h4 className="font-bold font-serif">
          <img src={toaRaidLevel.src} alt="" className="inline-block" />
          {' '}
          ToA raid level
        </h4>
        <div className="mt-2">
          <NumberInput
            value={monster.inputs.toaInvocationLevel}
            min={0}
            max={600}
            step={5}
            onChange={(v) => store.updateMonster({ inputs: { toaInvocationLevel: v } })}
          />
        </div>
      </div>
      {isPathMonster && (
        <div className="mt-4">
          <h4 className="font-bold font-serif">
            <img src={toaRaidLevel.src} alt="" className="inline-block" />
            {' '}
            ToA path level
          </h4>
          <div className="mt-2">
            <NumberInput
              value={monster.inputs.toaPathLevel}
              min={0}
              max={6}
              step={1}
              onChange={(v) => store.updateMonster({ inputs: { toaPathLevel: v } })}
            />
          </div>
        </div>
      )}
    </>
  );
};

const MonsterContainer: React.FC = observer(() => {
  const store = useStore();
  const { loadouts, monster, prefs } = store;
  const [attributesExpanded, setAttributesExpanded] = useState(false);

  // Don't automatically update the stat inputs if manual editing is on
  const displayMonster = prefs.manualMode ? monster : scaledMonster(monster);

  useEffect(() => {
    // When display monster HP is changed, update the monster's current HP
    if (store.monster.inputs.monsterCurrentHp !== displayMonster.skills.hp) {
      store.updateMonster({ inputs: { monsterCurrentHp: displayMonster.skills.hp } });
    }
  }, [store, displayMonster.skills.hp]);

  const extraMonsterOptions = useMemo(() => {
    // Determine whether we need to show any extra monster option components
    const comps: React.ReactNode[] = [];

    if ((TOMBS_OF_AMASCUT_MONSTER_IDS.includes(monster.id))) {
      comps.push(
        <TombsOfAmascutMonsterContainer
          key="toa"
          monster={monster}
          isPathMonster={(TOMBS_OF_AMASCUT_PATH_MONSTER_IDS.includes(monster.id))}
        />,
      );
    }

    if (monster.attributes.includes(MonsterAttribute.XERICIAN)) {
      comps.push(
        <div className="mt-4" key="cox-cm">
          <h4 className="font-bold font-serif">
            <img src={coxCmIcon.src} alt="" className="inline-block" />
            {' '}
            Challenge Mode
          </h4>
          <div className="mt-2">
            <Toggle
              checked={monster.inputs.isFromCoxCm}
              setChecked={(c) => store.updateMonster({ inputs: { isFromCoxCm: c } })}
            />
          </div>
        </div>,
      );
    }

    if ((PARTY_SIZE_REQUIRED_MONSTER_IDS.includes(monster.id)) || monster.attributes.includes(MonsterAttribute.XERICIAN)) {
      comps.push(
        <div className="mt-4" key="party-size">
          <h4 className="font-bold font-serif">
            <img src={raidsIcon.src} alt="" className="inline-block" />
            {' '}
            Party size
          </h4>
          <div className="mt-2">
            <NumberInput
              value={monster.inputs.partySize}
              min={1}
              max={100}
              step={1}
              onChange={(v) => store.updateMonster({ inputs: { partySize: v } })}
            />
          </div>
        </div>,
      );
    }

    if (monster.attributes.includes(MonsterAttribute.XERICIAN)) {
      comps.push(
        <div className="mt-4" key="cox-cb">
          <h4 className="font-bold font-serif">
            <img src={raidsIcon.src} alt="" className="inline-block" />
            {' '}
            Party&apos;s highest combat level
          </h4>
          <div className="mt-2">
            <NumberInput
              value={monster.inputs.partyMaxCombatLevel}
              min={3}
              max={126}
              step={1}
              onChange={(v) => store.updateMonster({ inputs: { partyMaxCombatLevel: v } })}
            />
          </div>
        </div>,
      );

      comps.push(
        <div className="mt-4" key="cox-hp">
          <h4 className="font-bold font-serif">
            <img src={raidsIcon.src} alt="" className="inline-block" />
            {' '}
            Party&apos;s highest HP level
          </h4>
          <div className="mt-2">
            <NumberInput
              value={monster.inputs.partyMaxHpLevel}
              min={1}
              max={99}
              step={1}
              onChange={(v) => store.updateMonster({ inputs: { partyMaxHpLevel: v } })}
            />
          </div>
        </div>,
      );
    }

    if ((GUARDIAN_IDS.includes(monster.id))) {
      comps.push(
        <div className="mt-4" key="cox-guardian">
          <h4 className="font-bold font-serif">
            <img src={mining.src} alt="" className="inline-block" />
            {' '}
            Party&apos;s average mining level
          </h4>
          <div className="mt-2">
            <NumberInput
              value={monster.inputs.partyAvgMiningLevel}
              min={1}
              max={99}
              step={1}
              onChange={(v) => store.updateMonster({ inputs: { partyAvgMiningLevel: v } })}
            />
          </div>
        </div>,
      );
    }

    if (loadouts.some((l) => PlayerVsNPCCalc.distIsCurrentHpDependent(l, monster))) {
      comps.push(
        <div className="mt-4" key="cox-guardian">
          <h4 className="font-bold font-serif">
            <img src={hitpoints.src} alt="" className="inline-block" />
            {' '}
            Monster&apos;s Current HP
          </h4>
          <div className="mt-2">
            <NumberInput
              value={monster.inputs.monsterCurrentHp}
              min={0}
              max={displayMonster.skills.hp}
              step={1}
              onChange={(v) => store.updateMonster({ inputs: { monsterCurrentHp: v } })}
            />
          </div>
        </div>,
      );
    }

    return comps;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toJS(loadouts), toJS(monster), displayMonster.skills.hp]);

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
                {(extraMonsterOptions.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-x-4">
                    {extraMonsterOptions}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MonsterContainer;
