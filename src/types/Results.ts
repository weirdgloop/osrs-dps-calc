import { DetailEntry } from '@/lib/CalcDetails';
import { HitDistEntry } from '@/lib/HitDist';
import { FeatureStatus } from '@/utils';

export enum CalcState {
  COMPLETE = 'Complete',
  PENDING = 'Pending',
  FAILED = 'Failed',
  NOT_APPLICABLE = 'Not Applicable',
}

export interface CalcResult<S extends CalcState> {
  state: S;
}

export interface PendingCalcResult extends CalcResult<CalcState.PENDING> {}

export interface FailedCalcResult extends CalcResult<CalcState.FAILED> {
  error: string;
}

export interface NaCalcResult extends CalcResult<CalcState.NOT_APPLICABLE> {}

export interface BasicResult extends CalcResult<CalcState.COMPLETE> {
  details?: DetailEntry[],
  maxAttackRoll: number,
  npcDefRoll: number,
  accuracy: number,
  maxHit: number,
  expectedHit: number,
  dps: number,
  ttk: number,
  hitDist: HitDistEntry[],

  specStatus: FeatureStatus,
  specDetails?: DetailEntry[],
  specMaxAttackRoll?: number,
  specNpcDefRoll?: number,
  specAccuracy?: number,
  specMaxHit?: number,
  specExpectedHit?: number,
  specMomentDps?: number,
  specFullDps?: number,
  specHitDist?: HitDistEntry[],
}

export interface ReverseResult extends CalcResult<CalcState.COMPLETE> {
  details?: DetailEntry[],

  npcMaxAttackRoll: number,
  playerDefRoll: number,
  npcAccuracy: number,
  npcMaxHit: number,
  npcDps: number,
  avgDmgTaken: number,
}

export interface TtkResult extends CalcResult<CalcState.COMPLETE> {
  ttkDist?: Map<number, number>,
}

export interface CalcResults {
  basic: BasicResult | PendingCalcResult | NaCalcResult | FailedCalcResult,
  reverse: ReverseResult | PendingCalcResult | NaCalcResult | FailedCalcResult,
  ttk: TtkResult | PendingCalcResult | NaCalcResult | FailedCalcResult,
}
