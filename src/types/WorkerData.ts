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
    player: Player,
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
    playerMagicHit: number,
    playerMagicAttack: number,
    playerMeleeHit: number,
    playerMeleeAttack: number,
    playerRangedHit: number,
    playerRangedAttack: number
  }
}

export type WorkerResponses = ComputedValuesResponse;