import '../styles/globals.css'
import type { AppProps } from 'next/app'
import TopBar from '../components/TopBar';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <TopBar />
    <Component {...pageProps} />
  </>
}

export default MyApp;
