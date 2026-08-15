/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd2ff',
          300: '#8eb4ff',
          400: '#598bff',
          500: '#3366ff',
          600: '#1f48f5',
          700: '#1a3ae1',
          800: '#1e33b6',
          900: '#1e329a',
          950: '#172258',
          navy: '#0f1e4d',
        },
        accent: {
          success: '#16a34a',
          warning: '#f59e0b',
          error: '#dc2626',
          info: '#3366ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 30, 77, 0.06), 0 1px 2px rgba(15, 30, 77, 0.04)',
        'card-hover': '0 8px 24px rgba(15, 30, 77, 0.10), 0 2px 6px rgba(15, 30, 77, 0.06)',
      },
    },
  },
  plugins: [],
};
