"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const codeBrackets = [
  { char: "{", x: "10%", y: "20%", delay: 0, duration: 15, rotate: 0 },
  { char: "}", x: "85%", y: "15%", delay: 2, duration: 18, rotate: 180 },
  { char: "<", x: "15%", y: "70%", delay: 4, duration: 20, rotate: 90 },
  { char: ">", x: "80%", y: "75%", delay: 6, duration: 16, rotate: -90 },
  { char: "[", x: "25%", y: "45%", delay: 1, duration: 22, rotate: 45 },
  { char: "]", x: "70%", y: "40%", delay: 3, duration: 19, rotate: -45 },
  { char: "(", x: "40%", y: "10%", delay: 5, duration: 17, rotate: 135 },
  { char: ")", x: "60%", y: "85%", delay: 7, duration: 21, rotate: -135 },
  { char: "{", x: "50%", y: "30%", delay: 2.5, duration: 16, rotate: 270 },
  { char: "}", x: "35%", y: "60%", delay: 4.5, duration: 23, rotate: -270 },
  { char: "</>", x: "90%", y: "50%", delay: 1.5, duration: 20, rotate: 0 },
  { char: "{ }", x: "5%", y: "50%", delay: 3.5, duration: 18, rotate: 0 },
];

interface FloatingBracketProps {
  char: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
  rotate: number;
}

const FloatingBracket = ({
  char,
  x,
  y,
  delay,
  duration,
  rotate,
}: FloatingBracketProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: x,
        top: y,
      }}
      initial={{
        opacity: 0,
        scale: 0.5,
        rotate: rotate,
      }}
      animate={{
        opacity: [0, 0.4, 0.6, 0.4, 0],
        scale: [0.5, 1.2, 1, 1.2, 0.5],
        y: [0, -100, -200, -300, -400],
        x: [0, 50, -30, 40, -20],
        rotate: [rotate, rotate + 360, rotate + 720],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span
        className="text-4xl md:text-6xl lg:text-7xl font-mono font-medium bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        style={{
          textShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
        }}
      >
        {char}
      </span>
    </motion.div>
  );
};

export function FloatingCodeBrackets() {
  const brackets = useMemo(
    () =>
      codeBrackets.map((bracket, index) => (
        <FloatingBracket
          key={`${bracket.char}-${index}`}
          char={bracket.char}
          x={bracket.x}
          y={bracket.y}
          delay={bracket.delay}
          duration={bracket.duration}
          rotate={bracket.rotate}
        />
      )),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay for better visibility */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/80" />

      {/* Floating brackets */}
      {brackets}

      {/* Additional ambient effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)]" />
    </div>
  );
}
