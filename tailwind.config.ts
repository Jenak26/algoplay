import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: 'var(--color-bg)', panel: 'var(--color-bg-panel)', surface: 'var(--color-bg-surface)' },
        border:  { DEFAULT: 'var(--color-border)', light: 'var(--color-border-light)' },
        primary: { DEFAULT: 'var(--color-primary)', dim: 'var(--color-primary-dim)' },
        text:    { DEFAULT: 'var(--color-text)', muted: 'var(--color-text-muted)' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
