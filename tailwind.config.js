// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{html,ts}"],
//   theme: {
//     extend: {
//       colors: {
//         transparent: "transparent",
//         green: "#72FF72",
//         red: "#C50F1F",
//         grey: "#808080",
//       },
//     },
//   },
//   plugins: [],
// };

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{ts,html,scss}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ["Roboto", "Helvetica Neue", "sans-serif", ...fontFamily.sans],
    },
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          a100: "var(--primary-a100)",
          a200: "var(--primary-a200)",
          a400: "var(--primary-a400)",
          a700: "var(--primary-a700)",
        },
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
          a100: "var(--accent-a100)",
          a200: "var(--accent-a200)",
          a400: "var(--accent-a400)",
          a700: "var(--accent-a700)",
        },
        warn: {
          50: "var(--warn-50)",
          100: "var(--warn-100)",
          200: "var(--warn-200)",
          300: "var(--warn-300)",
          400: "var(--warn-400)",
          500: "var(--warn-500)",
          600: "var(--warn-600)",
          700: "var(--warn-700)",
          800: "var(--warn-800)",
          900: "var(--warn-900)",
          a100: "var(--warn-a100)",
          a200: "var(--warn-a200)",
          a400: "var(--warn-a400)",
          a700: "var(--warn-a700)",
        },
        contrast: {
          50: "var(--contrast-50)",
          100: "var(--contrast-100)",
          200: "var(--contrast-200)",
          300: "var(--contrast-300)",
          400: "var(--contrast-400)",
          500: "var(--contrast-500)",
          600: "var(--contrast-600)",
          700: "var(--contrast-700)",
          800: "var(--contrast-800)",
          900: "var(--contrast-900)",
          a100: "var(--contrast-a100)",
          a200: "var(--contrast-a200)",
          a400: "var(--contrast-a400)",
          a700: "var(--contrast-a700)",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
