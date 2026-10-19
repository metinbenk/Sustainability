import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1c2e",
        spruce: "#1a4d3e",
        moss: "#2f6b55",
        sand: "#e8e2d6",
        mist: "#f3f0ea",
        clay: "#b85c38",
        slate: "#5a6a7a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
