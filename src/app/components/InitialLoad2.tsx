import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLoadouts } from '@/state/LoadoutStore';

/**
 * This is a dummy component that is rendered inside a Suspense boundary in home.tsx. This is so that we have access to
 * searchParams without causing a flash of un-styled/wrongly styled content.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering
 */
const InitialLoad: React.FC = observer(() => {
  const { loadouts } = useLoadouts();
  useEffect(() => {
    loadouts.forEach((l) => l.startUp());
  });

  return null;
});

export default InitialLoad;
