'use client';

import React, { PropsWithChildren, useState } from 'react';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/header/Header';
import { ThemeProvider } from 'next-themes';
import RootStore from '@/state/RootStore';
import RootStoreProvider from '@/state/RootStoreProvider';

const ClientProviders: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [rootStore] = useState(() => new RootStore());

  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} enableColorScheme={false} attribute="class">
      <RootStoreProvider store={rootStore}>
        <main className="flex flex-col h-[100vh]">
          <div>
            <Header />
          </div>
          <div className="grow">
            {children}
          </div>
          <Footer />
        </main>
      </RootStoreProvider>
    </ThemeProvider>
  );
};

export default ClientProviders;
