import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.25rem",
        lg: "1.5rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        ivory: "var(--color-ivory)",
        parchment: "var(--color-parchment)",
        sandal: "var(--color-sandal)",
        espresso: "var(--color-espresso)",
        walnut: "var(--color-walnut)",
        gold: {
          DEFAULT: "var(--color-gold)",
          light: "var(--color-gold-light)",
        },
        tulsi: {
          DEFAULT: "var(--color-tulsi)",
          hover: "var(--color-tulsi-hover)",
        },
        sindoor: "var(--color-sindoor)",
        hairline: "var(--color-hairline)",
        background: "var(--color-ivory)",
        foreground: "var(--color-espresso)",
        primary: {
          DEFAULT: "var(--color-tulsi)",
          foreground: "var(--color-ivory)",
        },
        secondary: {
          DEFAULT: "var(--color-parchment)",
          foreground: "var(--color-espresso)",
        },
        muted: {
          DEFAULT: "var(--color-sandal)",
          foreground: "var(--color-walnut)",
        },
        accent: {
          DEFAULT: "var(--color-gold)",
          foreground: "var(--color-ivory)",
        },
        destructive: {
          DEFAULT: "var(--color-sindoor)",
          foreground: "var(--color-ivory)",
        },
        border: "var(--color-hairline)",
        input: "var(--color-hairline)",
        ring: "var(--color-tulsi)",
      },
      fontFamily: {
        cinzel: ["'Cinzel'", "serif"],
        playfair: ["'Playfair Display'", "serif"],
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
        hindi: ["'Tiro Devanagari Hindi'", "serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        arch: "999px 999px 6px 6px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(41, 24, 14, 0.08)",
        drawer: "-8px 0 32px rgba(41, 24, 14, 0.12)",
      },
      transitionTimingFunction: {
        temple: "cubic-bezier(0.22, 1, 0.36, 1)",
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "200ms",
        base: "320ms",
        slow: "500ms",
        ritual: "900ms",
      },
      keyframes: {
        "bell-swing": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(6deg)" },
        },
        "diya-breathe": {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "bell-swing": "bell-swing 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        "diya-breathe": "diya-breathe 4s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "accordion-down": "accordion-down 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;

