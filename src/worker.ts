/* eslint-disable no-restricted-globals */
import {
  ComputedNPCVsPlayerValuesResponse,
  ComputedPlayerVsNPCValuesResponse,
  PlayerVsNPCCalcOpts,
  WorkerRequests,
  WorkerRequestType,
  WorkerResponses,
  WorkerResponseType,
} from '@/types/WorkerData';
import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { NPCVsPlayerCalculatedLoadout, PlayerVsNPCCalculatedLoadout } from '@/types/State';
import { WORKER_JSON_REPLACER, WORKER_JSON_REVIVER } from '@/utils';
import NPCVsPlayerCalc from '@/lib/NPCVsPlayerCalc';

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

const computeMvPValues = async (loadouts: Player[], m: Monster) => {
  const res: { [k: string]: NPCVsPlayerCalculatedLoadout } = {};

  for (const [i, p] of loadouts.entries()) {
    const loadoutName = (i + 1).toString();
    const start = new Date().getTime();
    const calc = new NPCVsPlayerCalc(p, m, {
      loadoutName,
    });
    res[loadoutName] = {
      npcMaxAttackRoll: calc.getNPCMaxAttackRoll(),
      npcMaxHit: calc.getNPCMaxHit(),
      npcDps: calc.getDps(),
      npcAccuracy: calc.getHitChance(),
      playerDefRoll: calc.getPlayerDefenceRoll(),
    };
    const end = new Date().getTime();

    if (end - start >= 1000) {
      console.warn(`Loadout ${i + 1} took ${end - start}ms to calculate!`);
    }
  }

  return res;
};

self.onmessage = async (e: MessageEvent<string>) => {
  const data = JSON.parse(e.data, WORKER_JSON_REVIVER) as WorkerRequests;
  let res: WorkerResponses;

  // Interpret the incoming request, and action it accordingly
  switch (data.type) {
    case WorkerRequestType.RECOMPUTE_PLAYER_VS_NPC_VALUES: {
      const calculatedLoadouts = await computePvMValues(data.data.loadouts, data.data.monster, data.data.calcOpts);
      res = { type: WorkerResponseType.COMPUTED_PLAYER_VS_NPC_VALUES, data: calculatedLoadouts } as ComputedPlayerVsNPCValuesResponse;
      break;
    }
    case WorkerRequestType.RECOMPUTE_NPC_VS_PLAYER_VALUES: {
      const calculatedLoadouts = await computeMvPValues(data.data.loadouts, data.data.monster);
      res = { type: WorkerResponseType.COMPUTED_NPC_VS_PLAYER_VALUES, data: calculatedLoadouts } as ComputedNPCVsPlayerValuesResponse;
      break;
    }
    default:
      console.debug(`Unknown data type sent to worker. Data: ${JSON.stringify(data)}`);
      return;
  }

  // Send message back to the master
  self.postMessage(JSON.stringify(res, WORKER_JSON_REPLACER));
};

export {};
