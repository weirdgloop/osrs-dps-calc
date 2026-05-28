'use client';

import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from 'next-themes';
import { DefaultPreferencesProvider } from '@/state/Preferences';
import { DefaultMonsterProvider } from '@/state/MonsterStore';
import { DefaultUIStateProvider } from '@/state/UIStateStore';
import { DefaultDebugStateProvider } from '@/state/DebugStore';
import { DefaultIssuesProvider } from '@/state/IssuesStore';
import { DefaultLoadoutStoreProvider } from '@/state/LoadoutStore';

const ClientProviders: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <DefaultDebugStateProvider>
      <ThemeProvider defaultTheme="dark" enableSystem={false} enableColorScheme={false} attribute="class">
        <DefaultUIStateProvider>
          <DefaultPreferencesProvider>
            <DefaultMonsterProvider>
              <DefaultLoadoutStoreProvider>
                <DefaultIssuesProvider>
                  <main>
                    {children}
                  </main>
                </DefaultIssuesProvider>
              </DefaultLoadoutStoreProvider>
            </DefaultMonsterProvider>
          </DefaultPreferencesProvider>
        </DefaultUIStateProvider>
      </ThemeProvider>
    </DefaultDebugStateProvider>
  );
};

export default ClientProviders;
