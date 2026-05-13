/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--blue-primary)",
        secondary: "var(--text-secondary)",
        accent: "var(--orange-primary)",
        main: "var(--bg-main)",
        surface: "var(--bg-surface)",
        'border-themed': "var(--border)",
        'border-subtle': "var(--border-subtle)",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
}
