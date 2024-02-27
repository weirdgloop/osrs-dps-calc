import { PlayerEquipment, PlayerSkills } from '@/types/Player';

/**
 * Requests
 */

export enum WikiSyncerRequestType {
  USERNAME_CHANGED = 'UsernameChanged',
  GET_PLAYER = 'GetPlayer',
}

export interface WikiSyncerRequest<T extends WikiSyncerRequestType> {
  _wsType: T,
  sequenceId: number,
}

export interface GetPlayerRequest extends WikiSyncerRequest<WikiSyncerRequestType.GET_PLAYER> {
  data: Record<string, never>
}

export type WikiSyncerRequestsUnion =
  | GetPlayerRequest;

/**
 * Responses
 */

export interface UsernameChangedBroadcast {
  _wsType: WikiSyncerRequestType.USERNAME_CHANGED,
  username?: string;
}

export interface WikiSyncerResponse<T extends WikiSyncerRequestType> {
  _wsType: T,
  sequenceId: number,
  error?: string,
  payload: unknown,
}

export interface GetPlayerResponse extends WikiSyncerResponse<WikiSyncerRequestType.GET_PLAYER> {
  payload: {
    skills: PlayerSkills,
    equipment: PlayerEquipment,
  },
}

export type WikiSyncerResponsesUnion =
  | UsernameChangedBroadcast
  | GetPlayerResponse;

export type CalcResponse<T extends WikiSyncerRequestType> = WikiSyncerResponsesUnion & { type: T };
