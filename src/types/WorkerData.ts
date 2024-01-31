import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { NPCVsPlayerCalculatedLoadout, PlayerVsNPCCalculatedLoadout } from '@/types/State';

/**
 * Requests
 */

export enum WorkerRequestType {
  RECOMPUTE_PLAYER_VS_NPC_VALUES,
  RECOMPUTE_NPC_VS_PLAYER_VALUES,
}

export interface PlayerVsNPCCalcOpts {
  includeTtkDist: boolean,
  detailedOutput: boolean,
}

export interface RecomputePlayerVsNPCValuesRequest {
  type: WorkerRequestType.RECOMPUTE_PLAYER_VS_NPC_VALUES,
  data: {
    loadouts: Player[],
    monster: Monster,
    calcOpts: PlayerVsNPCCalcOpts,
  }
}

export interface RecomputeNPCVsPlayerValuesRequest {
  type: WorkerRequestType.RECOMPUTE_NPC_VS_PLAYER_VALUES,
  data: {
    loadouts: Player[],
    monster: Monster
  }
}

export type WorkerRequests = RecomputePlayerVsNPCValuesRequest | RecomputeNPCVsPlayerValuesRequest;

/**
 * Responses
 */

export enum WorkerResponseType {
  COMPUTED_PLAYER_VS_NPC_VALUES,
  COMPUTED_NPC_VS_PLAYER_VALUES,
}

export interface ComputedPlayerVsNPCValuesResponse {
  type: WorkerResponseType.COMPUTED_PLAYER_VS_NPC_VALUES,
  data: { [k: string]: PlayerVsNPCCalculatedLoadout }
}

export interface ComputedNPCVsPlayerValuesResponse {
  type: WorkerResponseType.COMPUTED_NPC_VS_PLAYER_VALUES,
  data: { [k: string]: NPCVsPlayerCalculatedLoadout }
}

export type WorkerResponses = ComputedPlayerVsNPCValuesResponse | ComputedNPCVsPlayerValuesResponse;
