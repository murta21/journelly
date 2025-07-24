/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // 👈 for Next.js App Router
    './components/**/*.{js,ts,jsx,tsx}' // (optional if you make component files)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
