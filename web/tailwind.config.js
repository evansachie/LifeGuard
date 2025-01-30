const { colors } = require("@mui/material");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#3E76D8',
        'custom-blue-hover': '#2d5bb9'
      }
    },
  },
  plugins: [],
}

