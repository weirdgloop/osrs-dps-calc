'use client';

import { makeAutoObservable } from 'mobx';
import { ImportableData } from '@/types/State';
import delay from 'delay';
import { GetPlayerRequest, WikiSyncerRequestType, WikiSyncerResponsesUnion } from './WikiSyncerTypes';

const minimumPort = 37767;
const maximumPort = 37776;
// const maximumPort = 37768; // small port range for testing

interface InFlightRequest<T> {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

enum ConnectionState {
  Disconnected,
  Connected,
}

export class WikiSyncer {
  port: number;

  private _connectionState = ConnectionState.Disconnected;

  public get connectionState(): ConnectionState {
    return this._connectionState;
  }

  public set connectionState(value: ConnectionState) {
    this._connectionState = value;
  }

  private _username?: string;

  public get username(): string | undefined {
    return this._username;
  }

  public set username(value: string | undefined) {
    this._username = value;
  }

  private ws?: WebSocket;

  private nextSequenceID = 0;

  private inFlightRequests = { getPlayer: new Map<number, InFlightRequest<ImportableData>>() };

  constructor(port: number) {
    makeAutoObservable(this);
    this.port = port;
    this.connect();
  }

  private onMessage(message: MessageEvent) {
    const response: WikiSyncerResponsesUnion = JSON.parse(message.data);
    switch (response._wsType) {
      case WikiSyncerRequestType.USERNAME_CHANGED:
        this.username = response.username;
        break;

      case WikiSyncerRequestType.GET_PLAYER:
        if (response.error) {
          this.inFlightRequests.getPlayer.get(response.sequenceId)?.reject(new Error(response.error));
        } else {
          this.inFlightRequests.getPlayer.get(response.sequenceId)?.resolve(response.payload);
        }
        break;

      default:
        break;
    }
  }

  connect() {
    if (this.ws) {
      // There is already a connection.
      return;
    }
    this.ws = new WebSocket(`ws://localhost:${this.port}`);
    this.ws.onopen = () => { this.connectionState = ConnectionState.Connected; };

    this.ws.onmessage = (message) => this.onMessage(message);

    this.ws.onclose = () => {
      this.ws = undefined;
      this.username = undefined;
      this.connectionState = ConnectionState.Disconnected;
    };
  }

  getPlayer() {
    const p = new Promise<ImportableData>(((resolve, reject) => {
      if (this.ws) {
        const req: GetPlayerRequest = {
          _wsType: WikiSyncerRequestType.GET_PLAYER,
          sequenceId: this.nextSequenceID,
          data: {},
        };
        this.ws.send(JSON.stringify(req));
        this.inFlightRequests.getPlayer.set(this.nextSequenceID, { resolve, reject });
        this.nextSequenceID += 1;
      } else {
        reject(new Error('Not connected'));
      }
    }));

    return p;
  }

  close() {
    this.ws?.close();
  }
}

export const findRuneLiteInstances = async () => {
  const instances = [];
  for (let port = minimumPort; port <= maximumPort; port++) {
    instances.push(new WikiSyncer(port));
  }
  await delay(500);
  return instances.filter((syncer) => {
    const activeInstance = !!syncer.username;
    if (!activeInstance) {
      syncer.close();
    }
    return activeInstance;
  });
};
