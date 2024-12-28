"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

export interface BackgroundBeamsProps {
  className?: string;
  /**
   * The color of the beams. Defaults to a blue gradient.
   */
  beamColor?: string;
  /**
   * The opacity of the beams. Defaults to 0.4.
   */
  beamOpacity?: number;
}

export const BackgroundBeams = React.memo(
  ({
    className,
    beamColor = "#18CCFC",
    beamOpacity = 0.4,
  }: BackgroundBeamsProps) => {
    // Generate paths for the beams
    const paths = Array.from({ length: 50 }, (_, i) => {
      const yOffset = -189 - i * 8;
      const controlPoint1X = -312 + i * 8;
      const controlPoint1Y = 216 - i * 8;
      const controlPoint2X = 152 + i * 7;
      const controlPoint2Y = 343 - i * 8;
      const endX = 684 + i * 7;
      const endY = 875 - i * 8;

      return `M-380 ${yOffset}C-380 ${yOffset} ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y}C${
        controlPoint2X + 464
      } ${controlPoint2Y + 127} ${endX} ${endY} ${endX} ${endY}`;
    });

    return (
      <div
        className={cn(
          "absolute h-full w-full inset-0 [mask-size:40px] [mask-repeat:no-repeat] flex items-center justify-center",
          className
        )}
      >
        <svg
          className="z-0 h-full w-full pointer-events-none absolute"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843"
            stroke="url(#paint0_radial_242_278)"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          />

          {paths.map((path, index) => (
            <motion.path
              key={`path-${index}`}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity={beamOpacity}
              strokeWidth="0.5"
            />
          ))}

          <defs>
            {paths.map((_, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", `${93 + Math.random() * 8}%`],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              >
                <stop stopColor={beamColor} stopOpacity="0" />
                <stop stopColor={beamColor} />
                <stop offset="32.5%" stopColor="#6344F5" />
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
              </motion.linearGradient>
            ))}

            <radialGradient
              id="paint0_radial_242_278"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
            >
              <stop offset="0.0666667" stopColor="var(--neutral-300)" />
              <stop offset="0.243243" stopColor="var(--neutral-300)" />
              <stop offset="0.43594" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  }
);

BackgroundBeams.displayName = "BackgroundBeams";
