'use client';

import React, { PropsWithChildren } from 'react';
import { StoreProvider, GlobalState } from '@/state';

import Footer from '@/app/components/Footer';
import { ThemeProvider } from 'next-themes';
import TopBar from './TopBar';

const store = new GlobalState();

const ClientProviders: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider enableSystem attribute="class">
      <StoreProvider store={store}>
        <main className="flex flex-col h-[100vh]">
          <div>
            <TopBar />
          </div>
          <div className="grow">
            {children}
          </div>
          <Footer />
        </main>
      </StoreProvider>
    </ThemeProvider>
  );
};

export default ClientProviders;
