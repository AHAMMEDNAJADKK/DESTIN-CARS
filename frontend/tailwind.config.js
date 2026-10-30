/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        destin: {
          forest: '#003D2F',       // Primary Deep Forest Green from Logo
          dark: '#004B38',         // Premium Dark Green
          lime: '#D8EB29',         // Official Lime Yellow Accent
          limeHover: '#C6D922',    // Interactive Lime Hover
          soft: '#F5F8F5',         // Soft Luxury Background
          textDark: '#102B24',     // Dark High-Contrast Text
          textMuted: '#718078',    // Refined Muted Text
          border: '#DCE7E0',       // Subtle Border
          card: '#FFFFFF',
          forestLight: '#074838',
          forestDeep: '#002B21'
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
