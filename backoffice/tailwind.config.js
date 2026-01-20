/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#F26522',
          600: '#E05A1A',
        },
      },
    },
  },
  plugins: [],
};
