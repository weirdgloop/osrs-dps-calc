import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { IReactionDisposer, makeAutoObservable } from 'mobx';
import PlayerStore from '@/state/PlayerStore';
import { usePlayer } from '@/state/LoadoutStore';
import { EquipmentIssue, MonsterIssue, SpellIssue } from '@/enums/UserIssue';
import { MonsterStore, useMonster } from '@/state/MonsterStore';
import { LoadoutId } from '@/types/Player';

/**
 * Issues highlight things that may prevent calculation, or produce misleading results.
 * ~All of the entries here should be computeds rather than inputs.
 */
export class IssuesStore {
  readonly #reactionDisposers: IReactionDisposer[] = [];

  constructor(
    private readonly monsterStore: MonsterStore,
    private readonly playerStore: PlayerStore,
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // todo(mobx)
  // eslint-disable-next-line class-methods-use-this
  startUp() {
  }

  shutDown() {
    this.#reactionDisposers.forEach((d) => d());
  }

  public get unimplementedPacts(): string[] {
    const leaguesEffects = this.playerStore.derivedPlayer.leagues.six.effects;
    const unimplemented: string[] = [];
    if (leaguesEffects.talent_fire_spell_burn_bounce) {
      unimplemented.push('Fire Spell Burn (coming soon)');
    }
    if (leaguesEffects.talent_max_hit_style_swap) {
      unimplemented.push('Style Swap Damage Bonus');
    }
    if (leaguesEffects.talent_thorns_damage || leaguesEffects.talent_shield_reflect) {
      unimplemented.push('Thorns');
    }
    if (leaguesEffects.talent_overheal_consumption_boost || leaguesEffects.talent_fire_hp_consume_for_damage) {
      unimplemented.push('Overheal Consumption Effects');
    }
    return unimplemented;
  }

  // eslint-disable-next-line class-methods-use-this
  public get monsterIssues(): MonsterIssue[] {
    // nothing to do at the moment
    return [];
  }

  // todo(mobx)
  // eslint-disable-next-line class-methods-use-this
  public get equipmentIssues(): Map<LoadoutId, EquipmentIssue[]> {
    return new Map();
  }

  // todo(mobx)
  // eslint-disable-next-line class-methods-use-this
  public get spellIssues(): Map<LoadoutId, SpellIssue[]> {
    return new Map();
  }

  // todo(mobx)
  // eslint-disable-next-line class-methods-use-this
  public get specIssues(): Map<LoadoutId, string> {
    return new Map();
  }
}

const IssuesContext = createContext<IssuesStore>({} as IssuesStore);

export const IssuesProvider: React.FC<{ value: IssuesStore, children: React.ReactNode }> = ({ value, children }) => (
  <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>
);

export const DefaultIssuesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const monsterStore = useMonster();
  const playerStore = usePlayer();
  const issuesStore = useMemo(() => new IssuesStore(monsterStore, playerStore), [monsterStore, playerStore]);
  return (
    <IssuesProvider value={issuesStore}>{children}</IssuesProvider>
  );
};

export const useIssues = () => useContext(IssuesContext);
