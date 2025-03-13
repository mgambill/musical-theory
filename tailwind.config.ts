
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./node_modules/@v3technology/components/src/**/*.{vue,js}', './index.html', './{src,packages}/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /(col|row)-(span|start)-(\d+|auto)/
    },
    {
      pattern: /grid-(cols|rows)-(\d+|auto)/
    },
    'grid-flow-row',
    'grid-flow-col'
  ],
  plugins: [],
}
