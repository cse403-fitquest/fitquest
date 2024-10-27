/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      blue: '#00AEEF',
      purple: '#662D91',
      green: '#39B54A',
      yellow: '#FFD200',
      gold: '#9F8A01',
      pink: '#FB7DE6',
      'gray-dark': '#333333',
      gray: '#7E7E7E',
      'off-white': 'BEBEBE',
      red: colors.red,
      black: colors.black,
      white: colors.white,
    },
  },
  plugins: [],
};
