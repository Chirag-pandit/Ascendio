/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fbfc',
          100: '#f1f6f8',
          200: '#e3edf1',
          300: '#d1dfe5',
          400: '#adc4ce',
          500: '#96b6c5',
          600: '#7a9fb0',
          700: '#658394',
          800: '#546b78',
          900: '#475862',
        },
        secondary: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fbfbfb',
          300: '#f8f8f8',
          400: '#f1f0e8',
          500: '#eee0c9',
          600: '#e6d1a8',
          700: '#dcc187',
          800: '#d0b066',
          900: '#c29f45',
        },
        accent: {
          50: '#f8fefe',
          100: '#f1fdfd',
          200: '#e3fdfd',
          300: '#d4fbfb',
          400: '#cbf1f5',
          500: '#a6e3e9',
          600: '#71c9ce',
          700: '#5bb0b5',
          800: '#45979c',
          900: '#2f7e83',
        },
        neutral: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fbfbfb',
          300: '#f8f8f8',
          400: '#f1f0e8',
          500: '#eee0c9',
          600: '#e6d1a8',
          700: '#dcc187',
          800: '#d0b066',
          900: '#c29f45',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};