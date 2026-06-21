/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sumi: "#06080c",
        ink: "#0b1118",
        koi: "#ff365f",
        sakura: "#ff7aa2",
        clinic: "#8df8ff",
        matcha: "#b7ff76",
        washi: "#f4efe4"
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 48px rgba(141, 248, 255, 0.18)",
        pulse: "0 0 32px rgba(255, 54, 95, 0.2)"
      }
    }
  },
  plugins: []
};
