/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        fade: "fadeIn 0.5s ease-in-out",
      },
      keyframes: () => ({
        fadeIn: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
      }),
      colors: {
        "pine-green": "#0C322C",
        "jungle-green": {
          100: "#E4F6EE",
          300: "#98DDBC",
          500: "#30BA78",
          900: "#0E7E3C",
        },
        "midnight-blue": "#192072",
        "waterhole-blue": "#2453FF",
        mint: "#90EBCD",
        persimmon: "#FE7C3F",
        fog: "#EFEFEF",
      },
    },
    fontFamily: {
      sans: ["Lato"],
    },
  },
  plugins: [],
};
