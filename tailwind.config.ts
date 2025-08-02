/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Set 'Quicksand' as the default sans-serif font
        sans: ['var(--font-quicksand)', 'sans-serif'],
        // Keep 'Caveat' for the sticky notes
        caveat: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
};
