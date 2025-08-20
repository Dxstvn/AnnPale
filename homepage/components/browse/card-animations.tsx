"use client"

import { Variants } from "framer-motion"

// Card entrance animations
export const cardEntranceVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  },
  
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  
  slideIn: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  },
  
  flip: {
    hidden: { 
      opacity: 0, 
      rotateY: 90,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  },
  
  bounce: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  }
}

// Hover animations
export const cardHoverVariants: Record<string, Variants> = {
  lift: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  },
  
  glow: {
    rest: { 
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2
      }
    }
  },
  
  tilt: {
    rest: { rotateZ: 0 },
    hover: { 
      rotateZ: [-1, 1, -1, 0],
      transition: {
        duration: 0.4
      }
    }
  },
  
  pulse: {
    rest: { scale: 1 },
    hover: { 
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity
      }
    }
  }
}

// Tap animations
export const cardTapVariants: Record<string, Variants> = {
  press: {
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  },
  
  ripple: {
    tap: { 
      scale: 0.98,
      opacity: 0.8,
      transition: {
        duration: 0.15
      }
    }
  }
}

// Stagger children animations for grid
export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const gridItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// Loading animations
export const loadingVariants: Record<string, Variants> = {
  shimmer: {
    initial: {
      backgroundPosition: "-200% 0"
    },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  
  pulse: {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  wave: {
    initial: { y: 0 },
    animate: {
      y: [-2, 2, -2],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}

// Exit animations
export const cardExitVariants: Record<string, Variants> = {
  fadeOut: {
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  },
  
  slideOut: {
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 }
    }
  },
  
  scaleOut: {
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  },
  
  collapse: {
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    }
  }
}

// Interaction states
export const interactionVariants: Record<string, Variants> = {
  favorite: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  },
  
  share: {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  },
  
  compare: {
    initial: { 
      borderColor: "transparent",
      borderWidth: "2px"
    },
    animate: {
      borderColor: ["transparent", "#10b981", "transparent"],
      transition: {
        duration: 0.6,
        repeat: 2
      }
    }
  }
}

// Special effects
export const specialEffectVariants: Record<string, Variants> = {
  shine: {
    initial: {
      backgroundImage: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
      backgroundSize: "200% 100%",
      backgroundPosition: "-100% 0"
    },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        duration: 1,
        ease: "linear"
      }
    }
  },
  
  gradient: {
    initial: {
      backgroundImage: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
    },
    animate: {
      backgroundImage: [
        "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
        "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
        "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
        "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
      ],
      transition: {
        duration: 4,
        repeat: Infinity
      }
    }
  }
}

// Scroll-triggered animations
export const scrollVariants: Record<string, Variants> = {
  fadeInUp: {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  },
  
  slideFromLeft: {
    offscreen: {
      x: -100,
      opacity: 0
    },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  },
  
  slideFromRight: {
    offscreen: {
      x: 100,
      opacity: 0
    },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  },
  
  zoomIn: {
    offscreen: {
      scale: 0.5,
      opacity: 0
    },
    onscreen: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  }
}

// Preset combinations
export const animationPresets = {
  default: {
    entrance: cardEntranceVariants.slideUp,
    hover: cardHoverVariants.lift,
    tap: cardTapVariants.press,
    exit: cardExitVariants.fadeOut
  },
  
  elegant: {
    entrance: cardEntranceVariants.fadeIn,
    hover: cardHoverVariants.glow,
    tap: cardTapVariants.ripple,
    exit: cardExitVariants.fadeOut
  },
  
  playful: {
    entrance: cardEntranceVariants.bounce,
    hover: cardHoverVariants.tilt,
    tap: cardTapVariants.press,
    exit: cardExitVariants.scaleOut
  },
  
  modern: {
    entrance: cardEntranceVariants.scale,
    hover: cardHoverVariants.lift,
    tap: cardTapVariants.ripple,
    exit: cardExitVariants.slideOut
  },
  
  dramatic: {
    entrance: cardEntranceVariants.flip,
    hover: cardHoverVariants.pulse,
    tap: cardTapVariants.press,
    exit: cardExitVariants.collapse
  }
}

// Utility function to apply animation preset
export function getAnimationPreset(presetName: keyof typeof animationPresets = "default") {
  return animationPresets[presetName]
}

// Custom hook for card animations
export function useCardAnimation(presetName: keyof typeof animationPresets = "default") {
  const preset = getAnimationPreset(presetName)
  
  return {
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    whileTap: "tap",
    exit: "exit",
    variants: {
      hidden: preset.entrance.hidden,
      visible: preset.entrance.visible,
      hover: preset.hover.hover,
      tap: preset.tap.tap,
      exit: preset.exit.exit
    }
  }
}