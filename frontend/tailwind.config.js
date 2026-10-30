/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: '#051b12',
          dark: '#0a2e20',
          forest: '#0f3d2b',
          emerald: '#16573e',
          medium: '#1c6f4f',
          lime: '#a3e635',
          neon: '#bef264',
          accent: '#84cc16',
          light: '#f0fdf4',
          card: '#ffffff',
          border: '#86efac',
          borderDark: '#10b981',
          textDark: '#062619'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
