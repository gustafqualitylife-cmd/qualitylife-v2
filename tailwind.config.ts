import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#f1f8f5",100:"#e3f1eb",200:"#c2e0d3",300:"#9ecdb9",400:"#5fb18e",
          500:"#2e9b72",600:"#24815f",700:"#1d6a4f",800:"#15513d",900:"#0e3a2c"
        }
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.08)" }
    },
  },
  plugins: [],
} satisfies Config;
