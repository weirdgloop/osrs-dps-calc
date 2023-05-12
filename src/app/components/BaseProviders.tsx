'use client';

import React, {PropsWithChildren} from 'react';
import {StoreProvider} from '@/state';
import {ibm, pts} from '@/fonts';
import bg from '@/public/img/bg.png';
import TopBar from './TopBar';

import {GlobalState} from '@/state';
const store = new GlobalState();

const BaseProviders: React.FC<PropsWithChildren> = (props) => {
  const {children} = props;

  return (
    <StoreProvider store={store}>
      <main className={`${pts.variable} ${ibm.variable}`} style={{background: `url(${bg.src})`}}>
        <TopBar />
        {children}
      </main>
    </StoreProvider>
  )
}

export default BaseProviders;
