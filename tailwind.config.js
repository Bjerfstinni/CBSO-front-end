module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        // Left to right glowing animation sequence for each color
        'underline-move': 'underlineMove 3s linear infinite',
        'glow-green': 'glowGreen 5s ease-in-out infinite',
        'glow-yellow': 'glowYellow 5s ease-in-out infinite',
        'glow-red': 'glowRed 5s ease-in-out infinite',
        'glow-blue': 'glowBlue 5s ease-in-out infinite',
      },
      keyframes: {
        underlineMove: {
          '0%': { transform: 'translateX(-100%)' },
          '35%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Glowing animations for each color
        glowGreen: {
          '0%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
          '50%': { boxShadow: '0 0 8px rgba(0, 255, 0, 0.2), 0 0 12px rgba(0, 255, 0, 0.15)' },
          '100%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
        },
        glowYellow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
          '50%': { boxShadow: '0 0 8px rgba(255, 255, 0, 0.2), 0 0 12px rgba(255, 255, 0, 0.15)' },
          '100%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
        },
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
          '50%': { boxShadow: '0 0 8px rgba(255, 0, 0, 0.2), 0 0 12px rgba(255, 0, 0, 0.15)' },
          '100%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
        },
        glowBlue: {
          '0%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
          '50%': { boxShadow: '0 0 8px rgba(0, 0, 255, 0.2), 0 0 12px rgba(0, 0, 255, 0.15)' },
          '100%': { boxShadow: '0 0 5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
