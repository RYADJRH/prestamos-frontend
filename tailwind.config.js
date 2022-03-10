module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: false,
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
