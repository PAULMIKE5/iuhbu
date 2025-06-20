/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F59E0B', // Amber 500
          light: '#FBBF24',   // Amber 400
          dark: '#D97706',    // Amber 600
        },
        secondary: {
          DEFAULT: '#EC4899', // Pink 500
          light: '#F472B6',   // Pink 400
          dark: '#DB2777',    // Pink 600
        },
        accent: {
          DEFAULT: '#FCD34D', // Amber 300 (goldish yellow)
        },
        ranger: '#A855F7', // Purple 500 for RangerAI token
        'primary-dark': '#0F172A', // Slate 900
        'secondary-dark': '#1E1B4B', // Indigo 900
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 6s infinite ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
        'button-glow': 'button-glow 2.5s infinite alternate ease-in-out', 
        'card-glow': 'card-glow 3s infinite alternate ease-in-out',     
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { opacity: '0.1', transform: 'scale(0.95)' },
          '50%': { opacity: '0.25', transform: 'scale(1.05)' },
        },
        'button-glow': { 
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(245, 158, 11, 0.4), 0 0 10px rgba(245, 158, 11, 0.2)', 
            transform: 'translateY(0px)'
          },
          '50%': {
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.7), 0 0 20px rgba(245, 158, 11, 0.5)',
            transform: 'translateY(-2px)'
          }
        },
        'card-glow': { 
          '0%, 100%': {
            boxShadow: '0 0 8px 2px rgba(168, 85, 247, 0.3)', 
          },
          '50%': {
            boxShadow: '0 0 18px 5px rgba(168, 85, 247, 0.5)',
          }
        }
      }
    }
  },
  plugins: [],
}
