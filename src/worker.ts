import {
  ComputedValuesResponse,
  WorkerCalcOpts,
  WorkerRequests,
  WorkerRequestType,
  WorkerResponses,
  WorkerResponseType
} from "@/types/WorkerData";
import {PlayerComputed} from "@/types/Player";
import {Monster} from "@/types/Monster";
import CombatCalc from "@/lib/CombatCalc";
import {CalculatedLoadout} from "@/types/State";
import {WORKER_JSON_REPLACER, WORKER_JSON_REVIVER} from "@/utils";

/**
 * Method for computing the calculator values based on given loadouts and Monster object
 * @param loadouts
 * @param m
 * @param calcOpts
 */
const computeValues = async (loadouts: PlayerComputed[], m: Monster, calcOpts: WorkerCalcOpts) => {
  let res: CalculatedLoadout[] = [];

  for (let [_, p] of loadouts.entries()) {
    let calc = new CombatCalc(p, m);
    res.push({
      npcDefRoll: calc.getNPCDefenceRoll(),
      maxHit: calc.getDistribution().getMax(),
      maxAttackRoll: calc.getMaxAttackRoll(),
      accuracy: calc.getHitChance(),
      dps: calc.getDps(),
      ttk: calc.getTtk(),
      hitDist: calc.getDistribution().asHistogram(),
      ttkDist: calcOpts.includeTtkDist ? calc.getTtkDistribution() : undefined, // this one can sometimes be quite expensive
    })
  }

  return res;
}

self.onmessage = async (e: MessageEvent<string>) => {
  const data = JSON.parse(e.data, WORKER_JSON_REVIVER) as WorkerRequests;
  let res: WorkerResponses;

  // Interpret the incoming request, and action it accordingly
  switch (data.type) {
    case WorkerRequestType.RECOMPUTE_VALUES:
      let calculatedLoadouts = await computeValues(data.data.loadouts, data.data.monster, data.data.calcOpts)
      res = {type: WorkerResponseType.COMPUTED_VALUES, data: calculatedLoadouts} as ComputedValuesResponse;
      break;
    default:
      console.debug(`Unknown data type sent to worker: ${data.type}`);
      return;
  }

  // Send message back to the master
  self.postMessage(JSON.stringify(res, WORKER_JSON_REPLACER));
}

export {}
