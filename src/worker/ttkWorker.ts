/* eslint-disable no-restricted-globals */
import {
  CalcRequestsUnion, CalcResponse, Handler, WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import type { CalcStatus, TtkResult } from '@/state/CalcStore';
import { LoadoutId } from '@/types/Player';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { WORKER_JSON_REPLACER, WORKER_JSON_REVIVER } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export const ttkDist: Handler<WorkerRequestType.COMPUTE_TTK> = async (data) => {
  const { loadouts, monster, calcOpts } = data;

  const res = new Map<LoadoutId, CalcStatus<TtkResult>>();
  for (const [i, [id, p]] of [...loadouts].entries()) {
    const loadoutName = p.name || (i + 1).toString();
    const start = self.performance.now();
    try {
      const calc = new PlayerVsNPCCalc(p, monster, {
        loadoutName,
        detailedOutput: calcOpts.detailedOutput,
        disableMonsterScaling: calcOpts.disableMonsterScaling,
      });

      res.set(id, { status: 'success', value: { ttkDist: calc.getTtkDistribution() } });
    } catch (e) {
      console.error(e);
      res.set(id, { status: 'failed', error: e instanceof Error ? e.message : String(e) });
    }

    const end = self.performance.now();
    console.debug(`TTK Dist ${loadoutName} took ${end - start}ms to calculate`);
  }

  return res;
};

self.onmessage = async (evt: MessageEvent<string>) => {
  console.log(`TTK IN ${new Date().toISOString()}`, evt);
  const req = JSON.parse(evt.data, WORKER_JSON_REVIVER) as CalcRequestsUnion;
  const { type, sequenceId, data } = req;

  const res = {
    type,
    sequenceId: sequenceId!,
  } as CalcResponse<typeof type>;

  // Interpret the incoming request, and action it accordingly
  try {
    switch (type) {
      case WorkerRequestType.COMPUTE_TTK: {
        res.payload = await ttkDist(data, req);
        break;
      }

      default:
        res.error = `Unsupported request type ${type}`;
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.error = e.message;
    } else {
      res.error = `Unknown error type: ${e}`;
    }
  }

  // Send message back to the master
  self.postMessage(JSON.stringify(res, WORKER_JSON_REPLACER));
};
