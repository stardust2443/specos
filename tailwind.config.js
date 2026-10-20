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
          bg: '#08090A',
          surface: '#111317',
          elevated: '#171A20',
          hover: '#1F232B',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
          borderHighlight: 'rgba(255, 255, 255, 0.14)',
          text: '#F5F5F7',
          textSecondary: '#86868B',
          textTertiary: '#515154',
          accent: '#0A84FF', // Apple iOS system blue
          accentHover: '#0071E3',
          purple: '#BF5AF2',
          emerald: '#30D158',
          amber: '#FF9F0A',
          red: '#FF453A',
        },
        spec: {
          bg: '#08090A',
          card: '#111317',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1B1E24',
          accent: '#0A84FF',
          accentHover: '#0071E3',
          textMuted: '#86868B',
          textMain: '#F5F5F7',
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
