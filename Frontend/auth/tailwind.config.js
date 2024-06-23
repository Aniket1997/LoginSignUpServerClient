/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#657786',
        'background': '#E1E8ED',
        'border': '#AAB8C2',
      },
    },
  },
  plugins: [],
};
