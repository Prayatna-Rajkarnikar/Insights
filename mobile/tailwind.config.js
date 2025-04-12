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
        primaryWhite: "#E8E8E8",
        lightGray: "#ABABAB",
        primaryBlack: "#121212",
        secondaryBlack: "#1E1E1E",
        accent: "#3949AB",
      },
    },
  },
  plugins: [],
};
