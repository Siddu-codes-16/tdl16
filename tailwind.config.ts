import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          50: "#090d16",
          100: "#0f172a",
          200: "#1e293b",
          300: "#334155",
          400: "#475569",
        },
        brand: {
          primary: "#6366f1",
          secondary: "#a855f7",
          accent: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        }
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(0.5deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", filter: "blur(20px)" },
          "50%": { opacity: "0.8", filter: "blur(28px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        }
      },
      boxShadow: {
        "glass-sm": "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "glass-md": "0 12px 40px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.12)",
        "glass-lg": "0 20px 50px 0 rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.15)",
        "3d-glow": "0 10px 30px -5px rgba(99, 102, 241, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
