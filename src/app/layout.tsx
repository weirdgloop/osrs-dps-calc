import React, {PropsWithChildren} from 'react';
import '../globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import {Metadata} from 'next';
import {ibm, pts} from "@/fonts";

export const metadata: Metadata = {
  title: 'OSRS DPS Calculator',
  description: "See how your gear stacks up against Old School RuneScape's monsters using the OSRS Wiki's damage-per-second calculator.",
};

const RootLayout: React.FC<PropsWithChildren> = (props) => {
  const {children} = props;

  return (
    <html lang={'en'} className={`${pts.variable} ${ibm.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}

export default RootLayout;
