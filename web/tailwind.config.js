const { colors } = require("@mui/material");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#407CE2',
        'custom-blue-hover': '#2d5bb9',
        'loading': '#6c94e0',
        'dark-bg': '#1a1a1a',
        'light-bg': '#f0f0f0',
        'dark-card': '#2D2D2D',
        'dark-card2': '#3C3C3C',
        'high-pollution': '#FF4444',
        'medium-pollution': '#FFB344',
        'low-pollution': '#4CAF50',
      }
    },
  },
  plugins: [],
}

