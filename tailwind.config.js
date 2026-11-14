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
          950: 'var(--color-base)',
          900: 'var(--color-surface)',
          850: 'var(--color-card)',
          800: 'var(--color-border)',
          750: 'var(--color-border-subtle)',
          700: 'var(--color-border-subtle)',
          600: '#32425E',
        },
        amber: {
          450: 'var(--color-accent-text)',
          500: 'var(--color-accent)',
          550: 'var(--color-accent-hover)',
          600: 'var(--color-accent-hover)',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
