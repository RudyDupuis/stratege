/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      dark: '#121212',
      warning: '#fcd34d',
      player1: '#f97316',
      player2: '#65a30d'
    },
    extend: {
      rotate: {
        270: '270deg'
      }
    }
  },
  plugins: []
}
