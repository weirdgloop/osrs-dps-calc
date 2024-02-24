'use client';

const minimumPort = 37767;
const maximumPort = 37776;
// const maximumPort = 37768;

export class WikiSyncer {
  port: number;

  username?: string;

  constructor(port: number) {
    this.port = port;
    this.connect();
  }

  connect() {
    const ws = new WebSocket(`ws://localhost:${this.port}`);
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(message);
      if (data.type === 'usernameUpdate') {
        this.username = data.username;
      }
    };

    ws.onclose = () => setTimeout(() => {
      console.log('Reconnecting', this.port);
      this.connect();
    }, 10000);
  }
}

export const startPollingForRuneLite = () => {
// export const startPollingForRuneLite = (onUsernameUpdate: OnUsernameUpdate) => {
  const syncers = new Map();

  if (typeof window === 'undefined') {
    return syncers;
  }

  for (let port = minimumPort; port <= maximumPort; port++) {
    syncers.set(port, new WikiSyncer(port));
  }

  return syncers;
};
