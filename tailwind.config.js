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
      yellow: '#DEB700',
      gold: '#9F8A01',
      grayDark: '#333333',
      gray: '#7E7E7E',
      offWhite: '#F7F7F7',
      pink: '#FB7DE6',
      red: colors.red,
      black: colors.black,
      white: colors.white,
    },
  },
  plugins: [],
};
