import { motion } from "framer-motion";

interface BackgroundLinesProps {
  gridSize?: number; // Size of grid squares in pixels
  gridColor?: string; // Color of grid lines
  gridOpacity?: number; // Opacity of grid lines
  streakColor?: string; // Color of the animated streak
  className?: string; // Additional classes for the container
}

export function BackgroundLines({
  gridSize = 100,
  gridColor = "rgb(0,0,0)",
  gridOpacity = 0.08,
  streakColor = "rgb(59, 130, 246)", // Default blue
  className = "",
}: BackgroundLinesProps) {
  // Create gradient steps for a sharp center
  const gradientSteps = [
    "transparent 0%",
    `${streakColor.replace("rgb", "rgba").replace(")", ", 0.1)")} 15%`,
    `${streakColor.replace("rgb", "rgba").replace(")", ", 0.5)")} 25%`,
    `${streakColor.replace("rgb", "rgba").replace(")", ", 1)")} 35%`,
    `${streakColor.replace("rgb", "rgba").replace(")", ", 1)")} 65%`,
    `${streakColor.replace("rgb", "rgba").replace(")", ", 0.5)")} 75%`,
    `${streakColor.replace("rgb", "rgba").replace(")", ", 0.1)")} 85%`,
    "transparent 100%",
  ].join(", ");

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {/* Vertical lines */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, ${gridColor} 0px, ${gridColor} 1px, transparent 1px, transparent ${gridSize}px)`,
              opacity: gridOpacity,
            }}
          />
        </div>

        {/* Horizontal lines */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${gridColor} 0px, ${gridColor} 1px, transparent 1px, transparent ${gridSize}px)`,
              opacity: gridOpacity,
            }}
          />
        </div>

        {/* Horizontal streak */}
        <motion.div
          initial={{ left: 0 }}
          animate={{ left: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1,
          }}
          className="absolute h-[2px] w-[100px]"
          style={{
            top: gridSize,
            background: `linear-gradient(90deg, ${gradientSteps})`,
            transform: "translateX(-50px)",
          }}
        />

        {/* Vertical streak */}
        <motion.div
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
            repeatDelay: 1,
          }}
          className="absolute w-[2px] h-[100px]"
          style={{
            left: gridSize * 3,
            background: `linear-gradient(180deg, ${gradientSteps})`,
            transform: "translateY(-50px)",
          }}
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />
      </motion.div>
    </div>
  );
}
