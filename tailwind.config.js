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
        apple: {
          bg: 'var(--apple-bg)',
          surface: 'var(--apple-surface)',
          elevated: 'var(--apple-elevated)',
          hover: 'var(--apple-hover)',
          border: 'var(--apple-border)',
          borderSubtle: 'var(--apple-border-subtle)',
          borderHighlight: 'var(--apple-border-highlight)',
          text: 'var(--apple-text)',
          textSecondary: 'var(--apple-text-secondary)',
          textTertiary: 'var(--apple-text-tertiary)',
          accent: 'var(--apple-accent)',
          accentHover: 'var(--apple-accent-hover)',
          purple: 'var(--apple-purple)',
          emerald: 'var(--apple-emerald)',
          amber: 'var(--apple-amber)',
          red: 'var(--apple-red)',
        },
        spec: {
          bg: 'var(--apple-bg)',
          card: 'var(--apple-surface)',
          border: 'var(--apple-border)',
          hover: 'var(--apple-hover)',
          accent: 'var(--apple-accent)',
          accentHover: 'var(--apple-accent-hover)',
          textMuted: 'var(--apple-text-secondary)',
          textMain: 'var(--apple-text)',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'apple-subtle': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'apple-md': '0 4px 16px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 12px 32px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'apple-glow': '0 0 20px -3px rgba(0, 113, 227, 0.25)',
      }
    },
  },
  plugins: [],
}
