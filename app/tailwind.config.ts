import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        seek: {
          purple: "#7C3AED",
          teal: "#14B8A6",
          dark: "#0F0B1A",
          card: "#1A1428",
          border: "#2D2440",
        },
      },
    },
  },
  plugins: [],
};
export default config;
