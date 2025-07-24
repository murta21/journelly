/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 Enables dark mode via class (not media query)
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
