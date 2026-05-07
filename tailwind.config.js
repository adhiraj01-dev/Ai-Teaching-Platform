/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eeedfe',
          100: '#cecbf6',
          400: '#7f77dd',
          500: '#6C63FF',
          600: '#534ab7',
          900: '#26215c',
        },
        teal: {
          400: '#10d9a8',
          500: '#0db896',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.4s ease',
        'pulse-ring': 'pulseRing 1.5s infinite',
      },
      keyframes: {
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(108,99,255,0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(108,99,255,0)' }
        }
      }
    }
  },
  plugins: []
}
