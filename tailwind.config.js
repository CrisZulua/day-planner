/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.{html,js}",],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    colors: {
      'body-bg': '#f0f3e8',
      'primary': '#386A20',
      'on-primary': '#FFFFFF',
      'primary-container': '#B8F397',
      'on-primary-container': '#042100',
      'secondary': '#55624C',
      'on-secondary': '#FFFFFF',
      'secondary-container': '#D9E7CB',
      'on-secondary-container': '#131F0D',
      'tertiary': '#386667',
      'on-tertiary': '#FFFFFF',
      'tertiary-container': '#bbebeb',
      'on-tertiary-container': '#002020',
    },
  },
  plugins: [],
}

