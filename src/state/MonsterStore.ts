import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import { makeAutoObservable, reaction, toJS } from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import { Monster } from '@/types/Monster';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  CUSTOM_MONSTER_BASE, CUSTOM_MONSTER_ID, DEFAULT_MONSTER_ID, getMonsters, INITIAL_MONSTER_INPUTS,
} from '@/lib/Monsters';
import { MONSTER_PHASES_BY_ID } from '@/lib/constants';
import { scaleMonster } from '@/lib/MonsterScaling';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import { createEmptyPlayer } from '@/state/PlayerStore';

// The "base" monster, i.e. an NPC without scaling, or a custom user-provided monster
export type MonsterDefinition = Omit<Monster, 'inputs'>;

// omit deprecated fields
export type MonsterInputs = Omit<Monster['inputs'], 'partyAvgMiningLevel' | 'tormentedDemonPhase'>;

const NON_STANDARD_STYLES = ['slash', 'crush', 'stab', 'magic', 'ranged'];

export const availableMonsters: readonly MonsterDefinition[] = getMonsters();

// the loadout that the max hit discrepancy check is calculated against
const EMPTY_PLAYER = createEmptyPlayer();

const replaceArrays = (_: unknown, src: unknown) => (Array.isArray(src) ? src : undefined);

const createMonsterInputs = (monsterId: number): MonsterInputs => ({
  ...INITIAL_MONSTER_INPUTS,
  defenceReductions: { ...INITIAL_MONSTER_INPUTS.defenceReductions },
  phase: MONSTER_PHASES_BY_ID[monsterId]?.[0],
});

const toMonsterInputs = (monsterId: number, inputs: Partial<Monster['inputs']>): MonsterInputs => {
  const { partyAvgMiningLevel, tormentedDemonPhase, ...monsterInputs } = inputs;
  const phases = MONSTER_PHASES_BY_ID[monsterId];
  const phase = monsterInputs.phase !== undefined && phases?.includes(monsterInputs.phase) ? monsterInputs.phase : phases?.[0];
  return { ...merge(createMonsterInputs(monsterId), monsterInputs), phase };
};

const { inputs: customInputs, ...CUSTOM_MONSTER_DEFINITION } = CUSTOM_MONSTER_BASE;

export class MonsterStore {
  definition: MonsterDefinition;

  inputs: MonsterInputs;

  constructor() {
    this.definition = availableMonsters.find((m) => m.id === DEFAULT_MONSTER_ID) ?? CUSTOM_MONSTER_DEFINITION;
    this.inputs = createMonsterInputs(this.definition.id);
    this.inputs.monsterCurrentHp = this.maxHp;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  start(): () => void {
    return reaction(() => this.maxHp, (maxHp) => this.updateInputs({ monsterCurrentHp: maxHp }));
  }

  get id(): number {
    return this.definition.id;
  }

  get isCustom(): boolean {
    return this.id === CUSTOM_MONSTER_ID;
  }

  get isNonStandard(): boolean {
    return !NON_STANDARD_STYLES.includes(this.definition.style || '');
  }

  get phases(): readonly string[] | undefined {
    return MONSTER_PHASES_BY_ID[this.id];
  }

  get maxHp(): number {
    if (this.isCustom) {
      return this.definition.skills.hp;
    }
    return scaleMonster(this.#prescalingMonster(Number.POSITIVE_INFINITY)).skills.hp;
  }

  get snapshot(): Monster {
    return { ...toJS(this.definition), inputs: toJS(this.inputs) };
  }

  get scaled(): Monster {
    const monster = this.#prescalingMonster(this.inputs.monsterCurrentHp);
    return this.isCustom ? monster : scaleMonster(monster);
  }

  /**
   * Whether the wiki max hit differs from the one we calculate against an empty loadout.
   */
  get hasMaxHitDiscrepancy(): boolean {
    const { maxHit } = this.definition;
    if (this.isCustom || maxHit === undefined) {
      return false;
    }
    return maxHit !== new NPCVsPlayerCalc(EMPTY_PLAYER, this.snapshot).getNPCMaxHit();
  }

  /**
   * Switch to a different monster. Resets inputs.
   */
  select(definition: MonsterDefinition) {
    this.definition = definition;
    this.inputs = createMonsterInputs(definition.id);
    this.inputs.monsterCurrentHp = this.maxHp;
  }

  selectCustom() {
    this.select(CUSTOM_MONSTER_DEFINITION);
  }

  /**
   * Replace the monster and its inputs wholesale, e.g. from a shortlink.
   */
  load(definition: MonsterDefinition, inputs: Partial<Monster['inputs']>) {
    this.definition = definition;
    this.inputs = toMonsterInputs(definition.id, inputs);
    if (inputs.monsterCurrentHp === undefined) {
      this.inputs.monsterCurrentHp = this.maxHp;
    }
  }

  /**
   * Edit the base monster's stats. Used for custom monsters, and for any monster in manual mode.
   */
  updateDefinition(patch: PartialDeep<MonsterDefinition>) {
    merge(this.definition, patch, replaceArrays);
  }

  updateInputs(patch: PartialDeep<MonsterInputs>) {
    merge(this.inputs, patch, replaceArrays);
  }

  toggleAttribute(attr: MonsterAttribute) {
    const { attributes } = this.definition;
    this.definition.attributes = attributes.includes(attr)
      ? attributes.filter((a) => a !== attr)
      : [...attributes, attr];
  }

  #prescalingMonster(monsterCurrentHp: number): Monster {
    return {
      ...this.definition,
      inputs: {
        ...this.inputs,
        monsterCurrentHp,
      },
    };
  }
}

export const MonsterContext = createContext<MonsterStore | null>(null);

export const useMonster = () => useRequiredContext(MonsterContext, 'useMonster');
