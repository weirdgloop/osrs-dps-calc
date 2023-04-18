import {Head, Html, Main, NextScript} from 'next/document';
import fonts from '../fonts';

export default function Document() {
  return (
    <Html>
      <Head />
      <body className={`${fonts.jbm.variable}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
};