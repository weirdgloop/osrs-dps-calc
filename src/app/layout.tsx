import React, {PropsWithChildren} from 'react';
import '../globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import {Metadata} from 'next';
import {ibm, pts} from "@/fonts";
import ClientProviders from "@/app/components/ClientProviders";

export const metadata: Metadata = {
  title: 'OSRS DPS Calculator',
  description: "See how your gear stacks up against Old School RuneScape's monsters using the OSRS Wiki's damage-per-second calculator.",
};

const RootLayout: React.FC<PropsWithChildren> = (props) => {
  const {children} = props;

  return (
      // We are suppressing hydration warnings here so that react-themes works correctly.
      // See https://github.com/pacocoursey/next-themes/issues/152#issuecomment-1364280564
    <html suppressHydrationWarning={true} lang={'en'} className={`${pts.variable} ${ibm.variable}`}>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

export default RootLayout;
