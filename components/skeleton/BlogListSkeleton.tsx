"use client";

import { motion, Variants } from "framer-motion";
import { FC } from "react";

type Props = {
  count?: number;
};

const BlogListSkeleton: FC<Props> = ({ count = 6 }) => {
  const shimmerAnimation: Variants = {
    initial: { x: "-100%", opacity: 0.5 },
    animate: {
      x: "100%",
      opacity: 0.8,
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatDelay: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const fadeAnimation: Variants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: 0.7,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  };

  const cards = Array.from({ length: count }).map((_, i) => i);

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => (
        <motion.article
          key={c}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: c * 0.04 }}
          className="group relative overflow-hidden rounded-3xl border bg-card transition-all"
        >
          <motion.div className="relative w-full overflow-hidden bg-muted aspect-video">
            <motion.div
              {...fadeAnimation}
              className="absolute inset-0 bg-muted"
            />
            <motion.div
              {...shimmerAnimation}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.div>

          <div className="p-4 md:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="h-3 w-20 rounded bg-muted relative overflow-hidden">
                <motion.div
                  {...fadeAnimation}
                  className="absolute inset-0 bg-muted"
                />
                <motion.div
                  {...shimmerAnimation}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
              <div className="h-3 w-16 rounded bg-muted relative overflow-hidden">
                <motion.div
                  {...fadeAnimation}
                  className="absolute inset-0 bg-muted"
                />
                <motion.div
                  {...shimmerAnimation}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </div>

            <div className="h-6 md:h-8 w-3/4 bg-muted rounded-md relative overflow-hidden mb-2">
              <motion.div
                {...fadeAnimation}
                className="absolute inset-0 bg-muted"
              />
              <motion.div
                {...shimmerAnimation}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              />
            </div>

            <div className="h-3 w-24 rounded bg-muted relative overflow-hidden mb-3">
              <motion.div
                {...fadeAnimation}
                className="absolute inset-0 bg-muted"
              />
              <motion.div
                {...shimmerAnimation}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              />
            </div>

            <div className="h-12 w-full max-w-full bg-muted rounded relative overflow-hidden mb-3">
              <motion.div
                {...fadeAnimation}
                className="absolute inset-0 bg-muted"
              />
              <motion.div
                {...shimmerAnimation}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
              />
            </div>

            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-muted relative overflow-hidden">
                <motion.div
                  {...fadeAnimation}
                  className="absolute inset-0 bg-muted"
                />
                <motion.div
                  {...shimmerAnimation}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
              <div className="h-6 w-16 rounded bg-muted relative overflow-hidden">
                <motion.div
                  {...fadeAnimation}
                  className="absolute inset-0 bg-muted"
                />
                <motion.div
                  {...shimmerAnimation}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default BlogListSkeleton;
