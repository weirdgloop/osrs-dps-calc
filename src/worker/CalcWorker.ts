'use client';

import {
  CalcRequestsUnion, CalcResponse, CalcResponsesUnion, WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import Debouncer from '@/utils/Debouncer';
import DeferredPromise from '@/utils/DeferredPromise';
import { JSON_REPLACER, JSON_REVIVER } from '@/utils/serde';

const DEBOUNCER_MS: Record<WorkerRequestType, number> = {
  [WorkerRequestType.COMPUTE_BASIC]: 50,
  [WorkerRequestType.COMPUTE_REVERSE]: 50,
  [WorkerRequestType.COMPUTE_TTK]: 250,
  [WorkerRequestType.COMPARE]: 50,
};

class CalcWorker {
  private static SELF_ID: number = 0;

  // for some log tracking
  private readonly id: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingPromises: { [k in WorkerRequestType]?: DeferredPromise<any> } = {};

  private worker?: Worker;

  private debouncers: { [k in WorkerRequestType]?: Debouncer } = {};

  private sequenceIds: { [k in WorkerRequestType ]?: number } = {};

  constructor() {
    this.id = CalcWorker.SELF_ID;
    CalcWorker.SELF_ID += 1;

    for (const t of Object.values(WorkerRequestType)) {
      this.debouncers[t as WorkerRequestType] = new Debouncer(DEBOUNCER_MS[t as WorkerRequestType]);
    }
  }

  public initWorker() {
    if (!this.worker) {
      console.debug(`[CalcWorker ${this.id}] Init`);
      this.worker = new Worker(new URL('./worker.ts', import.meta.url));
      this.worker.onmessage = (ev: MessageEvent<string>) => this.onResponse(ev);
    }
  }

  public shutDown() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
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

    const payload = JSON.stringify(req, JSON_REPLACER);
    this.worker.postMessage(payload);
    console.debug(`[CalcWorker ${this.id}] OUTBOUND ${req.sequenceId} ${WorkerRequestType[req.type]} | ${payload}`);

    return deferred.promise;
  }

  private onResponse(e: MessageEvent<string>) {
    const data = JSON.parse(e.data, JSON_REVIVER) as CalcResponsesUnion;
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

export default CalcWorker;
