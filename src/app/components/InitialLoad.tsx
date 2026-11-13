import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import RootStore, { useStore } from '@/state/RootStore';
import { availableMonsters } from '@/state/MonsterStore';
import { CalcWorker } from '@/worker/CalcWorker';
import { fetchShortlinkData } from '@/utils';

interface InitialLoadParams {
  /** `?id=`: a shortlink to load. */
  shortlinkId: string | null;
  /** `?monster=`: the id of a monster to select once everything else is loaded. */
  monsterId: string | null;
}

interface InitialLoadResult {
  /** Whether the session should be written back to browser storage once the stores are live. */
  persistState: boolean;
}

async function loadShortlink(root: RootStore, shortlinkId: string): Promise<void> {
  try {
    await toast.promise(
      async () => root.importData(await fetchShortlinkData(shortlinkId)),
      {
        pending: 'Loading data from shared link...',
        success: 'Loaded data from shared link!',
        error: 'Failed to load shared link data. Please try again.',
      },
      { toastId: 'shortlink' },
    );
  } catch (e) {
    console.error(e);
  }
  window.history.replaceState({}, '', process.env.NEXT_PUBLIC_BASE_PATH);
}

async function restoreSession(root: RootStore): Promise<void> {
  try {
    if (await root.load()) {
      toast.success('Restored last browser session', { toastId: 'state-restore' });
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Loads saved state from shortlink, otherwise local storage, whichever is present.
 * Needs to be run before the stores are started to avoid some undesired reactions.
 */
export async function loadInitialData(root: RootStore, params: InitialLoadParams): Promise<InitialLoadResult> {
  root.ui.update({ debug: process.env.NODE_ENV === 'development' });

  try {
    await root.preferences.load();
  } catch (e) {
    console.error(e);
  }

  let persistState = true;
  if (params.shortlinkId) {
    await loadShortlink(root, params.shortlinkId);
    // allow shortlinks to clobber local storage state if we're in dev mode
    // (otherwise the first load respects it, but all hot reloads reset state)
    persistState = !!process.env.NEXT_PUBLIC_LOCAL_STORE_SHORTLINKS;
  } else {
    await restoreSession(root);
  }

  if (params.monsterId) {
    const monsterId = parseInt(params.monsterId);
    const target = availableMonsters.find((m) => m.id === monsterId);
    if (target) {
      root.monster.select(target);
    }
  }

  return { persistState };
}

export function startStores(root: RootStore, { persistState }: InitialLoadResult): () => void {
  const worker = new CalcWorker();
  worker.initWorker();

  const stops = [
    root.preferences.start(),
    root.monster.start(),
    root.loadouts.start(),
    root.calc.start(worker),
    root.start({ persistState }),
  ];

  return () => {
    stops.forEach((stop) => stop());
    worker.shutdown();
  };
}

/**
 * Loads the initial data into the stores and then starts them. This is a dummy component that is rendered inside a
 * Suspense boundary in home.tsx. This is so that we have access to searchParams without causing a flash of
 * un-styled/wrongly styled content.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering
 */
const InitialLoad: React.FC = () => {
  const root = useStore();
  const searchParams = useSearchParams();
  // The load must run once, even though StrictMode runs the effect below twice
  const initialLoad = useRef<Promise<InitialLoadResult>>();

  useEffect(() => {
    initialLoad.current ??= loadInitialData(root, {
      shortlinkId: searchParams.get('id'),
      monsterId: searchParams.get('monster'),
    });

    let stopped = false;
    let stopStores: (() => void) | undefined;
    initialLoad.current.then((result) => {
      if (!stopped) {
        stopStores = startStores(root, result);
      }
    });

    return () => {
      stopped = true;
      stopStores?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default InitialLoad;
