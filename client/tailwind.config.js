/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f6',
          100: '#dcf2e8',
          200: '#bae5d4',
          300: '#7dd3b0',
          400: '#38b88c',
          500: '#68a390', // Your specified teal
          600: '#5a8f7e',
          700: '#4c7b6c',
          800: '#3e675a',
          900: '#305348',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#2C3E50', // Dark blue/grey from logo
        },
        beige: {
          50: '#fefdfb',
          100: '#f2ebdc', // Your specified beige rgb(242, 235, 220)
          200: '#e8ddd0',
          300: '#ddcfc4',
          400: '#d2c1b8',
          500: '#c7b3ac',
          600: '#bca5a0',
          700: '#b19794',
          800: '#a68988',
          900: '#9b7b7c',
        },
      }
    },
  },
  plugins: [],
}

