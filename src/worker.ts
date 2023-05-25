import {
  ComputedValuesResponse,
  WorkerRequests,
  WorkerRequestType,
  WorkerResponses,
  WorkerResponseType
} from "@/types/WorkerData";
import {Player} from "@/types/Player";
import {Monster} from "@/types/Monster";
import CombatCalc from "@/lib/CombatCalc";

/**
 * Method for computing the calculator values based on a given Player and Monster object
 * @param p
 * @param m
 */
const computeValues = (p: Player, m: Monster) => {
  let calc = new CombatCalc(p, m);

  return {
    npcDefRoll: calc.getNPCDefenceRoll(),
    maxHit: calc.getMaxHit(),
    maxAttackRoll: calc.getMaxAttackRoll()
  }
}

self.onmessage = (e: MessageEvent<string>) => {
  const data = JSON.parse(e.data) as WorkerRequests;
  let res: WorkerResponses;

  // Interpret the incoming request, and action it accordingly
  switch (data.type) {
    case WorkerRequestType.RECOMPUTE_VALUES:
      res = {type: WorkerResponseType.COMPUTED_VALUES, data: computeValues(data.data.player, data.data.monster)} as ComputedValuesResponse;
      break;
    default:
      console.debug(`Unknown data type sent to worker: ${data.type}`);
      return;
  }

  // Send message back to the master
  self.postMessage(JSON.stringify(res));
}

export {}