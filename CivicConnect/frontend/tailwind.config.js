/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Master spec: #2563EB
          700: '#1d4ed8',
        },
        secondary: {
          900: '#0f172a', // Master spec: #0F172A
          800: '#1e293b',
          700: '#334155',
        },
        accent: {
          500: '#10b981',
          600: '#059669', // Master spec: #059669
        },
        surface: '#ffffff',
        background: '#f8fafc',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
