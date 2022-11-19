/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: "#CBD5E1",
        lighter: "#E2E8F0",
        lightest: "#E2E8F0",
        medium: "#272e38",
        dark: "#272e38",
        darker: "#161B22",
        darkest: "#010409",
        background: "#121212",
        error: "#ff5454",
      },
    },
  },
  plugins: [],
};
