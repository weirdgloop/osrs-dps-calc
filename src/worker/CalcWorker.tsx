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

  private worker?: Worker;

  private sequenceId: number = 1;

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

  public do<
    Req extends CalcRequestsUnion,
    Resp extends CalcResponse<Req['type']>,
  >(req: Req): { requestId: number, promise: Promise<Resp> } {
    // this shouldn't really happen
    if (!this.worker) {
      return {
        requestId: -1,
        promise: Promise.reject(new Error('worker is not initialized and cannot handle requests')),
      };
    }

    // we use these ids to map the response back to the promise
    req.sequenceId = this.sequenceId;
    this.sequenceId += 1;

    // deferred promise so that we can invoke the callback in onResponse
    const promise = new Promise<Resp>((resolve, reject) => {
      this.promiseCache.set(req.sequenceId!, {
        resolve,
        reject,
      });
    });

    const payload = JSON.stringify(req, WORKER_JSON_REPLACER);
    this.worker.postMessage(payload);
    console.debug(`[WorkerContext] Sent off worker request ${req.sequenceId}`, payload);

    return {
      requestId: req.sequenceId,
      promise,
    };
  }

  private onResponse(e: MessageEvent<string>) {
    const data = JSON.parse(e.data, WORKER_JSON_REVIVER) as CalcResponsesUnion;
    const { sequenceId, error } = data;

    // fetch the deferred promise, id must match
    const promise = this.promiseCache.get(sequenceId);
    if (!promise) {
      console.warn(`[WorkerContext] Request ID ${sequenceId} did not have a matching promise!`);
      return;
    }
    this.promiseCache.delete(sequenceId);

    // fail early on error, none of the other properties should be considered valid
    if (error) {
      promise.reject(new Error(error));
      return;
    }

    promise.resolve(data);
  }
}

export default CalcWorker;
