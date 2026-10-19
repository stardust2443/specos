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
        spec: {
          bg: '#0A0A0C',
          card: '#121216',
          border: '#222228',
          hover: '#1B1B22',
          accent: '#5E6AD2', // Linear-inspired indigo
          accentHover: '#4D58BF',
          textMuted: '#8A8F98',
          textMain: '#EDEDEF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
