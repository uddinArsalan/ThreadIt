/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%': { 'transform': 'scale(0)' },
          '100%': { 'transform': 'scale(2)' }
        }
      },
      animation: {
        wave: 'wave 10s linear infinite'
      }
      ,
      colors : {
        "BGColor" : "#102a43",
        "LogIn" : "#010C80",
        "Links" : "#E4BF8E",
        'mainSec' : "#77D4FC",
        'footer' : '#121212',
        "button" : "#FF7E6D",
        "heroSec" : "#77D4FC"
      },
      fontFamily : {
        'Roboto': ['Roboto', 'sans-serif']
      },
      backgroundImage: {
        'grid': "url('./assets/square_grid.png')"
      }
    },
  },
  plugins: [],
}
