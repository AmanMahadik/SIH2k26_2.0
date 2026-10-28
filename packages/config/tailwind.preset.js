// packages/config/tailwind.preset.js
// Shared AICTE Theme Tokens for NirikshAI Web & Design System

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        aicte: {
          navy: '#0B1D3A',
          gold: '#D4AF37',
          orange: '#FF9933',
          green: '#138808',
          blue: '#1E3A8A',
          lightNavy: '#1E293B',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        regulatory: {
          verified: '#10B981',
          mismatch: '#EF4444',
          expired: '#F59E0B',
          pending: '#6B7280',
          unavailable: '#8B5CF6',
          review: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
};
