/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          darkest: '#030303',
          hero: '#050505',
          DEFAULT: '#080808',
          card: '#0D0D0D',
          secondary: '#141414',
          tertiary: '#1B1B1B',
          elevated: '#242424',
        },
        luxury: {
          ivory: '#F5F2EA',
          bone: '#E8E3D8',
          stone: '#B7B2A7',
          muted: '#7A766F',
          champagne: '#C5A880',
          'champagne-light': '#E5D5B8',
          'champagne-dark': '#8E7350',
          gold: '#C5A059',
          border: 'rgba(245, 242, 234, 0.08)',
          'border-hover': 'rgba(197, 168, 128, 0.3)',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'ultra-wide': '0.3em',
        'mega-wide': '0.4em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
