import { motion } from "framer-motion";
type Props = {};

/**
 * Deterministic pseudo-random width generator based on index.
 * Uses Math.sin to produce a repeatable pseudo-random value so server
 * and client render the same width (avoids hydration mismatches).
 */
const getRowWidth = (index: number) => {
  // Constants chosen to produce a pseudo-random but deterministic sequence.
  const seed = index + 1;
  const pseudoRandom = Math.abs(
    (Math.sin(seed * 12.9898 + 78.233) * 43758.5453) % 1
  );
  // Map to a percentage between 40% and 100%.
  return Number((40 + pseudoRandom * 60).toFixed(2));
};

const HeroSkeleton = ({}: Props) => {
  return (
    <section id="hero" className="relative py-8">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Main Content Skeleton */}
          <div className="flex flex-col justify-center gap-8">
            {/* Badge Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-4 py-2 w-32 h-6 backdrop-blur"
            >
              <div className="bg-muted-foreground/20 rounded w-full h-full animate-pulse" />
            </motion.div>

            {/* Heading Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-muted-foreground/20 rounded h-12 w-3/4 animate-pulse" />
              <div className="bg-muted-foreground/20 rounded h-8 w-1/2 animate-pulse" />
            </motion.div>

            {/* Bio Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <div className="bg-muted-foreground/20 rounded h-4 w-full animate-pulse" />
              <div className="bg-muted-foreground/20 rounded h-4 w-5/6 animate-pulse" />
              <div className="bg-muted-foreground/20 rounded h-4 w-4/6 animate-pulse" />
            </motion.div>

            {/* CTA Buttons Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <div className="bg-muted-foreground/20 rounded-lg h-12 w-32 animate-pulse" />
              <div className="bg-muted-foreground/20 rounded-lg h-12 w-32 animate-pulse" />
            </motion.div>

            {/* Social Links Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-4 pt-4"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-muted-foreground/20 rounded-lg h-10 w-10 animate-pulse"
                />
              ))}
            </motion.div>
          </div>

          {/* Right Column - Code Terminal Skeleton */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-xl border border-border bg-[#0a0e1a] shadow-2xl"
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-[#151922] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">
                  amirhamza.ts
                </div>
              </div>

              {/* Terminal Content Skeleton */}
              <div className="p-6 font-mono text-sm leading-relaxed">
                <div className="space-y-1">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.1, delay: index * 0.05 }}
                      className="flex items-center"
                      style={{ paddingLeft: `${(index % 4) * 0.5}rem` }}
                    >
                      <div
                        className="bg-muted-foreground/20 rounded h-4 w-full animate-pulse"
                        style={{ width: `${getRowWidth(index)}%` }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tech Marquee Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative mx-auto mt-16 w-[min(100%,64rem)] overflow-hidden rounded-2xl border border-border/50 bg-background/70 py-5 shadow-sm backdrop-blur"
        >
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background via-background/60 to-background opacity-80" />
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            className="flex min-w-full gap-10 whitespace-nowrap text-sm uppercase tracking-[0.4em] text-muted-foreground"
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted-foreground/20 rounded h-4 w-20 animate-pulse"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
