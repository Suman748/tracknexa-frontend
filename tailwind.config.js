export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#050b1a", 900: "#0a1428", 800: "#0f1d3a", 700: "#16294f" },
        electric: { 400: "#4d94ff", 500: "#2f7bff", 600: "#1a63e6" },
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        ping2: { "0%": { transform: "scale(1)", opacity: 0.6 }, "100%": { transform: "scale(3)", opacity: 0 } },
      },
      animation: { "fade-up": "fadeUp .7s ease-out both", ping2: "ping2 2s ease-out infinite" },
    },
  },
  plugins: [],
};