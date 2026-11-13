import { LoadoutId, Player } from '@/types/Player';
import { Monster } from '@/types/Monster';
import type { LoadoutResults } from '@/state/CalcStore';
import { CalcOpts } from '@/lib/BaseCalc';
import {
  CompareResult, CompareXAxis, CompareYAxis,
} from '@/lib/Comparator';

/**
 * Requests
 */

export enum WorkerRequestType {
  COMPUTE_BASIC,
  COMPUTE_REVERSE,
  COMPUTE_TTK_PARALLEL,
  COMPUTE_TTK,
  COMPARE,
}

export interface WorkerRequest<T extends WorkerRequestType> {
  type: T,
  sequenceId?: number,
}

export interface WorkerCalcOpts {
  hitDistHideMisses?: boolean,
  detailedOutput?: CalcOpts['detailedOutput'],
  disableMonsterScaling?: CalcOpts['disableMonsterScaling'],
}

export interface LoadoutCalcData {
  loadouts: Map<LoadoutId, Player>,
  monster: Monster,
  calcOpts: WorkerCalcOpts,
}

export interface ComputeBasicRequest extends WorkerRequest<WorkerRequestType.COMPUTE_BASIC> {
  data: LoadoutCalcData,
}

export interface ComputeReverseRequest extends WorkerRequest<WorkerRequestType.COMPUTE_REVERSE> {
  data: LoadoutCalcData,
}

export interface CompareRequest extends WorkerRequest<WorkerRequestType.COMPARE> {
  data: {
    axes: {
      x: CompareXAxis,
      y: CompareYAxis,
    },
    loadouts: Map<LoadoutId, Player>,
    monster: Monster,
  },
}

export interface TtkRequest extends WorkerRequest<WorkerRequestType.COMPUTE_TTK> {
  data: LoadoutCalcData,
}

export interface TtkRequestParallel extends WorkerRequest<WorkerRequestType.COMPUTE_TTK_PARALLEL> {
  data: TtkRequest['data']
}

export type CalcRequestsUnion =
  ComputeBasicRequest |
  ComputeReverseRequest |
  CompareRequest |
  TtkRequest |
  TtkRequestParallel;

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
  payload: Map<LoadoutId, LoadoutResults['basic']>,
}

export interface ComputeReverseResponse extends WorkerResponse<WorkerRequestType.COMPUTE_REVERSE> {
  payload: Map<LoadoutId, LoadoutResults['reverse']>,
}

export interface CompareResponse extends WorkerResponse<WorkerRequestType.COMPARE> {
  payload: CompareResult,
}

export interface TtkResponse extends WorkerResponse<WorkerRequestType.COMPUTE_TTK> {
  payload: Map<LoadoutId, LoadoutResults['ttk']>,
}

export interface TtkResponseParallel extends WorkerResponse<WorkerRequestType.COMPUTE_TTK_PARALLEL> {
  payload: TtkResponse['payload'],
}

export type CalcResponsesUnion =
  ComputeBasicResponse |
  ComputeReverseResponse |
  CompareResponse |
  TtkResponse |
  TtkResponseParallel;
export type CalcResponse<T extends WorkerRequestType> = CalcResponsesUnion & { type: T };

export type Handler<T extends WorkerRequestType> = (data: Extract<CalcRequestsUnion, { type: T }>['data'], rawRequest: CalcRequestsUnion) => Promise<CalcResponse<T>['payload']>;
