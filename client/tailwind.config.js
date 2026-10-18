/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        agrigreen: {
          50: '#f4f7f2',
          100: '#e5ebe0',
          500: '#53905a',
          700: '#315b40',
          900: '#1b3825'
        }
      }
    }
  },
  plugins: []
};
