import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: '#f7f7f7',
        text: 'black',
        primary: '#f16024 ',
        secondary: '#F1602417',
        accent: '#666666',
        mutedGray: '#2c3345',
        mutedGray2:"#f3f3fe",
        mutedGray3:"#d7d8e1",
        onFocusBG:"#f1f5ff",
      },
      fontFamily: {
  primary: [
    'Poppins',
    'Helvetica Neue',
    'Lucida Grande',
    'Lucida Sans Unicode',
    'Arial',
    'Open Sans',
    'sans-serif',
  ],
  Classic: ['Cormorant Garamond', 'serif'],
  Elegant: ['EB Garamond', 'serif'],
  Crimson: ['Crimson Pro', 'serif'],
  Vibes: ['Great Vibes', 'cursive'],
  open: ['Open Sans', 'sans-serif'],
  poppins: ['Poppins', 'sans-serif'],
},
    },
  },
  plugins: [require('tailwindcss-textshadow')],
};

export default config;
