/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#141414",
        card: "#1C1C1C",
        border: "#2A2A2A",
        primary: "#6C63FF",
        secondary: "#FF6B6B",
        success: "#4ECDC4",
        warning: "#FFB347",
        "text-primary": "#FFFFFF",
        "text-secondary": "#8B8B8B",
      },
    },
  },
  plugins: [],
};