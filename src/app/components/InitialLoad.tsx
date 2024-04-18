import React, { useEffect, useState } from 'react';
import { useStore } from '@/state';
import { useSearchParams } from 'next/navigation';
import localforage from 'localforage';
import { observer } from 'mobx-react-lite';
import { ImportableData } from '@/types/State';
import { toast } from 'react-toastify';

/**
 * This is a dummy component that is rendered inside a Suspense boundary in home.tsx. This is so that we have access to
 * searchParams without causing a flash of un-styled/wrongly styled content.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering
 */
const InitialLoad: React.FC = observer(() => {
  const store = useStore();
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const doFirstLoad = async () => {
      const id = searchParams.get('id');
      if (id) {
        // If there was a share ID provided, load the data for it into the calculator
        await store.loadShortlink(id);
        window.history.replaceState({}, '', process.env.NEXT_PUBLIC_BASE_PATH);
      } else {
        // Else, try to load any previously saved session from localStorage
        try {
          const state = await localforage.getItem('dps-calc-state');
          store.updateImportedData(state as ImportableData);
          toast.success('Restored last browser session', { toastId: 'state-restore' });
        } catch (e) {
          // If state couldn't be loaded (or there wasn't any), then try to load the username and lookup stats, at least
          try {
            const username = await localforage.getItem('dps-calc-username');
            store.updateUIState({ username: username as string });
            if (username) {
              store.fetchCurrentPlayerSkills();
            }
          } catch (e2) { /* do nothing */ }
        }

        store.startStorageUpdater();
      }

      const monster = searchParams.get('monster');
      if (monster) {
        const target = store.availableMonsters.find((m) => m.id === parseInt(monster));
        if (target) {
          // If a monster ID was provided, set the active monster to it.
          store.updateMonster(target);
        }
      }

      setLoaded(true);
    };

    if (loaded) return;
    doFirstLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
});

export default InitialLoad;
