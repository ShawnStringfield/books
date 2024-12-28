import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        heading: "1.1",
        "heading-sm": "1.2",
      },
      fontFamily: {
        heading: ["var(--font-work-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          surface: "hsla(220, 100%, 97%, 1)",
          subtle: "hsla(220, 100%, 90%, 1)",
          muted: "hsla(220, 100%, 80%, 1)",
          DEFAULT: "hsla(220, 100%, 46%, 1)", // #004eeb
          emphasis: "hsla(220, 100%, 37%, 1)",
          strong: "hsla(220, 100%, 28%, 1)",
        },
        mono: {
          surface: "hsla(210, 40%, 98%, 1)", // slate-50
          divider: "hsla(210, 40%, 96%, 1)", // slate-100
          subtle: "hsla(215, 31%, 91%, 1)", // slate-200
          muted: "hsla(215, 25%, 84%, 1)", // slate-300
          DEFAULT: "hsla(215, 16%, 47%, 1)", // slate-500
          emphasis: "hsla(215, 25%, 27%, 1)", // slate-700
          strong: "hsla(217, 33%, 17%, 1)", // slate-800
        },
        slateDark: {},
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderColor: {
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [animate],
};
export default config;
