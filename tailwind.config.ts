import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: '#09090b', panel: '#18181b', surface: '#0d0d0f' },
        border:  { DEFAULT: '#27272a', light: '#3f3f46' },
        primary: { DEFAULT: '#6366f1', dim: 'rgba(99,102,241,0.1)' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
