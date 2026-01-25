/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#1a1a1a",
        primary: "#00f0ff", // Cyberpunk Cyan
        secondary: "#7000ff", // Neon Purple
        accent: "#ff003c", // Cyberpunk Red
      },
      boxShadow: {
        neon: "0 0 10px rgba(0, 240, 255, 0.7), 0 0 20px rgba(0, 240, 255, 0.5)",
        "neon-purple": "0 0 10px rgba(112, 0, 255, 0.7), 0 0 20px rgba(112, 0, 255, 0.5)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 15s linear infinite",
      },
    },
  },
  plugins: [],
};
