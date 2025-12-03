"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const cursor = "|";

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Animated code lines
  const codeLines = [
    "function buildPortfolio() {",
    "  return {",
    "    skills: ['React', 'Next.js', 'TypeScript'],",
    "    passion: 'Creating amazing experiences'",
    "  };",
    "}",
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden h-screen bg-linear-to-b from-background via-background to-background"
        >
          {/* Animated Background Grid Pattern */}
          <div className="absolute inset-0 opacity-100 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34,211,238,0.25) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(168,85,247,0.25) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
                maskImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 60%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 60%, transparent 100%)",
              }}
            />
          </div>

          {/* Floating Code Brackets */}
          {["{", "}", "<", ">", "(", ")", "[", "]"].map((bracket, i) => {
            // Generate random positions for each bracket ONCE per render
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            return (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: Math.random() * 100 - 50,
                  x: Math.random() * 100 - 50,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  y: Math.random() * 200 - 100,
                  x: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="absolute text-6xl font-mono text-cyan-400/20"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
              >
                {bracket}
              </motion.div>
            );
          })}

          {/* Animated Background Blurs */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/4 left-1/8 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-1/4 right-1/8 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
            />
          </div>
          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-4">
            {/* Code Terminal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl bg-slate-900 backdrop-blur-md rounded-lg border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden mb-8"
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 border-b border-cyan-500/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-400 font-mono">
                    terminal.exe
                  </span>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm">
                {/* Typing Animation */}
                <div className="mb-4">
                  <span className="text-cyan-400">const</span>{" "}
                  <span className="text-violet-400">engineer</span>{" "}
                  <span className="text-emerald-400">=</span>{" "}
                  <span className="text-cyan-400">new</span>{" "}
                  <span className="text-yellow-400">SoftwareEngineer</span>
                  <span className="text-emerald-400">()</span>
                  <span className="text-slate-300">;</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-cyan-400 ml-1"
                  >
                    {cursor}
                  </motion.span>
                </div>

                {/* Code Lines */}
                <div className="space-y-1">
                  {codeLines.map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 0.6, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                      className="flex gap-4"
                    >
                      <span className="text-slate-500 text-xs w-6 text-right">
                        {index + 1}
                      </span>
                      <pre
                        className={
                          line.includes("function")
                            ? "text-violet-400"
                            : line.includes("return")
                            ? "text-cyan-400"
                            : line.includes("skills") ||
                              line.includes("passion")
                            ? "text-emerald-400"
                            : line.includes("'")
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      >
                        {line}
                      </pre>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Software Engineer Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-2 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <span className="bg-linear-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  {"<SoftwareEngineer />"}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-slate-400 text-sm md:text-base font-mono mt-4"
              >
                {"// Building the future, one line at a time"}
              </motion.p>

              {/* Loading Animation */}
              <div className="flex gap-2 justify-center mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Tech Stack Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex gap-4 mt-8"
            >
              {["</>", "{}", "[]", "()"].map((symbol, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="text-2xl text-cyan-400/40 font-mono"
                >
                  {symbol}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="h-full bg-linear-to-r from-cyan-400 via-violet-400 to-emerald-400"
            />
          </motion.div>

          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-400/30" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-violet-400/30" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-emerald-400/30" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-400/30" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
