/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#BA2329",
        secondary: "#007DDB",
        light: "#272e38",
        dark: "#161B22",
        darker: "#010409",
      },
    },
  },
  plugins: [],
};
