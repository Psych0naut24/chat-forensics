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
        obsidian: {
          950: '#070A10',
          900: '#0D111A',
          850: '#121824',
          800: '#182132',
          700: '#222E44',
          600: '#32425E',
        },
        amber: {
          450: '#FBBF24',
          500: '#F59E0B',
          550: '#EAB308',
          600: '#D97706',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
