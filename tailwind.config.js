/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        logo: ['Pacifico', 'cursive'],
      },
      boxShadow: {
        soft: '0 18px 40px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
};
