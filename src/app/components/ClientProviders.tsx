'use client';

import React, {PropsWithChildren} from 'react';
import {StoreProvider} from '@/state';
import TopBar from './TopBar';

import {GlobalState} from '@/state';
import Footer from "@/app/components/Footer";
import {ThemeProvider} from "next-themes";

const store = new GlobalState();

const ClientProviders: React.FC<PropsWithChildren> = (props) => {
  const {children} = props;

  return (
    <ThemeProvider enableSystem={true} attribute={'class'}>
      <StoreProvider store={store}>
        <main>
          <TopBar />
          {children}
          <Footer />
        </main>
      </StoreProvider>
    </ThemeProvider>
  )
}

export default ClientProviders;
