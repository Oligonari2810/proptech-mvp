module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "geist-sans": ["Geist Sans", "sans-serif"],
        "geist-mono": ["Geist Mono", "monospace"],
      },
      colors: {
        "custom-background": "#f0f0f0",
        "custom-foreground": "#171717",
      },
    },
  },
  plugins: [],
};

