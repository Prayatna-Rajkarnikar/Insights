/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primaryWhite: "#F8F9FA",
        secondaryWhite: "#F1F3F5",
        lightGray: "#E9ECEF",
        darkGray: "#8B8F92",
        primaryBlack: "#212529",
        secondaryBlack: "#2D3135",
      },
    },
  },
  plugins: [],
};
