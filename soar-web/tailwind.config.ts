import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // SOAR muted-neutral system (see the soar-brand skill)
        oat: "#FFFFFF",
        paper: "#F5F5F5",
        stone: "#D4D4D4",
        taupe: "#8A8A8A",
        ink: "#000000",
        espresso: "#000000",
        bone: "#FFFFFF",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
