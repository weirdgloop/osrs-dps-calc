/* eslint-disable no-restricted-globals */
import {
  CalcRequestsUnion, CalcResponse, Handler, WorkerRequestType,
} from '@/worker/CalcWorkerTypes';
import PlayerVsNPCCalc from '@/lib/PlayerVsNPCCalc';
import { CalcState, TtkResult } from '@/types/Results';
import { JSON_REPLACER, JSON_REVIVER } from '@/utils/serde';

// eslint-disable-next-line import/prefer-default-export
export const ttkDist: Handler<WorkerRequestType.COMPUTE_TTK> = async (data) => {
  const { player, monster, calcOpts } = data;

  const loadoutName = player.name;
  const start = self.performance.now();
  const calc = new PlayerVsNPCCalc(player, monster, {
    loadoutName,
    detailedOutput: calcOpts.detailedOutput,
  });

  const res: TtkResult = {
    state: CalcState.COMPLETE,
    ttkDist: calc.getTtkDistribution(),
  };

  const end = self.performance.now();
  console.debug(`TTK Dist ${loadoutName} took ${end - start}ms to calculate`);

  return res;
};

self.onmessage = async (evt: MessageEvent<string>) => {
  console.log(`TTK IN ${new Date().toISOString()}`, evt);
  const req = JSON.parse(evt.data, JSON_REVIVER) as CalcRequestsUnion;
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
  self.postMessage(JSON.stringify(res, JSON_REPLACER));
};
