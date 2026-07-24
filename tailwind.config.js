/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        jade: "#2C4438",
        ember: "#BE6A34",
        parchment: "#EAE3D2",
        ivory: "#F6F1E4",
        ink: "#2A2118",
        sage: "#8B9A7E",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["'Karla'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
