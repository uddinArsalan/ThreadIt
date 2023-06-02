/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "BGColor" : "#102a43",
        "LogIn" : "#010C80",
        "Links" : "#E4BF8E",
        'mainSec' : "#77D4FC",
        'footer' : '#121212'
      }
    },
  },
  plugins: [],
}
