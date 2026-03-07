const tailwindAdditions = {
    theme: {
      extend: {
        keyframes: {
          shake: {
            "0%, 100%": { transform: "translateX(0)" },
            "15%": { transform: "translateX(-5px)" },
            "30%": { transform: "translateX(5px)" },
            "45%": { transform: "translateX(-4px)" },
            "60%": { transform: "translateX(4px)" },
            "75%": { transform: "translateX(-2px)" },
            "90%": { transform: "translateX(2px)" },
          },
          shimmer: {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        },
        animation: {
          shake: "shake 0.5s ease-in-out",
          shimmer: "shimmer 0.6s ease-in-out",
        },
      },
    },
  };
  
  export default tailwindAdditions;