import React, { PropsWithChildren } from 'react';
import '../globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';
import { ibm, pts } from '@/fonts';
import ClientProviders from '@/app/components/ClientProviders';

export const metadata: Metadata = {
  title: 'DPS Calculator - OSRS Wiki',
  description: "See how your gear stacks up against Old School RuneScape's monsters using the OSRS Wiki's damage-per-second calculator.",
  authors: [{ name: 'OSRS Wiki', url: 'https://oldschool.runescape.wiki' }],
  keywords: ['osrs', 'old school runescape', 'runescape', 'dps calculator', 'osrs dps', 'osrs wiki', 'osrs wiki dps'],
  alternates: { canonical: 'https://tools.runescape.wiki/osrs-dps' },
  openGraph: {
    images: [
      'https://tools.runescape.wiki/static/dps-logo.png',
    ],
  },
  twitter: {
    card: 'summary',
  },
};

const RootLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
  // We are suppressing hydration warnings here so that react-themes works correctly.
  // See https://github.com/pacocoursey/next-themes/issues/152#issuecomment-1364280564
    <html suppressHydrationWarning lang="en" className={`${pts.variable} ${ibm.variable}`}>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;
