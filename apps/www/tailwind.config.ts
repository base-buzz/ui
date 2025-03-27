import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
      },
      backgroundSize: {
        "200%": "200%",
      },
    },
  },
  plugins: [],
};

export default config;
