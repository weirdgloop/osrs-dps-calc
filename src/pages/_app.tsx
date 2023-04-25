import '../styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import TopBar from '../components/TopBar';
import {GlobalState, StoreProvider} from '../state';
import {ibm, pts} from '../fonts';
import bg from '@/img/bg.png';

const store = new GlobalState();

function MyApp({ Component, pageProps }: AppProps) {
  return <StoreProvider store={store}>
    <main className={`${pts.variable} ${ibm.variable}`} style={{background: `url(${bg.src})`}}>
      <TopBar />
      <Component {...pageProps} />
    </main>
  </StoreProvider>
}

export default MyApp;
