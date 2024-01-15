import { PT_Serif, IBM_Plex_Sans } from 'next/font/google';

export const pts = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pts',
});

export const ibm = IBM_Plex_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm',
});
