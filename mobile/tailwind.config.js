// tailwind.config.js

module.exports = {
  content: [
    "./App.{js,jsx}",
    "./screens/**/*.{js,jsx}",
    "./helpers/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryWhite: "#F8F9FA",
        secondaryWhite: "#F1F3F5",
        lightGray: "#E9ECEF",
        darkGray: "#8B8F92",
        primaryBlack: "#212529",
        secondaryBlack: "#2D3135",
        accent: "#7871AA",
      },
    },
  },
  plugins: [],
};
