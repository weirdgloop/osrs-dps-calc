'use client';

import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { CalcProvider, useCalc } from '@/worker/CalcWorker';
import { DefaultPreferencesProvider } from '@/state/Preferences';
import { DefaultMonsterDbProvider, useMonsterDb } from '@/db/MonsterDb';
import { DefaultPlayerLoadoutsProvider } from '@/state/PlayerLoadouts';
import { DefaultEquipmentDbProvider, useEquipmentDb } from '@/db/EquipmentDb';
import { observer } from 'mobx-react-lite';
import { DefaultUIStateProvider } from '@/state/UIState';
import { DefaultDebugStateProvider } from '@/state/IsDebug';
import { DefaultMonsterProvider } from '@/state/MonsterStore';

const PostLoadProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <DefaultPreferencesProvider>
    <DefaultMonsterProvider>
      <DefaultPlayerLoadoutsProvider>
        {children}
      </DefaultPlayerLoadoutsProvider>
    </DefaultMonsterProvider>
  </DefaultPreferencesProvider>
);

const LoadBoundary: React.FC<React.PropsWithChildren> = observer(({ children }) => {
  const { loaded: calcWorkerLoaded } = useCalc();
  const { loaded: monstersLoaded } = useMonsterDb();
  const { loaded: equipmentLoaded } = useEquipmentDb();

  if (!calcWorkerLoaded || !monstersLoaded || !equipmentLoaded) {
    return (
      <span className="text-white">
        Loading...
      </span>
    );
  }

  // this rule seems bugged; it's not useless if it's wrapping children
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (<>{children}</>);
});

const PreLoadProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <DefaultDebugStateProvider>
    <ThemeProvider defaultTheme="dark" enableSystem={false} enableColorScheme={false} attribute="class">
      <CalcProvider>
        <DefaultMonsterDbProvider>
          <DefaultEquipmentDbProvider>
            <DefaultUIStateProvider>
              {children}
            </DefaultUIStateProvider>
          </DefaultEquipmentDbProvider>
        </DefaultMonsterDbProvider>
      </CalcProvider>
    </ThemeProvider>
  </DefaultDebugStateProvider>
);

const ClientProviders: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <PreLoadProviders>
      <LoadBoundary>
        <PostLoadProviders>
          <main>
            {children}
          </main>
        </PostLoadProviders>
      </LoadBoundary>
    </PreLoadProviders>
  );
};

export default ClientProviders;
