"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { FloatingCodeBrackets } from "./floating-code-brackets";

const blobs = [
  { size: 520, hue: 210, duration: 18 },
  { size: 420, hue: 280, duration: 22 },
  { size: 360, hue: 160, duration: 26 },
];

export function AnimatedBackground() {
  const gradients = useMemo(
    () =>
      blobs.map(({ size, hue, duration }, index) => {
        const delay = index * 4;
        return (
          <motion.div
            key={hue}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-[120px]"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 50% 50%, hsl(${hue} 95% 65% / 0.55), transparent 55%)`,
            }}
            initial={{ scale: 0.9, opacity: 0.65, rotate: 0 }}
            animate={{
              scale: [0.9, 1.05, 0.95],
              opacity: [0.6, 0.8, 0.7],
              rotate: [0, 120, -120],
            }}
            transition={{
              duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
              delay,
            }}
          />
        );
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <FloatingCodeBrackets />
      {/* Transparent animated grid overlay */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute inset-0 animate-[pulse_10s_linear_infinite]"
          style={{
            // backgroundImage: `
            //   linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            //   linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)
            // `,
            backgroundImage: `
                  linear-gradient(rgba(34,211,238,0.25) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(168,85,247,0.25) 1px, transparent 1px)
                `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 60%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 60%, transparent 100%)",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[conic-gradient(from_120deg_at_20%_20%,hsl(222_85%_20%/0.6),hsl(293_75%_14%/0.7),hsl(182_70%_18%/0.5),hsl(222_85%_20%/0.6))] opacity-75 mix-blend-plus-lighter" />
      <div className="absolute inset-0 animate-[pulse_14s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top_right,hsl(210_95%_75%/0.15),transparent_55%)]" />
      {gradients}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(280_95%_75%/0.15),transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(160_95%_75%/0.12),transparent_60%)]" />
    </div>
  );
}
