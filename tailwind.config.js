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
          950: 'rgb(var(--color-obsidian-950) / <alpha-value>)',
          900: 'rgb(var(--color-obsidian-900) / <alpha-value>)',
          850: 'rgb(var(--color-obsidian-850) / <alpha-value>)',
          800: 'rgb(var(--color-obsidian-800) / <alpha-value>)',
          750: 'rgb(var(--color-obsidian-750) / <alpha-value>)',
          700: 'rgb(var(--color-obsidian-700) / <alpha-value>)',
          600: '#32425E',
        },
        amber: {
          50: 'rgb(var(--color-amber-50) / <alpha-value>)',
          100: 'rgb(var(--color-amber-100) / <alpha-value>)',
          200: 'rgb(var(--color-amber-200) / <alpha-value>)',
          300: 'rgb(var(--color-amber-300) / <alpha-value>)',
          400: 'rgb(var(--color-amber-400) / <alpha-value>)',
          450: 'rgb(var(--color-amber-450) / <alpha-value>)',
          500: 'rgb(var(--color-amber-500) / <alpha-value>)',
          550: 'rgb(var(--color-amber-600) / <alpha-value>)',
          600: 'rgb(var(--color-amber-600) / <alpha-value>)',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
