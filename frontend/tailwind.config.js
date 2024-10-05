/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      dark: '#1E0802',
      light: '#DFCAA1',
      dark_light: '#caaf79',

      error: '#ef4444',
      success: '#10b981',
      info: '#669bbc',

      moving: '#b9b6a9',
      killing: '#ef4444',
      pulling: '#A593B9',
      pushing: '#93b9b7',
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
