/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "Arial", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#F0F9FF", 100: "#E0F2FE", 200: "#BAE6FD", 300: "#7DD3FC", 
          400: "#38BDF8", 500: "#0EA5E9", 600: "#0284C7", 700: "#0369A1", 
          800: "#075985", 900: "#0C4A6E"
        },
        accent: {
          50: "#ECFDF5", 100: "#D1FAE5", 200: "#A7F3D0", 300: "#6EE7B7", 
          400: "#34D399", 500: "#10B981", 600: "#059669", 700: "#047857", 
          800: "#065F46", 900: "#064E3B"
        },
        ink: {
          900: "#0F172A", 700: "#334155", 600: "#475569", 500: "#64748B"
        }
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(2,132,199,.15)",
        card: "0 8px 30px rgba(0,0,0,.06)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem", 
        "3xl": "1.25rem"
      }
    },
  },
  plugins: [],
}
