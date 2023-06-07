'use client';

import React, {PropsWithChildren} from 'react';
import {StoreProvider} from '@/state';
import TopBar from './TopBar';

import {GlobalState} from '@/state';
import Footer from "@/app/components/Footer";
import {ThemeProvider} from "next-themes";
const store = new GlobalState();

const BaseProviders: React.FC<PropsWithChildren> = (props) => {
  const {children} = props;

  return (
    <StoreProvider store={store}>
        <ThemeProvider enableSystem={true} attribute={'class'}>
            <main>
                <TopBar />
                {children}
                <Footer />
            </main>
        </ThemeProvider>
    </StoreProvider>
  )
}

export default BaseProviders;
