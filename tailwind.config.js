/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'short': { 'raw': '(max-height: 700px)' },
        'tall': { 'raw': '(min-height: 900px)' },
      },
    },
  },
  plugins: [],
}
