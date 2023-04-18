import '../styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import type { AppProps } from 'next/app';
import TopBar from '../components/TopBar';
import {GlobalState, StoreProvider} from '../state/state';

import bg from '@/img/bg.png';

const store = new GlobalState();

function MyApp({ Component, pageProps }: AppProps) {
  return <StoreProvider store={store}>
    <main
      style={{
        background: `url(${bg.src})`,
      }}
    >
      <TopBar />
      <Component {...pageProps} />
    </main>
  </StoreProvider>
}

export default MyApp;
