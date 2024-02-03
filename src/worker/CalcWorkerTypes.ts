import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { NPCVsPlayerCalculatedLoadout, PlayerVsNPCCalculatedLoadout } from '@/types/State';

/**
 * Requests
 */

export enum WorkerRequestType {
  COMPUTE_BASIC,
  COMPUTE_REVERSE,
  COMPUTE_TTK,
  COMPARE,
}

export interface WorkerRequest<T extends WorkerRequestType> {
  type: T,
  sequenceId?: number,
}

export interface WorkerCalcOpts {
  includeTtkDist: boolean,
  detailedOutput: boolean,
}

export interface ComputeBasicRequest extends WorkerRequest<WorkerRequestType.COMPUTE_BASIC> {
  type: WorkerRequestType.COMPUTE_BASIC,
  data: {
    loadouts: Player[],
    monster: Monster,
    calcOpts: WorkerCalcOpts,
  }
}

export interface ComputeReverseRequest extends WorkerRequest<WorkerRequestType.COMPUTE_REVERSE> {
  type: WorkerRequestType.COMPUTE_REVERSE,
  data: {
    loadouts: Player[],
    monster: Monster,
    calcOpts: WorkerCalcOpts,
  }
}

export type CalcRequestsUnion = ComputeBasicRequest | ComputeReverseRequest;

/**
 * Responses
 */

export interface WorkerResponse<T extends WorkerRequestType> {
  type: T,
  sequenceId: number,
  error?: string,
  payload: unknown,
}

export interface ComputeBasicResponse extends WorkerResponse<WorkerRequestType.COMPUTE_BASIC> {
  payload: PlayerVsNPCCalculatedLoadout[],
}

export interface ComputeReverseResponse extends WorkerResponse<WorkerRequestType.COMPUTE_REVERSE> {
  payload: NPCVsPlayerCalculatedLoadout[],
}

export type CalcResponsesUnion = ComputeBasicResponse | ComputeReverseResponse;
export type CalcResponse<T extends WorkerRequestType> = CalcResponsesUnion & { type: T };

export const WORKER_JSON_REPLACER = (k: string, v: Map<unknown, unknown> | never) => {
  if (v instanceof Map) {
    return {
      _dataType: 'Map',
      m: Array.from(v),
    };
  }
  return v;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WORKER_JSON_REVIVER = (k: string, v: any) => {
  if (typeof v === 'object' && v?._dataType === 'Map') {
    return new Map(v.m);
  }
  return v;
};
