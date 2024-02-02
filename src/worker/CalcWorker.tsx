import {
  CalcRequestsUnion,
  CalcResponse,
  CalcResponsesUnion,
  WORKER_JSON_REPLACER,
  WORKER_JSON_REVIVER,
} from '@/worker/CalcWorkerTypes';

interface CalcPromise {
  resolve: (response: any) => void, // eslint-disable-line @typescript-eslint/no-explicit-any
  reject: (reason: Error) => void,
}

export class CalcWorker {
  private readonly promiseCache: Map<number, CalcPromise> = new Map();

  worker?: Worker;

  initWorker() {
    if (!this.worker) {
      this.worker = new Worker(new URL('./worker.ts', import.meta.url));
      this.worker.onmessage = (ev: MessageEvent<string>) => this.onResponse(ev);
    }
  }

  shutdown() {
    if (this.worker) {
      const w = this.worker;
      this.worker = undefined;
      w.terminate();
    }
  }

  private _requestId: number = 0;

  private get newRequestId(): number {
    this._requestId += 1;
    return this._requestId;
  }

  public do<
    Req extends CalcRequestsUnion,
    Resp extends CalcResponse<Req['type']>,
  >(req: Req): { requestId: number, promise: Promise<Resp> } {
    if (!this.worker) {
      return {
        requestId: -1,
        promise: Promise.reject(new Error('worker is not initialized and cannot handle requests')),
      };
    }

    // we use these ids to map the response back to the promise
    req.requestId = this.newRequestId;

    // we store the promise resolvers so that we can do that in onResponse
    const promise = new Promise<Resp>((resolve, reject) => {
      this.promiseCache.set(req.requestId!, {
        resolve,
        reject,
      });
    });

    const payload = JSON.stringify(req, WORKER_JSON_REPLACER);
    this.worker.postMessage(payload);
    console.debug(`[WorkerContext] Sent off worker request ${req.requestId}`, payload);

    return {
      requestId: req.requestId,
      promise,
    };
  }

  private onResponse(e: MessageEvent<string>) {
    const data = JSON.parse(e.data, WORKER_JSON_REVIVER) as CalcResponsesUnion;
    const { requestId, error } = data;

    // fetch the deferred promise, id must match
    const promise = this.promiseCache.get(requestId);
    if (!promise) {
      console.warn(`[WorkerContext] Request ID ${requestId} did not have a matching promise!`);
      return;
    }
    this.promiseCache.delete(requestId);

    // fail early on error, none of the other properties should be considered valid
    if (error) {
      promise.reject(new Error(error));
      return;
    }

    promise.resolve(data);
  }
}

export default CalcWorker;
