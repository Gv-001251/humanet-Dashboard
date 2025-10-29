/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#1E40AF",
          primaryHover: "#1E3A8A",
          accent: "#3B82F6",
        },
        neutral: {
          background: "#F8FAFC",
          surface: "#FFFFFF",
          border: "#E2E8F0",
          text: "#0F172A",
          subtler: "#475569",
          muted: "#94A3B8",
        },
        semantic: {
          success: "#059669",
          warning: "#D97706",
          error: "#DC2626",
          info: "#0284C7",
        },
      },
      boxShadow: {
        subtle: "0px 10px 30px rgba(15, 23, 42, 0.08)",
        focus: "0px 0px 0px 4px rgba(62, 116, 212, 0.2)",
      },
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
