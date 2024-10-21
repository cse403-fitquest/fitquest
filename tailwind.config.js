/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#00AEEF',
        purple: '#662D91',
        green: '#39B54A',
        gold: '#FFD200',
        'gray-dark': '#333333',
        gray: '#7E7E7E',
        'off-white': 'BEBEBE',
      },
    },
  },
  plugins: [],
};
