/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFD370",
      },
    },
    container: {
      center: true,
      padding: {
        lg: "126px",
      },
    },
  },
  plugins: [],
};
