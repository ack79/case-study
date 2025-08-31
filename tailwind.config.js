/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,html}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'white': '#FFFFFF',
        'black': '#000000',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}