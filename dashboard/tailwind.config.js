/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxxs: "10px",
        xxs: "11px",
      },
      colors: {
        BazGrey: "#B2BCCA",
        BazBlue: "#4E709D",
        BazBlueHover: "#436189",
        BazOrange: "#F5B17B",
        BazSkyBlue: "#F4F9FF",
        BazDarkGray: "#4F4F4F",
        BazRed: "#E21010",
      },
      animation: {
        "scale-up-tr":
          "scale-up-tr 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
        drawer: "drawerAnim 0.25s ease-out",
        "drawer-out": "drawerAnimOut 0.25s ease-out",
      },
      keyframes: {
        "scale-up-tr": {
          "0%": {
            transform: "translateX(100%)",
            transformOrigin: "100% 100%",
          },
          "90%": {
            transform: "translateX(-10%)",
            transformOrigin: "100% 100%",
          },
          "100%": {
            transform: "translateX(0%)",
            transformOrigin: "100% 100%",
          },
        },
        drawerAnim: {
          "0%": { right: "-100%" },
          "100%": { right: "0" },
        },
        drawerAnimOut: {
          "0%": { right: "0" },
          "100%": { right: "-100%" },
        },
      },
    },
    extend: {
      fontSize: {
        xxxs: "10px",
        xxs: "11px",
      },
      colors: {
        BazGrey: "#B2BCCA",
        BazBlue: "#4E709D",
        BazBlueHover: "#436189",
        BazOrange: "#F5B17B",
        BazSkyBlue: "#F4F9FF",
        BazDarkGray: "#4F4F4F",
        BazRed: "#E21010",
      },
      keyframes: {
        drawerAnim: {
          "0%": { right: "-100%" },
          "100%": { right: "0" },
        },
        drawerAnimOut: {
          "0%": { right: "0" },
          "100%": { right: "-100%" },
        },
      },
      animation: {
        drawer: "drawerAnim 0.25s ease-out",
        "drawer-out": "drawerAnimOut 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
