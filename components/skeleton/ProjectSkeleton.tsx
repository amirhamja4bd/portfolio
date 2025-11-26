"use client";

import { motion, Variants } from "framer-motion";
import { FC } from "react";

type Props = {
  // You can add props here if needed in the future
};

const ProjectSkeleton: FC<Props> = ({}) => {
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

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 h-10 w-32 bg-muted rounded-md relative overflow-hidden"
      >
        <motion.div {...fadeAnimation} className="absolute inset-0 bg-muted" />
        <motion.div
          {...shimmerAnimation}
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
        />
      </motion.div>

      {/* Content section */}
      <div className="space-y-6 mb-12">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-6 w-24 bg-muted rounded relative overflow-hidden"
        >
          <motion.div
            {...fadeAnimation}
            className="absolute inset-0 bg-muted"
          />
          <motion.div
            {...shimmerAnimation}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-12 w-3/4 bg-muted rounded relative overflow-hidden"
        >
          <motion.div
            {...fadeAnimation}
            className="absolute inset-0 bg-muted"
          />
          <motion.div
            {...shimmerAnimation}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="h-6 w-full max-w-3xl bg-muted rounded relative overflow-hidden"
        >
          <motion.div
            {...fadeAnimation}
            className="absolute inset-0 bg-muted"
          />
          <motion.div
            {...shimmerAnimation}
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </div>

      {/* Image placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border mb-12 h-[500px] bg-muted"
      >
        <motion.div {...fadeAnimation} className="absolute inset-0 bg-muted" />
        <motion.div
          {...shimmerAnimation}
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default ProjectSkeleton;
