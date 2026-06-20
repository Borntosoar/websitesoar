import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // STATIC — cold, hard monochrome. Glitch channels are the only colour.
        ink: "#000000",
        paper: "#ffffff",
        ash: "#9a9a9a",
        smoke: "#1a1a1a",
        line: "rgba(0,0,0,0.14)",
        "line-i": "rgba(255,255,255,0.16)",
        glitchC: "#00f0ff",
        glitchM: "#ff006a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.04em" },
      maxWidth: { frame: "1600px" },
      transitionTimingFunction: { cut: "cubic-bezier(0.2,0,0,1)" },
    },
  },
  plugins: [],
};

export default config;
