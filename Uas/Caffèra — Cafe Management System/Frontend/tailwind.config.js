/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#846358',
          800: '#674d44',
          900: '#4a3731',
          950: '#2b1f1b',
        },
        amber: {
          50: '#fffdf5',
          100: '#fef9e8',
          200: '#fdf0c5',
          300: '#fce397',
          400: '#fad160',
          500: '#fbb710',
          600: '#e59e07',
          700: '#bf7906',
          800: '#985d0b',
          900: '#7c4c0d',
          950: '#472703',
        },
        brand: {
          yellow: '#fbb710',
          dark: '#131212',
          gray: '#6d6d6d',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px rgba(217, 119, 6, 0.25)',
      }
    },
  },
  plugins: [],
}
