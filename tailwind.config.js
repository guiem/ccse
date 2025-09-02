/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        popin: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        floatup: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-60px)", opacity: "0" }
        },
        burst: {
          "0%": { transform: "translate(0,0) scale(0.6)", opacity: "1" },
          "100%": { transform: "translate(var(--dx), var(--dy)) scale(1.2)", opacity: "0" }
        }
      },
      animation: {
        popin: "popin .25s ease-out forwards",
        floatup: "floatup .8s ease-out forwards",
        burst: "burst .8s ease-out forwards"
      }
    }
  },
  plugins: [],
}