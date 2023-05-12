'use client';

import React, {PropsWithChildren} from 'react';
import {StoreProvider} from '@/state';
import {ibm, pts} from '@/fonts';
import TopBar from './TopBar';

import {GlobalState} from '@/state';
const store = new GlobalState();

const BaseProviders: React.FC<PropsWithChildren> = (props) => {
  const {children} = props;

  return (
    <StoreProvider store={store}>
      <main className={`${pts.variable} ${ibm.variable}`}>
        <TopBar />
        {children}
      </main>
    </StoreProvider>
  )
}

export default BaseProviders;
