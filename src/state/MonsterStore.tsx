import React, { createContext, useContext, useEffect } from 'react';
import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { PartialDeep } from 'type-fest';
import { isCombatStyleType } from '@/types/PlayerCombatStyle';
import { MonsterAttribute } from '@/enums/MonsterAttribute';
import {
  BurnImmunity,
  createDefaultMonster,
  createDefaultMonsterInputs,
  Monster,
  MonsterInputs,
  MonsterWeakness,
} from '@/types/Monster';
import { MonsterDb, useMonsterDb } from '@/db/MonsterDb';
import merge from 'lodash.mergewith';
import { CUSTOM_MONSTER_ID, MONSTER_PHASES_BY_ID } from '@/lib/constants';
import { scaleMonster } from '@/lib/MonsterScaling';
import { Preferences, usePreferences } from '@/state/Preferences';
import { observer } from 'mobx-react-lite';
import { getDefenceFloor } from '@/lib/scaling/DefenceReduction';
import { MERGE_OVERWRITE_ARRAYS } from '@/utils';

export class MonsterStore {
  monster: Monster = createDefaultMonster();

  inputs: MonsterInputs = createDefaultMonsterInputs();

  #reactionDisposers: IReactionDisposer[] = [];

  constructor(
    private readonly monsterDb: MonsterDb,
    private readonly preferences: Preferences,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });

    if (!this.monsterDb.loaded) {
      throw new Error('Monster DB not loaded!');
    }

    // whenever the monster id is changed, or the max hp changes, reset the current hp to max
    this.#reactionDisposers.push(reaction(
      () => this.scaledMonster,
      (newMonster, previousMonster) => {
        if (previousMonster.id !== this.monster.id || previousMonster.skills.hp !== newMonster.skills.hp) {
          this.updateInputs({ monsterCurrentHp: this.monster.skills.hp });
        }
      },
    ));

    // whenever the monster id is changed, reset the phase to the first option available (or none)
    this.#reactionDisposers.push(reaction(
      () => this.monster,
      (newMonster, previousMonster) => {
        if (previousMonster.id !== newMonster.id) {
          const newPhase = newMonster.id in MONSTER_PHASES_BY_ID ? MONSTER_PHASES_BY_ID[newMonster.id][0] : undefined;
          this.updateInputs({ phase: newPhase });
        }
      },
    ));
  }

  public shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  get isCustomMonster(): boolean {
    return this.monster.id === CUSTOM_MONSTER_ID;
  }

  get scaledMonster(): Monster {
    if (this.preferences.manualMode || this.isCustomMonster) {
      // in manual mode, we don't want to overwrite the modifications done by the user
      return this.monster;
    }

    return scaleMonster(this.monster, this.inputs);
  }

  get defenceFloor(): number {
    return getDefenceFloor(this.monster);
  }

  public updateMonster(newValues: PartialDeep<Monster>) {
    this.monster = merge(this.monster, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  public updateInputs(newValues: PartialDeep<MonsterInputs>) {
    this.inputs = merge(this.inputs, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  public loadMonster(id: number) {
    const isCustom = id === CUSTOM_MONSTER_ID;
    if (isCustom) {
      this.updateMonster(createDefaultMonster());
      return;
    }

    const raw = this.monsterDb.find(id);
    if (!raw) {
      return;
    }

    const maxHit = parseInt(raw.max_hit.toString());
    const styleStr = raw.style?.join(',').toLowerCase() ?? null;
    this.updateMonster({
      id: raw.id,
      name: raw.name,
      version: raw.version,
      image: raw.image,
      size: raw.size,
      speed: raw.speed,
      style: isCombatStyleType(styleStr) ? styleStr : null,
      maxHit: Number.isNaN(maxHit) ? 0 : maxHit,
      skills: raw.skills,
      offensive: raw.offensive,
      defensive: raw.defensive,
      attributes: raw.attributes as MonsterAttribute[],
      weakness: (raw.weakness ?? null) as (MonsterWeakness | null),
      immunities: {
        burn: raw.immunities.burn as BurnImmunity,
      },
      isSlayerMonster: raw.is_slayer_monster ?? false,
    });
  }
}

const MonsterContext = createContext<MonsterStore>({} as MonsterStore);

export const MonsterProvider: React.FC<{ value: MonsterStore, children: React.ReactNode }> = ({
  value,
  children,
}) => (
  <MonsterContext.Provider value={value}>{children}</MonsterContext.Provider>
);

export const DefaultMonsterProvider: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const db = useMonsterDb();
  const { preferences } = usePreferences();
  const monster = new MonsterStore(db, preferences);

  useEffect(() => () => monster.shutDown());

  return (
    <MonsterProvider value={monster}>{children}</MonsterProvider>
  );
});

export const useMonster = () => useContext(MonsterContext);
