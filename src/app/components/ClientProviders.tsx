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
        <main className={'flex flex-col h-[100vh]'}>
          <div>
            <div className={'bg-pink-500 py-2 px-6 border-b border-pink-300 text-sm text-pink-100 select-none'}>
              <span className={'font-bold mr-4'}>WORK IN PROGRESS</span> We&apos;re still working on this. It should not
              currently be used for actual calculation.
            </div>
            <TopBar/>
          </div>
          <div className={'flex-grow'}>
            {children}
          </div>
          <Footer />
        </main>
      </StoreProvider>
    </ThemeProvider>
  )
}

export default ClientProviders;
