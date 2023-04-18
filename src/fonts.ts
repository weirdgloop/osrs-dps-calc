import localFont from 'next/font/local';

const rsFont = localFont({
  src: [
    {
      path: './public/fonts/runescape.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: './public/fonts/runescape_bold.ttf',
      weight: '500',
      style: 'normal'
    }
  ]
})

const jbm = localFont({
  src: [
    {
      path: './public/fonts/JetBrainsMono[wght].ttf',
    }
  ],
  variable: '--font-jbm'
})

export default {rsFont, jbm};