import React, { useEffect } from 'react';
import { useStore } from '@/state';
import { useSearchParams } from 'next/navigation';
import localforage from 'localforage';
import { observer } from 'mobx-react-lite';

/**
 * This is a dummy component that is rendered inside a Suspense boundary in home.tsx. This is so that we have access to
 * searchParams without causing a flash of un-styled/wrongly styled content.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering
 */
const InitialLoad: React.FC = observer(() => {
  const store = useStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      // If there was a share ID provided, load the data for it into the calculator
      store.loadShortlink(id);
    } else {
      // Else, load username from browser storage if there is one and lookup stats
      localforage.getItem('dps-calc-username').then((u) => {
        store.updateUIState({ username: u as string });
        if (u) store.fetchCurrentPlayerSkills();
      }).catch(() => {});
    }

    const monster = searchParams.get('monster');
    if (monster) {
      const target = store.availableMonsters.find((m) => m.id === parseInt(monster));
      if (target) {
        // If a monster ID was provided, set the active monster to it.
        store.updateMonster(target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
});

export default InitialLoad;
