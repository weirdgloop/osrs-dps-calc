/* eslint-disable no-restricted-globals */
import {
  CalcRequestsUnion,
  CalcResponse,
  WORKER_JSON_REPLACER,
  WORKER_JSON_REVIVER,
  WorkerCalcOpts,
  WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import CombatCalc from '@/lib/CombatCalc';
import { CalculatedLoadout } from '@/types/State';

/**
 * Method for computing the calculator values based on given loadouts and Monster object
 * @param loadouts
 * @param m
 * @param calcOpts
 */
const computePvMValues = async (loadouts: Player[], m: Monster, calcOpts: PlayerVsNPCCalcOpts) => {
  const res: { [k: string]: PlayerVsNPCCalculatedLoadout } = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [i, p] of loadouts.entries()) {
    const loadoutName = (i + 1).toString();
    const start = new Date().getTime();
    const calc = new PlayerVsNPCCalc(p, m, {
      loadoutName,
      detailedOutput: calcOpts.detailedOutput,
    });
    res[loadoutName] = {
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
    };
    const end = new Date().getTime();

    if (end - start >= 1000) {
      console.warn(`Loadout ${i + 1} took ${end - start}ms to calculate!`);
    }
  }

  return res;
};

const computeMvPValues = async (loadouts: Player[], m: Monster, calcOpts: NPCVsPlayerCalcOpts) => {
  const res: { [k: string]: NPCVsPlayerCalculatedLoadout } = {};

  for (const [i, p] of loadouts.entries()) {
    const loadoutName = (i + 1).toString();
    const start = new Date().getTime();
    const calc = new NPCVsPlayerCalc(p, m, {
      loadoutName,
      detailedOutput: calcOpts.detailedOutput,
    });
    res[loadoutName] = {
      npcMaxAttackRoll: calc.getNPCMaxAttackRoll(),
      npcMaxHit: calc.getNPCMaxHit(),
      npcDps: calc.getDps(),
      npcAccuracy: calc.getHitChance(),
      playerDefRoll: calc.getPlayerDefenceRoll(),
      avgDmgTaken: calc.getAverageDamageTaken(),
      details: calc.details,
    };
    const end = new Date().getTime();

    if (end - start >= 1000) {
      console.warn(`Loadout ${i + 1} took ${end - start}ms to calculate!`);
    }
  }

  return res;
};

self.onmessage = async (evt: MessageEvent<string>) => {
  const data = JSON.parse(evt.data, WORKER_JSON_REVIVER) as CalcRequestsUnion;
  const { type, sequenceId } = data;

  const res = {
    type,
    sequenceId: sequenceId!,
  } as CalcResponse<typeof type>;

  // Interpret the incoming request, and action it accordingly
  try {
    switch (type) {
      case WorkerRequestType.COMPUTE_BASIC: {
        res.payload = await computeValues(data.data.loadouts, data.data.monster, data.data.calcOpts);
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
