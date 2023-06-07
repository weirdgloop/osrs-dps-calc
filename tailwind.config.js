const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-pts)', ...fontFamily.serif],
        sans: ['var(--font-ibm)', ...fontFamily.sans],
      },
      colors: {
        /**
         * This colour palette is inspired by the theme used on the OSRS Wiki.
         * @see https://oldschool.runescape.wiki/w/RuneScape:Theme
         */
        body: {
          100: '#e2dbc8',
          200: '#d8ccb4',
          300: '#d0bd97',
          400: '#b8a282',
          500: '#94866d',
        },
        btns: {
          100: '#605443',
          200: '#3c352a',
          300: '#3a301d',
          400: '#52351e',
          500: '#18140c',
        },
        link: '#936039',
        gray: {
          100: '#f9f9f9',
          200: '#eeeeee',
          300: '#cccccc',
          400: '#777777',
          500: '#4c4c4c',
          600: '#333333',
        },
        tile: '#f9f3eb',
        red: {
          100: '#feecea',
          200: '#fbc0ba',
          300: '#ee4231',
          400: '#9f261e',
          500: '#801c13',
        },
        orange: {
          100: '#fef0e4',
          200: '#fbcfa6',
          300: '#f7861b',
          400: '#b55e0c',
          500: '#7a3f08',
        },
        yellow: {
          100: '#fef9de',
          200: '#fcea94',
          300: '#f9d000',
          400: '#a48900',
          500: '#786300',
        },
        green: {
          100: '#ecf8e3',
          200: '#c3e8a3',
          300: '#6bc71f',
          400: '#3c780a',
          500: '#2e5e05',
        },
        blue: {
          100: '#e5f3fc',
          200: '#aad9f5',
          300: '#3ea6e6',
          400: '#0b5884',
          500: '#03436b',
        },
        purple: {
          100: '#f0ecfa',
          200: '#cfc0f0',
          300: '#855cd8',
          400: '#4f348b',
          500: '#3d276b',
        },
        pink: {
          100: '#fceef9',
          200: '#f5c8ec',
          300: '#e874cf',
          400: '#984c89',
          500: '#6d3662',
        },
        deepgray: {
          100: '#f9fafa',
          200: '#e4eaee',
          300: '#949eaa',
          400: '#5d6773',
          500: '#444e5a'
        },
        dark: {
          100: '#071022', // @portage
          200: '#596e96', // @waikawa-grey
          300: '#313e59', // @pickled-bluewood
          400: '#222e45', // @cloud-burst
          500: '#172136', // @big-stone
          600: '#071022', // @dark-body
          700: '#98a2b6',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@headlessui/tailwindcss')({prefix: 'ui'})
  ],
}
