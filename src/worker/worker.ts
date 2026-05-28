/* eslint-disable no-restricted-globals */
import {
  CalcRequestsUnion,
  CalcResponse,
  Handler,
  TtkRequest,
  TtkResponse,
  WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import Comparator from '@/lib/Comparator';
import { BasicResult, CalcState, ReverseResult } from '@/types/Results';
import { JSON_REPLACER, JSON_REVIVER } from '@/utils/serde';
import { FeatureStatus } from '@/utils';
import DeferredPromise from '../utils/DeferredPromise';

const computeBasic: Handler<WorkerRequestType.COMPUTE_BASIC> = async (data) => {
  const { player, monster, calcOpts } = data;

  const loadoutName = player.name;
  const start = self.performance.now();

  const calc = new PlayerVsNPCCalc(player, monster, {
    loadoutName,
    detailedOutput: calcOpts.detailedOutput,
  });

  const specStatus = calc.isSpecSupported();
  let specCalc: PlayerVsNPCCalc | undefined;
  if (specStatus === FeatureStatus.IMPLEMENTED || specStatus === FeatureStatus.PARTIALLY_IMPLEMENTED) {
    specCalc = new PlayerVsNPCCalc(player, monster, {
      loadoutName,
      detailedOutput: calcOpts.detailedOutput,
      usingSpecialAttack: true,
    });
  }

  const res: BasicResult = {
    state: CalcState.COMPLETE,

    details: calc.details,
    maxAttackRoll: calc.getMaxAttackRoll(),
    npcDefRoll: calc.getNPCDefenceRoll(),
    accuracy: calc.getDisplayHitChance(),
    maxHit: calc.getDistribution().getMax(),
    expectedHit: calc.getDistribution().getExpectedDamage(),
    dps: calc.getDps(),
    ttk: calc.getTtk(),
    hitDist: calc.getDistribution().asHistogram(),

    specStatus,
    specDetails: specCalc?.details,
    specMaxAttackRoll: specCalc?.getMaxAttackRoll(),
    specNpcDefRoll: specCalc?.getNPCDefenceRoll(),
    specAccuracy: specCalc?.getDisplayHitChance(),
    specMaxHit: specCalc?.getDistribution().getMax(),
    specExpectedHit: specCalc?.getDistribution().getExpectedDamage(),
    specMomentDps: specCalc?.getDps(),
    specFullDps: specCalc?.getSpecDps(),
    specHitDist: specCalc?.getDistribution().asHistogram(),
  };

  const end = self.performance.now();
  console.debug(`Loadout ${loadoutName} took ${end - start}ms to calculate`);

  return res;
};

const computeReverse: Handler<WorkerRequestType.COMPUTE_REVERSE> = async (data) => {
  const { player, monster, calcOpts } = data;

  const loadoutName = `${player.name}/reverse`;
  const start = self.performance.now();
  const calc = new NPCVsPlayerCalc(player, monster, {
    loadoutName: `${loadoutName}/reverse`,
    detailedOutput: calcOpts.detailedOutput,
  });

  const ret: ReverseResult = {
    state: CalcState.COMPLETE,

    details: calc.details,
    npcMaxAttackRoll: calc.getNPCMaxAttackRoll(),
    playerDefRoll: calc.getPlayerDefenceRoll(),
    npcAccuracy: calc.getHitChance(),
    npcMaxHit: calc.getDistribution().getMax(),
    npcDps: calc.getDps(),
    avgDmgTaken: calc.getAverageDamageTaken(),
  };

  const end = self.performance.now();
  console.debug(`Reverse loadout ${loadoutName} took ${end - start}ms to calculate`);

  return ret;
};

const compare: Handler<WorkerRequestType.COMPARE> = async (data) => {
  const { axes, loadouts, monster } = data;
  const comparator = new Comparator(loadouts, monster, axes.x, axes.y);

  const [entries, domainMax] = comparator.getEntries();

  return {
    entries,
    annotations: {
      x: comparator.getAnnotationsX(),
      y: comparator.getAnnotationsY(),
    },
    domainMax,
  };
};

// workers that compute a single ttk dist and then terminate
type OneShotWorker<T> = { promise: DeferredPromise<T>, worker: Worker };
const createTtkWorker = (): OneShotWorker<TtkResponse> => {
  const promise = new DeferredPromise<TtkResponse>();
  const worker = new Worker(new URL('./ttkWorker.ts', import.meta.url));
  worker.onmessage = (evt: MessageEvent) => {
    const result = JSON.parse(evt.data, JSON_REVIVER);
    worker.terminate();
    promise.resolve(result);
  };
  worker.onerror = (ev: ErrorEvent) => console.error(ev.message, ev);
  return { promise, worker };
};

const ttkWorkers: [OneShotWorker<TtkResponse> | undefined, OneShotWorker<TtkResponse> | undefined] = [
  undefined,
  createTtkWorker(),
];
let currentJob: number = 0; // whether we use first set or second set
let lastSequenceId: number = -1;

/**
 * proxies two sets of downstream workers in order
 *   a) compute each ttk dist in parallel
 *   b) be cancellable via terminate()
 *   c) keep a "warm" pool of computers
 * the `i % {NUMBER_OF_LOADOUTS}`th ttkWorker corresponds to the `i`th loadout index
 * unfortunately we can't reuse CalcWorker due to cyclic imports
 */
const ttkDistParallel: Handler<WorkerRequestType.COMPUTE_TTK> = async (data, rawRequest) => {
  const { sequenceId } = rawRequest;
  const { player, monster, calcOpts } = data;
  lastSequenceId = sequenceId!;

  // kill the opposite in-progress worker immediately
  ttkWorkers[currentJob % 2]?.worker?.terminate();
  currentJob += 1;

  // fire off a ttk compute for each loadout
  const start = self.performance.now();

  // ideally this never creates inline, but it's fine if it does
  const { promise, worker } = ttkWorkers[currentJob] ?? (ttkWorkers[currentJob] = createTtkWorker());
  worker.postMessage(JSON.stringify(<TtkRequest>{
    type: WorkerRequestType.COMPUTE_TTK,
    sequenceId: sequenceId!,
    data: {
      player, // we're just splitting up the payloads into one per worker
      monster,
      calcOpts,
    },
  }));

  // while we wait for the jobs to finish we can spin up the worker for the next request
  ttkWorkers[(currentJob + 1) % 2] = createTtkWorker();

  // this is where the "parallel" magic happens,
  // since await clears the call stack allowing other requests to come in and cancel the previous
  // todo it would be pretty nice if we could stream these back instead of batching
  const result = await promise.promise;
  const end = self.performance.now();
  console.debug(`TTK dist ${player.name}/seq${sequenceId} took ${end - start}`);

  // only need to check first elt, since all reqs in requests array are guaranteed to match
  if (result.sequenceId !== lastSequenceId) {
    // this shouldn't really happen except in rare race conditions,
    // but it'll get dropped by CalcWorker on return so we can return empty
    console.debug(`Dropping ttk parallel ${result.sequenceId} as stale`);
    return {
      state: CalcState.NOT_APPLICABLE,
    };
  }

  return result.payload;
};

self.onmessage = async (evt: MessageEvent<string>) => {
  const req = JSON.parse(evt.data, JSON_REVIVER) as CalcRequestsUnion;
  const { type, sequenceId, data } = req;

  const res = {
    type,
    sequenceId: sequenceId!,
  } as CalcResponse<typeof type>;

  // Interpret the incoming request, and action it accordingly
  try {
    switch (type) {
      case WorkerRequestType.COMPUTE_BASIC:
        res.payload = await computeBasic(data, req);
        break;

      case WorkerRequestType.COMPUTE_REVERSE:
        res.payload = await computeReverse(data, req);
        break;

      case WorkerRequestType.COMPARE:
        res.payload = await compare(data, req);
        break;

      case WorkerRequestType.COMPUTE_TTK:
        res.payload = await ttkDistParallel(data, req);
        break;

      default:
        res.error = `Unsupported request type ${type}`;
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e);
      res.error = e.message;
    } else {
      res.error = `Unknown error type ${typeof e}: ${e}`;
    }
  }

  // Send message back to the master
  self.postMessage(JSON.stringify(res, JSON_REPLACER));
};

export {};
