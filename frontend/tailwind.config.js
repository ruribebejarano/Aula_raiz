/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f1f6f2",
          100: "#dcebe0",
          600: "#2f5d3f",
          700: "#234730",
          800: "#1f3d2b",
          900: "#152a1d",
        },
        terracotta: {
          100: "#f6e3d8",
          400: "#d98a5f",
          500: "#c9693a",
          600: "#b2552b",
        },
        ivory: {
          50: "#faf7f0",
          100: "#f3eee1",
        },
      },
      fontFamily: {
        sans: ["Atkinson Hyperlegible", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
