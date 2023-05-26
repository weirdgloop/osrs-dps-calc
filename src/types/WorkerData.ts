import {Player} from "@/types/Player";
import {Monster} from "@/types/Monster";

/**
 * Requests
 */

export enum WorkerRequestType {
  RECOMPUTE_VALUES
}

export interface RecomputeValuesRequest {
  type: WorkerRequestType.RECOMPUTE_VALUES,
  data: {
    loadouts: Player[],
    monster: Monster
  }
}

export type WorkerRequests = RecomputeValuesRequest;

/**
 * Responses
 */

export enum WorkerResponseType {
  COMPUTED_VALUES
}

export interface ComputedValuesResponse {
  type: WorkerResponseType.COMPUTED_VALUES,
  data: {
    npcDefRoll: number,
    maxHit: number,
    maxAttackRoll: number
  }[]
}

export type WorkerResponses = ComputedValuesResponse;