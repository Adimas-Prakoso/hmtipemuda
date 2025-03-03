import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideDown: {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        tiltHover: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
        slideRight: {
          from: { transform: "translateX(-4px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        }
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        slideDown: "slideDown 0.2s ease-in-out",
        shimmer: 'shimmer 2s infinite',
        tiltHover: 'tiltHover 3s ease-in-out infinite',
        slideRight: 'slideRight 0.2s ease-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
export default config;
