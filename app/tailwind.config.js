/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F4E8D0",
        pearl: "#FFF7E8",
        champagne: "#D8B46A",
        antiquegold: "#B88A3B",
        deepgold: "#8A6428",
        deepbrown: "#3A2414",
        maroonseal: "#5A1F16",
        softglow: "#F8D98B",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        script: ['"Great Vibes"', "cursive"],
        body: ['"Cormorant Garamond"', '"Lora"', "serif"],
        hindi: ['"Noto Serif Devanagari"', "serif"],
      },
      boxShadow: {
        card: "0 30px 60px -20px rgba(58, 36, 20, 0.55), 0 10px 20px rgba(58, 36, 20, 0.25)",
        innerpaper: "inset 0 0 30px rgba(184, 138, 59, 0.18), inset 0 0 60px rgba(255, 247, 232, 0.4)",
        jewel: "inset 0 1px 2px rgba(255,247,232,0.9), inset 0 -2px 4px rgba(58,36,20,0.25), 0 4px 8px rgba(58,36,20,0.18)",
        seal: "0 6px 14px rgba(90, 31, 22, 0.35), inset 0 1px 0 rgba(255, 247, 232, 0.25)",
      },
      animation: {
        shine: "shine 6s ease-in-out infinite",
        glint: "glint 7s ease-in-out infinite",
        floatdust: "floatdust 14s linear infinite",
        slowpulse: "slowpulse 5s ease-in-out infinite",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "60%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glint: {
          "0%, 80%, 100%": { transform: "translateX(-120%)", opacity: "0" },
          "40%": { opacity: "0.7" },
          "60%": { transform: "translateX(120%)", opacity: "0" },
        },
        floatdust: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "80%": { opacity: "0.4" },
          "100%": { transform: "translateY(-120vh) translateX(20px)", opacity: "0" },
        },
        slowpulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
