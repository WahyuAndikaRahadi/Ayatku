/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        secondary: "#0f766e",
        accent: "#fbbf24",
        neutral: "#1f2937",
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
      }
    },
  },
  plugins: [require("daisyui")],
}
