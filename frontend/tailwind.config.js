/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      dark: '#1E0802',
      light: '#DFCAA1',
      dark_light: '#caaf79',

      error: '#ef4444',
      warning: '#d1af3f',

      moving: '#d1af3f',
      killing: '#ef4444',
      pulling: '#A593B9',
      pushing: '#93B0B9',
      player1: '#d17c3f',
      player2: '#7f995a'
    },
    fontFamily: {
      secondary_bold: ['Kalam-Bold', 'Arial'],
      secondary_regular: ['Kalam-Regular', 'Arial'],
      primary_bold: ['Lato-Bold', 'Arial'],
      primary_regular: ['Lato-Regular', 'Arial']
    },
    extend: {
      rotate: {
        270: '270deg'
      }
    }
  },
  plugins: []
}
