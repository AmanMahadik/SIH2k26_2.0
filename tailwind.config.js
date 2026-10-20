/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aicte: {
          blue: '#1E3A8A',
          navy: '#0F172A',
          orange: '#EA580C',
          gold: '#D97706',
          green: '#059669',
          light: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};
