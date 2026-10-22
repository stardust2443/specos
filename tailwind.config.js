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
          purple: '#BF5AF2',
          emerald: '#30D158',
          amber: '#FF9F0A',
          red: '#FF453A',
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
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'apple-lg': '0 12px 32px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'apple-glow': '0 0 24px -4px rgba(10, 132, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
