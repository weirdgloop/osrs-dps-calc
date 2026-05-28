import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { IReactionDisposer, makeAutoObservable, reaction } from 'mobx';
import { PartialDeep } from 'type-fest';
import merge from 'lodash.mergewith';
import { CUSTOM_MONSTER_ID, MONSTER_PHASES_BY_ID } from '@/lib/constants';
import { scaleMonster } from '@/lib/MonsterScaling';
import { PreferencesStore, usePreferences } from '@/state/Preferences';
import { observer } from 'mobx-react-lite';
import { getDefenceFloor } from '@/lib/scaling/DefenceReduction';
import { MERGE_OVERWRITE_ARRAYS } from '@/utils';
import { createDefaultMonster, getMonsters, Monster } from '@/types/Monster';

export class MonsterStore {
  monsterBase: Monster = createDefaultMonster();

  readonly #reactionDisposers: IReactionDisposer[] = [];

  constructor(
    private readonly preferencesStore: PreferencesStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  startUp() {
    // whenever the monster id is changed, or the max hp changes, reset the current hp to max
    this.#reactionDisposers.push(reaction(
      () => [this.monsterBase.id, this.monster.skills.hp],
      () => {
        this.updateMonsterBase({ inputs: { monsterCurrentHp: this.monsterBase.skills.hp } });
      },
    ));

    // whenever the monster id is changed, reset the phase to the first option available (or none)
    this.#reactionDisposers.push(reaction(
      () => [this.monsterBase.id],
      () => {
        const newPhase = this.monsterBase.id in MONSTER_PHASES_BY_ID ? MONSTER_PHASES_BY_ID[this.monsterBase.id][0] : undefined;
        this.updateMonsterBase({ inputs: { phase: newPhase } });
      },
    ));
  }

  public shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  get isCustomMonster(): boolean {
    return this.monsterBase.id === CUSTOM_MONSTER_ID;
  }

  get monster(): Monster {
    if (this.preferencesStore.manualMode || this.isCustomMonster) {
      // in manual mode, we don't want to overwrite the modifications done by the user
      return this.monsterBase;
    }

    return scaleMonster(this.monsterBase);
  }

  get defenceFloor(): number {
    return getDefenceFloor(this.monsterBase);
  }

  public updateMonsterBase(newValues: PartialDeep<Monster>) {
    merge(this.monsterBase, newValues, MERGE_OVERWRITE_ARRAYS);
  }

  public loadMonster(id: number) {
    const isCustom = id === CUSTOM_MONSTER_ID;
    if (isCustom) {
      this.updateMonsterBase(createDefaultMonster());
      return;
    }

    const newMonster = getMonsters().find((m) => m.id === id);
    if (newMonster) {
      this.updateMonsterBase(newMonster);
    }
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
  const preferencesStore = usePreferences();
  const monsterStore = useMemo(() => new MonsterStore(preferencesStore), [preferencesStore]);
  useEffect(() => {
    monsterStore.startUp();
    return () => monsterStore.shutDown();
  }, [monsterStore]);
  return (
    <MonsterProvider value={monsterStore}>{children}</MonsterProvider>
  );
});

export const useMonster = () => useContext(MonsterContext);
