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
        gov: {
          navy: '#0B2E5C',
          blue: '#1D4E9E',
          link: '#0B57D0',
          page: '#EEF3FA',
          border: '#D0D7E2',
          text: '#1A1A1A',
          muted: '#5B6574',
          footer: '#0B2540',
          success: '#1E7B34',
          warning: '#E8801A',
          danger: '#B42318',
          purple: '#6941C6',
        },
        tint: {
          blue: '#E8F0FB',
          green: '#E6F4EA',
          orange: '#FDF0E3',
          red: '#FDECEA',
          purple: '#EFEAFB',
        },
        nav: {
          institution: '#1D4E9E',
          officer: '#0E7490',
          senior: '#4338CA',
          admin: '#8B1A1A',
          auditor: '#3B4252',
        },
      },
      borderRadius: {
        gov: '6px',
      },
      boxShadow: {
        gov: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
