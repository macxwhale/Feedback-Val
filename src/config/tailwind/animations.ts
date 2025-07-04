
export const keyframes = {
  // Accordion Animations
  "accordion-down": {
    from: { height: "0", opacity: "0" },
    to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
    to: { height: "0", opacity: "0" }
  },

  // Fade Animations
  "fade-in": {
    "0%": {
      opacity: "0",
      transform: "translateY(10px)"
    },
    "100%": {
      opacity: "1",
      transform: "translateY(0)"
    }
  },
  "fade-out": {
    "0%": {
      opacity: "1",
      transform: "translateY(0)"
    },
    "100%": {
      opacity: "0",
      transform: "translateY(10px)"
    }
  },

  // Scale Animations
  "scale-in": {
    "0%": {
      transform: "scale(0.95)",
      opacity: "0"
    },
    "100%": {
      transform: "scale(1)",
      opacity: "1"
    }
  },
  "scale-out": {
    from: { transform: "scale(1)", opacity: "1" },
    to: { transform: "scale(0.95)", opacity: "0" }
  },

  // Slide Animations
  "slide-in-right": {
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(0)" }
  },
  "slide-out-right": {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(100%)" }
  },

  // Google Play Console inspired animations
  "slide-up": {
    "0%": { transform: "translateY(20px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" }
  },
  "slide-down": {
    "0%": { transform: "translateY(-20px)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" }
  },
  "bounce-in": {
    "0%": { transform: "scale(0.3)", opacity: "0" },
    "50%": { transform: "scale(1.05)" },
    "70%": { transform: "scale(0.9)" },
    "100%": { transform: "scale(1)", opacity: "1" }
  },
  "shimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" }
  }
};

export const animation = {
  // Basic Animations
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.3s ease-out",
  "fade-out": "fade-out 0.3s ease-out",
  "scale-in": "scale-in 0.2s ease-out",
  "scale-out": "scale-out 0.2s ease-out",
  "slide-in-right": "slide-in-right 0.3s ease-out",
  "slide-out-right": "slide-out-right 0.3s ease-out",
  
  // Enhanced Animations
  "slide-up": "slide-up 0.4s ease-out",
  "slide-down": "slide-down 0.4s ease-out",
  "bounce-in": "bounce-in 0.6s ease-out",
  "shimmer": "shimmer 2s linear infinite",
  
  // Combined Animations
  "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
  "exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out"
};
