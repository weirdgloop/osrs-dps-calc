'use client';

import { GetPlayerRequest, WikiSyncerRequestType, WikiSyncerResponsesUnion } from './WikiSyncerTypes';

const minimumPort = 37767;
// const maximumPort = 37776;
const maximumPort = 37768;

interface InFlightRequest {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

export class WikiSyncer {
  port: number;

  username: string | null = null;

  private ws?: WebSocket;

  private reconnectionJobId?: ReturnType<typeof setTimeout>;

  private nextSequenceID = 0;

  private inFlightRequests = new Map<number, InFlightRequest>();

  constructor(port: number) {
    this.port = port;
    this.connect();
  }

  private onMessage(message: MessageEvent) {
    const data: WikiSyncerResponsesUnion = JSON.parse(message.data);
    console.log(message);
    if (data.type === WikiSyncerRequestType.USERNAME_CHANGED) {
      this.username = data.username;
    }
  }

  connect() {
    if (this.ws) {
      // There is already a connection.
      return;
    }
    this.ws = new WebSocket(`ws://localhost:${this.port}`);
    this.ws.onmessage = this.onMessage;

    this.ws.onclose = () => {
      this.ws = undefined;
      this.username = null;
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
          type: WikiSyncerRequestType.GET_PLAYER,
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

  for (let port = minimumPort; port <= maximumPort; port++) {
    syncers.set(port, new WikiSyncer(port));
  }

  return syncers;
};
