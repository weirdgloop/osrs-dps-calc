import { createContext } from 'react';
import useRequiredContext from '@/state/useRequiredContext';
import {
  comparer, makeAutoObservable, observable, reaction,
} from 'mobx';
import { INFINITE_HEALTH_MONSTERS } from '@/lib/constants';
import { CompareResult } from '@/lib/Comparator';
import { DetailEntry } from '@/lib/CalcDetails';
import { LoadoutId } from '@/types/Player';
import { ChartEntry } from '@/types/Charts';
import UserIssueType from '@/enums/UserIssueType';
import { CompareRequest, LoadoutCalcData, WorkerRequestType } from '@/worker/CalcWorkerTypes';
import type { CalcWorker } from '@/worker/CalcWorker';
import LoadoutStore from '@/state/LoadoutStore';
import { MonsterStore } from '@/state/MonsterStore';
import { PreferencesStore } from '@/state/PreferencesStore';
import { UIStore } from '@/state/UIStore';

export interface UserIssue {
  type: UserIssueType;
  message: string;
}

/**
 * The result of running the calculator on a specific player loadout.
 */
export interface CalculatedLoadout {
  userIssues?: UserIssue[],
}

// Player vs NPC metrics
export interface BasicResult extends CalculatedLoadout {
  userIssues: UserIssue[],
  details: DetailEntry[],

  npcDefRoll: number,
  maxHit: number,
  expectedHit: number,
  maxAttackRoll: number,
  accuracy: number,
  dps: number,
  ttk: number,
  hitDist: ChartEntry[],

  // only set when the weapon has a special attack
  specDetails?: DetailEntry[],
  specAccuracy?: number,
  specMaxHit?: number,
  specExpected?: number,
  specMomentDps?: number,
  specFullDps?: number,
  specHitDist?: ChartEntry[],
}

// NPC vs Player metrics
export interface ReverseResult extends CalculatedLoadout {
  npcDetails?: DetailEntry[],

  playerDefRoll?: number,
  npcMaxAttackRoll?: number,
  npcMaxHit?: number,
  npcDps?: number,
  npcAccuracy?: number,
  avgDmgTaken?: number,
}

export interface TtkResult {
  ttkDist: Map<number, number>,
}

/**
 * The state of one kind of calculation for one loadout.
 */
export type CalcStatus<T> =
  | { status: 'not-requested' }
  | { status: 'pending' }
  | { status: 'failed', error: string }
  | { status: 'success', value: T };

export interface LoadoutResults {
  basic: CalcStatus<BasicResult>;
  reverse: CalcStatus<ReverseResult>;
  ttk: CalcStatus<TtkResult>;
}

export interface CalcRequest extends LoadoutCalcData {
  includeTtk: boolean;
}

export class CalcStore {
  results = new Map<LoadoutId, LoadoutResults>();

  compareResult: CompareResult | undefined = undefined;

  #generation = 0;

  #compareGeneration = 0;

  readonly #loadouts: LoadoutStore;

  readonly #monster: MonsterStore;

  readonly #preferences: PreferencesStore;

  readonly #ui: UIStore;

  constructor(loadouts: LoadoutStore, monster: MonsterStore, preferences: PreferencesStore, ui: UIStore) {
    this.#loadouts = loadouts;
    this.#monster = monster;
    this.#preferences = preferences;
    this.#ui = ui;

    makeAutoObservable(this, {
      // results are large and replaced wholesale, so only the containers are observable
      results: observable.shallow,
      compareResult: observable.ref,
    }, { autoBind: true });
  }

  get request(): CalcRequest {
    return {
      loadouts: new Map(this.#loadouts.loadouts.map((l) => [l.uuid, l.snapshot])),
      monster: this.#monster.snapshot,
      calcOpts: {
        hitDistHideMisses: this.#preferences.hitDistsHideZeros,
        detailedOutput: this.#ui.debug,
        disableMonsterScaling: this.#monster.isCustom,
      },
      includeTtk: this.#preferences.showTtkComparison && !INFINITE_HEALTH_MONSTERS.includes(this.#monster.id),
    };
  }

  /**
   * null while the comparison is collapsed.
   */
  get compareRequest(): CompareRequest['data'] | null {
    if (!this.#preferences.showLoadoutComparison) {
      return null;
    }
    return {
      loadouts: this.request.loadouts,
      monster: this.request.monster,
      axes: { x: this.#ui.compareXAxis, y: this.#ui.compareY },
    };
  }

  get userIssues(): Map<LoadoutId, UserIssue[]> {
    return new Map(this.#loadouts.loadouts.map((l) => {
      const results = this.results.get(l.uuid);
      const issues = [results?.basic, results?.reverse].flatMap((r) => (r?.status === 'success' ? r.value.userIssues ?? [] : []));
      return [l.uuid, issues] as const;
    }));
  }

  start(worker: Pick<CalcWorker, 'do'>): () => void {
    const disposers = [
      reaction(() => this.request, (request) => this.runCalc(worker, request), { equals: comparer.structural, fireImmediately: true }),
      reaction(() => this.compareRequest, (request) => this.runCompare(worker, request), { equals: comparer.structural, fireImmediately: true }),
    ];
    return () => disposers.forEach((dispose) => dispose());
  }

  private runCalc(worker: Pick<CalcWorker, 'do'>, request: CalcRequest) {
    this.#generation += 1;
    const generation = this.#generation;
    const { includeTtk, ...data } = request;

    const ttkStatus: CalcStatus<never> = { status: includeTtk ? 'pending' : 'not-requested' };
    this.results.clear();
    for (const id of data.loadouts.keys()) {
      this.results.set(id, { basic: { status: 'pending' }, reverse: { status: 'pending' }, ttk: ttkStatus });
    }

    // using .then(success, fail) instead of .catch is preferred since .catch would
    // include error handling from errors in apply, not just the worker calc call
    worker.do({ type: WorkerRequestType.COMPUTE_BASIC, data }).then(
      (res) => this.apply(generation, 'basic', res.payload),
      (e: unknown) => this.fail(generation, 'basic', e),
    );
    worker.do({ type: WorkerRequestType.COMPUTE_REVERSE, data }).then(
      (res) => this.apply(generation, 'reverse', res.payload),
      (e: unknown) => this.fail(generation, 'reverse', e),
    );
    if (includeTtk) {
      const type = process.env.NEXT_PUBLIC_SERIAL_TTK === 'true' ? WorkerRequestType.COMPUTE_TTK : WorkerRequestType.COMPUTE_TTK_PARALLEL;
      worker.do({ type, data }).then(
        (res) => this.apply(generation, 'ttk', res.payload),
        (e: unknown) => this.fail(generation, 'ttk', e),
      );
    }
  }

  private apply<K extends keyof LoadoutResults>(generation: number, kind: K, statuses: Map<LoadoutId, LoadoutResults[K]>) {
    if (generation !== this.#generation) {
      return;
    }

    for (const [id, status] of statuses) {
      this.setStatus(id, kind, status);
    }
  }

  /**
   * A failed request fails that kind of calculation for every loadout in it.
   */
  private fail(generation: number, kind: keyof LoadoutResults, e: unknown) {
    if (generation !== this.#generation) {
      return;
    }

    console.error(`[CalcStore] ${kind} calculation failed`, e);
    const error = e instanceof Error ? e.message : String(e);
    for (const id of this.results.keys()) {
      this.setStatus(id, kind, { status: 'failed', error });
    }
  }

  private setStatus<K extends keyof LoadoutResults>(id: LoadoutId, kind: K, status: LoadoutResults[K]) {
    const current = this.results.get(id);
    if (current) {
      const next = { ...current };
      next[kind] = status;
      this.results.set(id, next);
    }
  }

  private runCompare(worker: Pick<CalcWorker, 'do'>, data: CompareRequest['data'] | null) {
    this.#compareGeneration += 1;
    const generation = this.#compareGeneration;

    if (!data) {
      this.compareResult = undefined;
      return;
    }

    worker.do({ type: WorkerRequestType.COMPARE, data })
      .then((res) => this.applyCompareResult(generation, res.payload))
      .catch((e: unknown) => console.error('[CalcStore] Comparison failed', e));
  }

  private applyCompareResult(generation: number, result: CompareResult) {
    if (generation === this.#compareGeneration) {
      this.compareResult = result;
    }
  }
}

export const CalcStoreContext = createContext<CalcStore | null>(null);

export const useCalc = () => useRequiredContext(CalcStoreContext, 'useCalc');
