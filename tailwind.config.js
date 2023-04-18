const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jbm)', ...fontFamily.mono]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-dracula')(),
    require('@headlessui/tailwindcss')({prefix: 'ui'})
  ],
}
