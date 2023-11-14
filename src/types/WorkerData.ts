import {PlayerComputed} from "@/types/Player";
import {Monster} from "@/types/Monster";
import {CalculatedLoadout} from "@/types/State";

/**
 * Requests
 */

export enum WorkerRequestType {
  RECOMPUTE_VALUES
}

export interface RecomputeValuesRequest {
  type: WorkerRequestType.RECOMPUTE_VALUES,
  data: {
    loadouts: PlayerComputed[],
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
  data: CalculatedLoadout[]
}

export type WorkerResponses = ComputedValuesResponse;