import { Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import { CalculatedLoadout } from '@/types/State';

/**
 * Requests
 */

export enum WorkerRequestType {
  COMPUTE_BASIC,
  COMPUTE_TTK,
  COMPARE,
}

export interface WorkerRequest {
  type: WorkerRequestType,
  requestId?: number,
}

export interface WorkerCalcOpts {
  includeTtkDist: boolean,
  detailedOutput: boolean,
}

export interface ComputeBasicRequest extends WorkerRequest {
  type: WorkerRequestType.COMPUTE_BASIC,
  data: {
    loadouts: Player[],
    monster: Monster,
    calcOpts: WorkerCalcOpts,
  }
}

export type CalcRequestsUnion = ComputeBasicRequest;

/**
 * Responses
 */

export interface WorkerResponse<T extends WorkerRequestType> {
  type: T,
  requestId: number,
  error?: string,
  payload: unknown,
}

export interface ComputedValuesResponse extends WorkerResponse<WorkerRequestType.COMPUTE_BASIC> {
  payload: CalculatedLoadout[],
}

export type CalcResponsesUnion = ComputedValuesResponse;
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
