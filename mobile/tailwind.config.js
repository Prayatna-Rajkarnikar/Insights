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
        primaryWhite: "#E4E6E7",
        lightGray: "#8B8F92",
        darkGray: "#323435",
        primaryBlack: "#080A09",
        secondaryBlack: "#25292D",
        accent: "#2840B5",
      },
    },
  },
  plugins: [],
};
