import '../styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import TopBar from '../components/TopBar';
import {GlobalState, StoreProvider} from '../state/state';
import {ibm, pts} from '../fonts';

const store = new GlobalState();

function MyApp({ Component, pageProps }: AppProps) {
  return <StoreProvider store={store}>
    <main className={`${pts.variable} ${ibm.variable}`}>
      <TopBar />
      <Component {...pageProps} />
    </main>
  </StoreProvider>
}

export default MyApp;
