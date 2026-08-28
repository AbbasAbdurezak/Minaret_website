import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0d0f",
        coal: "#11151a",
        stone: "#d6d0c4",
        gold: "#c5a46d",
        copper: "#a66a45",
        mist: "#f6f3ed"
      },
      boxShadow: {
        glow: "0 24px 90px rgba(197, 164, 109, 0.18)"
      },
      backgroundImage: {
        "radial-light": "radial-gradient(circle at 20% 20%, rgba(197,164,109,0.18), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
