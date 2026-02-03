/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#8B5CF6', // violet-500
          DEFAULT: '#7C3AED', // violet-600
          dark: '#6D28D9', // violet-700
          glow: 'rgba(124, 58, 237, 0.4)',
        },
        secondary: {
          light: '#F472B6', // pink-400
          DEFAULT: '#EC4899', // pink-500
          dark: '#DB2777', // pink-600
          glow: 'rgba(236, 72, 153, 0.4)',
        },
        dark: {
          bg: '#020617', // slate-950
          card: '#0f172a', // slate-900
          surface: '#1e293b', // slate-800
          text: '#f8fafc', // slate-50
          muted: '#94a3b8', // slate-400
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.5)',
        'glow-pink': '0 0 20px -5px rgba(244, 114, 182, 0.5)',
      }
    },
  },
  plugins: [],
}
