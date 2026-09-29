/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#d9f1ff',
          200: '#bce5ff',
          300: '#8ed3ff',
          400: '#59b8ff',
          500: '#3399ff',
          600: '#1b7bf2',
          700: '#1560d9',
          800: '#174fb0',
          900: '#18458b',
        },
        teal: {
          50: '#effcf9',
          100: '#c9fbed',
          200: '#93f5dc',
          300: '#52e8c6',
          400: '#25d0ad',
          500: '#0db595',
          600: '#079279',
          700: '#087464',
          800: '#0a5c52',
          900: '#0b4c44',
        },
        accent: {
          50: '#fff8eb',
          100: '#ffedc6',
          200: '#ffd988',
          300: '#ffbf4a',
          400: '#ffa620',
          500: '#f98307',
          600: '#dd6402',
          700: '#b74706',
          800: '#94380c',
          900: '#7a2f0d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
