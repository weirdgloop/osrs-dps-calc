'use client';

import {
  CalcRequestsUnion,
  CalcResponse,
  CalcResponsesUnion,
  WORKER_JSON_REPLACER,
  WORKER_JSON_REVIVER,
  WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import { Debouncer, DeferredPromise } from '@/utils';
import React, {
  createContext, useContext, useEffect, useState,
} from 'react';

export class CalcWorker {
  private static SELF_ID: number = 0;

  // for some log tracking
  private id: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingPromises: { [k in WorkerRequestType]?: DeferredPromise<any> } = {};

  private worker?: Worker;

  private debouncers: { [k in WorkerRequestType]?: Debouncer } = {};

  private sequenceIds: { [k in WorkerRequestType ]?: number } = {};

  constructor() {
    this.id = CalcWorker.SELF_ID;
    CalcWorker.SELF_ID += 1;

    for (const t of Object.values(WorkerRequestType)) {
      this.debouncers[t as WorkerRequestType] = new Debouncer(250);
    }
  }

  public initWorker() {
    if (!this.worker) {
      console.debug(`[CalcWorker ${this.id}] Init`);
      this.worker = new Worker(new URL('./worker.ts', import.meta.url));
      this.worker.onmessage = (ev: MessageEvent<string>) => this.onResponse(ev);
    }
  }

  public shutdown() {
    if (this.worker) {
      const w = this.worker;
      this.worker = undefined;
      w.terminate();
    }
  }

  public isReady(): boolean {
    return this.worker !== undefined;
  }

  public async do<
    Req extends CalcRequestsUnion,
    Resp extends CalcResponse<Req['type']>,
  >(req: Req): Promise<Resp> {
    // this can be hit early on during page load
    if (!this.worker) {
      return Promise.reject(new Error('worker is not initialized and cannot handle requests'));
    }

    await this.debouncers[req.type]?.debounce();

    // we use these ids to map the response back to the promise
    this.sequenceIds[req.type] = (this.sequenceIds[req.type] || 0) + 1;
    req.sequenceId = this.sequenceIds[req.type];

    // deferred promise so that we can invoke the callback in onResponse
    const deferred = new DeferredPromise<Resp>();
    this.pendingPromises[req.type] = deferred;

    const payload = JSON.stringify(req, WORKER_JSON_REPLACER);
    this.worker.postMessage(payload);
    console.debug(`[CalcWorker ${this.id}] OUTBOUND ${req.sequenceId} ${WorkerRequestType[req.type]} | ${payload}`);

    return deferred.promise;
  }

  private onResponse(e: MessageEvent<string>) {
    const data = JSON.parse(e.data, WORKER_JSON_REVIVER) as CalcResponsesUnion;
    const { type, sequenceId, error } = data;
    console.debug(`[CalcWorker ${this.id}] INBOUND ${sequenceId} ${WorkerRequestType[data.type]} | ${e.data}`);

    const expectedSeqId = this.sequenceIds[type];
    if (sequenceId !== expectedSeqId) {
      // another request has been sent off before this one returned
      console.debug(`[CalcWorker ${this.id}] Ignoring response ${sequenceId} as stale`);
      return;
    }

    // fetch the deferred promise, id must match
    const promise = this.pendingPromises[type];
    if (!promise) {
      console.warn(`[CalcWorker ${this.id}] Request ID ${sequenceId} did not have a matching promise!`);
      return;
    }
    this.pendingPromises[type] = undefined;

    // fail early on error, none of the other properties should be considered valid
    if (error) {
      promise.reject(new Error(error));
      return;
    }

    promise.resolve(data);
  }
}

const CalcContext = createContext<CalcWorker>(
  // no default context is available, since we can't register a teardown method without useEffect
  undefined as unknown as CalcWorker,
);

export const CalcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [worker] = useState<CalcWorker>(new CalcWorker());
  useEffect(() => {
    worker.initWorker();
    return () => worker.shutdown();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CalcContext.Provider value={worker}>{children}</CalcContext.Provider>
  );
};

export const useCalc = () => useContext(CalcContext);
