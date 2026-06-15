/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dorado: {
          DEFAULT: '#C9A84C',
          light: '#E8C96A',
          dark: '#A07A2E',
        },
        crema: '#F7F3ED',
        cafe: {
          DEFAULT: '#6B4423',
          light: '#8B5E3C',
        },
        carbon: '#1C1C2E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
