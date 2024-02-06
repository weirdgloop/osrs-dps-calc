/* eslint-disable no-restricted-globals */
import {
  CalcRequestsUnion,
  CalcResponse,
  WORKER_JSON_REPLACER,
  WORKER_JSON_REVIVER,
  WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import { NPCVsPlayerCalculatedLoadout, PlayerVsNPCCalculatedLoadout } from '@/types/State';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import Comparator from '@/lib/Comparator';

type Handler<T extends WorkerRequestType> = (data: Extract<CalcRequestsUnion, { type: T }>['data']) => Promise<CalcResponse<T>['payload']>;

const computePvMValues: Handler<WorkerRequestType.COMPUTE_BASIC> = async (data) => {
  const { loadouts, monster, calcOpts } = data;
  const res: PlayerVsNPCCalculatedLoadout[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [i, p] of loadouts.entries()) {
    const loadoutName = (i + 1).toString();
    const start = new Date().getTime();
    const calc = new PlayerVsNPCCalc(p, monster, {
      loadoutName,
      detailedOutput: calcOpts.detailedOutput,
      disableMonsterScaling: calcOpts.disableMonsterScaling,
    });
    res.push({
      npcDefRoll: calc.getNPCDefenceRoll(),
      maxHit: calc.getDistribution().getMax(),
      maxAttackRoll: calc.getMaxAttackRoll(),
      accuracy: calc.getHitChance(),
      dps: calc.getDps(),
      ttk: calc.getTtk(),
      hitDist: calc.getDistribution().asHistogram(),
      ttkDist: calcOpts.includeTtkDist ? calc.getTtkDistribution() : undefined, // this one can sometimes be quite expensive
      details: calc.details,
      userIssues: calc.userIssues,
    });
    const end = new Date().getTime();

    if (end - start >= 1000) {
      console.warn(`Loadout ${i + 1} took ${end - start}ms to calculate!`);
    }
  }

  return res;
};

const computeMvPValues: Handler<WorkerRequestType.COMPUTE_REVERSE> = async (data) => {
  const { loadouts, monster, calcOpts } = data;
  const res: NPCVsPlayerCalculatedLoadout[] = [];

  for (const [i, p] of loadouts.entries()) {
    const loadoutName = (i + 1).toString();
    const start = new Date().getTime();
    const calc = new NPCVsPlayerCalc(p, monster, {
      loadoutName,
      detailedOutput: calcOpts.detailedOutput,
      disableMonsterScaling: calcOpts.disableMonsterScaling,
    });
    res.push({
      npcMaxAttackRoll: calc.getNPCMaxAttackRoll(),
      npcMaxHit: calc.getNPCMaxHit(),
      npcDps: calc.getDps(),
      npcAccuracy: calc.getHitChance(),
      playerDefRoll: calc.getPlayerDefenceRoll(),
      avgDmgTaken: calc.getAverageDamageTaken(),
      details: calc.details,
    });
    const end = new Date().getTime();

    if (end - start >= 1000) {
      console.warn(`Loadout ${i + 1} took ${end - start}ms to calculate!`);
    }
  }

  return res;
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

self.onmessage = async (evt: MessageEvent<string>) => {
  const req = JSON.parse(evt.data, WORKER_JSON_REVIVER) as CalcRequestsUnion;
  const { type, sequenceId, data } = req;

  const res = {
    type,
    sequenceId: sequenceId!,
  } as CalcResponse<typeof type>;

  // Interpret the incoming request, and action it accordingly
  try {
    switch (type) {
      case WorkerRequestType.COMPUTE_BASIC: {
        res.payload = await computePvMValues(data);
        break;
      }

      case WorkerRequestType.COMPUTE_REVERSE: {
        res.payload = await computeMvPValues(data);
        break;
      }

      case WorkerRequestType.COMPARE: {
        res.payload = await compare(data);
        break;
      }

      default:
        res.error = `Unsupported request type ${type}`;
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.error = e.message;
    } else {
      res.error = `Unknown error type: ${e}`;
    }
  }

  // Send message back to the master
  self.postMessage(JSON.stringify(res, WORKER_JSON_REPLACER));
};

export {};
