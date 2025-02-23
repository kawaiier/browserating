/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-out": {
          "0%": { opacity: "1" },
          "75%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "bounce-gentle": {
          "0%, 100%": {
            transform: "rotate(12deg) translateY(-5%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "rotate(12deg) translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "fade-out": "fade-out 2s ease-out forwards",
        "bounce-gentle": "bounce-gentle 2s infinite",
      },
    },
  },
  plugins: [],
};
