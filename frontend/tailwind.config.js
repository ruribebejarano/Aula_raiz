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
        sans: ["Nunito", "Nunito Sans", "system-ui", "sans-serif"],
        display: ["Nunito", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(31, 61, 43, 0.12)",
        lift: "0 10px 24px -8px rgba(31, 61, 43, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
