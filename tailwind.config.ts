import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

import { generateColors } from "./src/utils/themes";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      inter: "var(--font-inter)",
      poppins: "var(--font-poppins)",
      roboto: "var(--font-roboto)",
    },
    fontSize: {
      "caption-sm": ["0.625rem", "0.75rem"],
      "caption-md": ["0.75rem", "0.875rem"],
      xsm: ["0.875rem", "1.3125rem"],
      sm: ["1rem", "1.188rem"],
      DEFAULT: ["1.125rem", "1.313rem"],
      md: ["1.25rem", "1.438rem"],
      lg: ["1.375rem", "1.625rem"],
      xl: ["1.5rem", "1.75rem"],
      "2xl": ["1.75rem", "2.063rem"],
      "3xl": ["2rem", "3rem"],
      "4xl": ["2.25rem", "2.625rem"],
      "5xl": ["2.5rem", "2.938rem"],
      "6xl": ["2.75rem", "3.25rem"],
      "7xl": ["3rem", "3.5rem"],
    },
    boxShadow: {
      DEFAULT:
        "0rem 0.063rem 0.188rem 0rem #2222220A, 0rem 0.125rem 0.063rem -0.063rem #22222208",
      sm: "0rem 0.063rem 0.938rem 0rem #6B728014, 0rem 0.25rem 0.625rem 0rem #6B72800A",
      md: "0rem 0.063rem 1.375rem 0rem #22222214, 0rem 0.25rem 0.625rem 0rem #2222220A",
      lg: "0rem 0.188rem 2.063rem 0.125rem #22222214, 0rem 0.5rem 1.125rem 0.063rem #2222220A",
      xl: "0rem 0.313rem 1.375rem 0.25rem #22222214, 0rem 0.75rem 1.063rem 0.125rem #2222220A",
      "2xl":
        "0rem 0.375rem 1.875rem 0.313rem #22222214, 0rem 1rem 1.5rem 0.125rem #2222220A",
      "3xl":
        "0rem 0.5rem 2.375rem 0.438rem #22222214, 0rem 1.25rem 2rem 0.188rem #2222220A",
      "4xl":
        "0rem 0.563rem 2.875rem 0.5rem #22222214, 0rem 1.5rem 2.375rem 0.188rem #2222220A",
      header:
        "0px 2px 5px -1px rgba(34, 34, 34, 0.03), 0px 4px 10px 0px rgba(34, 34, 34, 0.04), 0px 1px 22px 0px rgba(34, 34, 34, 0.08)",
    },
    extend: {
      borderRadius: {
        none: "0.125rem",
        xsm: "0.25rem",
        xl: "2rem",
      },
      colors: {
        tertiary: {
          "100": "#5E5E5E",
          "200": "#868686",
          "300": "#B0B0B0",
          DEFAULT: "#2b2b2b",
        },
        persian: {
          "100": "#415FFF1A",
          "200": "#5973FF",
          "300": "#0A29CC",
          "400": "#006DAD",
          DEFAULT: "#415FFF",
        },
        "sun-glow": {
          "100": "#FFC24C4D",
          "200": "#FFC24C",
          "300": "#C78300",
          "400": "#FF8625",
          DEFAULT: "#FBA600",
        },
        "electric-purple": {
          "100": "#9F00FF1A",
          "200": "#9F00FF",
          DEFAULT: "#9F00FF",
        },
        slate: {
          "100": "#FAFAFA",
          "200": "#727894",
          "300": "#F2F2F2",
          DEFAULT: "#C1C2C7",
        },
        info: "#4317C9",
        none: "transparent",
      },
    },
  },
  plugins: [
    heroui({
      prefix: "nextui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {
        boxShadow: {
          small:
            "0rem 0.063rem 0.938rem 0rem #6B728014, 0rem 0.25rem 0.625rem 0rem #6B72800A",
          medium:
            "0rem 0.188rem 2.063rem 0.125rem #22222214, 0rem 0.5rem 1.125rem 0.063rem #2222220A",
          large:
            "0rem 0.563rem 2.875rem 0.5rem #22222214, 0rem 1.5rem 2.375rem 0.188rem #2222220A",
        },
        radius: {
          small: "0.5rem",
          medium: "0.75rem",
          large: "1.5rem",
        },
      },
      themes: {
        light: {
          colors: {
            primary: generateColors("primary"),
            secondary: generateColors("secondary"),
            danger: generateColors("danger"),
            warning: generateColors("warning"),
            success: generateColors("success"),
            background: generateColors("background"),
          },
        },
      },
    }),
  ],
};
export default config;
