/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        vampire: ['"Vampire_Raves"', 'sans-serif'],
        quub: ['"QUUB"', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f8fb',
          100: '#eceef4',
          200: '#d4d9e6',
          300: '#b3bdd3',
          400: '#8896b5',
          500: '#64708f',
          600: '#4b5570',
          700: '#394158',
          800: '#262c3c',
          900: '#161a24'
        },
        accent: {
          50: '#edf8ff',
          100: '#d6f0ff',
          200: '#aae2ff',
          300: '#72cbff',
          400: '#2ea8ff',
          500: '#0b84f3',
          600: '#0968c2',
          700: '#0b549d',
          800: '#104778',
          900: '#123c62'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(11, 132, 243, 0.16), transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,247,252,1))'
      }
    }
  },
  plugins: []
};