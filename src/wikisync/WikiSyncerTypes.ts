import { PlayerEquipment, PlayerSkills } from '@/types/Player';

/**
 * Requests
 */

export enum WikiSyncerRequestType {
  USERNAME_CHANGED,
  GET_PLAYER,
}

export interface WikiSyncerRequest<T extends WikiSyncerRequestType> {
  type: T,
  sequenceId?: number,
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
  type: WikiSyncerRequestType.USERNAME_CHANGED,
  username: string | null;
}

export interface WikiSyncerResponse<T extends WikiSyncerRequestType> {
  type: T,
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