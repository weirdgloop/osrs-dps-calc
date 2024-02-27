'use client';

import { makeAutoObservable } from 'mobx';
import { GetPlayerRequest, WikiSyncerRequestType, WikiSyncerResponsesUnion } from './WikiSyncerTypes';

const minimumPort = 37767;
// const maximumPort = 37776;
const maximumPort = 37768; // small port range for testing

interface InFlightRequest {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

export class WikiSyncer {
  port: number;

  username?: string;

  private ws?: WebSocket;

  private reconnectionJobId?: ReturnType<typeof setTimeout>;

  private nextSequenceID = 0;

  private inFlightRequests = new Map<number, InFlightRequest>();

  constructor(port: number) {
    makeAutoObservable(this);
    this.port = port;
    this.connect();
  }

  private onMessage(message: MessageEvent) {
    const response: WikiSyncerResponsesUnion = JSON.parse(message.data);
    console.log(message);
    if (response._wsType === WikiSyncerRequestType.USERNAME_CHANGED) {
      this.username = response.username;
    }
  }

  connect() {
    if (this.ws) {
      // There is already a connection.
      return;
    }
    this.ws = new WebSocket(`ws://localhost:${this.port}`);
    this.ws.onmessage = (message) => this.onMessage(message);

    this.ws.onclose = () => {
      this.ws = undefined;
      this.username = undefined;
      if (this.reconnectionJobId) {
        return;
      }
      this.reconnectionJobId = setTimeout(() => {
        this.reconnectionJobId = undefined;
        console.log('Reconnecting', this.port);
        this.connect();
      }, 10000);
    };
  }

  getPlayer() {
    const p = new Promise(((resolve, reject) => {
      if (this.ws) {
        const req: GetPlayerRequest = {
          _wsType: WikiSyncerRequestType.GET_PLAYER,
          sequenceId: this.nextSequenceID,
          data: {},
        };
        this.ws.send(JSON.stringify(req));
        this.inFlightRequests.set(this.nextSequenceID, { resolve, reject });
        this.nextSequenceID += 1;
      } else {
        reject(new Error('Not connected'));
      }
    }));

    return p;
  }
}

const syncers = new Map();

export const startPollingForRuneLite = () => {
  if (typeof window === 'undefined' || syncers.size > 0) {
    return syncers;
  }

  makeAutoObservable(syncers);

  window.syncers = syncers;

  for (let port = minimumPort; port <= maximumPort; port++) {
    syncers.set(port, new WikiSyncer(port));
  }

  return syncers;
};
