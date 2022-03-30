module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        body:['Nunito']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
