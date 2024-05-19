/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        navbarText: '28px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navbarLight: '#68D1F2',
        navbarDark: '#26B0DC',
        homepgTestLight: '#109ECB',
        homepgTestDark: '#035481',
      },
      backgroundColor: {
        salmon: '#FF7D7D',
      },
    },
  },
  plugins: [],
};
