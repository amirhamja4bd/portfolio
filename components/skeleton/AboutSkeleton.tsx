import { motion } from "framer-motion";

type Props = {};

const AboutSkeleton = ({}: Props) => {
  return (
    <section id="about" className="relative scroll-mt-24">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Title Skeleton */}
          <div className="bg-muted-foreground/20 rounded h-10 w-1/3 animate-pulse" />

          {/* Description Skeleton */}
          <div className="space-y-2">
            <div className="bg-muted-foreground/20 rounded h-4 w-full animate-pulse" />
            <div className="bg-muted-foreground/20 rounded h-4 w-5/6 animate-pulse" />
            <div className="bg-muted-foreground/20 rounded h-4 w-4/6 animate-pulse" />
          </div>

          {/* Info Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur"
              >
                <div className="bg-muted-foreground/20 rounded h-4 w-1/4 animate-pulse mb-3" />
                <div className="bg-muted-foreground/20 rounded h-3 w-full animate-pulse mb-1" />
                <div className="bg-muted-foreground/20 rounded h-3 w-5/6 animate-pulse" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column Skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="space-y-4"
        >
          {/* Tabs Skeleton */}
          <div className="rounded-2xl border border-border/60 bg-background/70 p-2 shadow-lg backdrop-blur">
            <div className="relative flex gap-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-lg px-3 py-2.5 bg-muted-foreground/20 animate-pulse h-8"
                />
              ))}
            </div>
          </div>

          {/* Tab Content Skeleton */}
          <div className="rounded-2xl border border-border/60 bg-background/70 shadow-lg backdrop-blur overflow-hidden min-h-[300px] p-6">
            {/* Title Skeleton */}
            <div className="bg-muted-foreground/20 rounded h-4 w-1/3 animate-pulse mb-6" />

            {/* Content Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between gap-6 pb-4 border-b border-border/40 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="bg-muted-foreground/20 rounded h-4 w-3/4 animate-pulse mb-1" />
                    <div className="bg-muted-foreground/20 rounded h-3 w-1/2 animate-pulse" />
                  </div>
                  <div className="bg-muted-foreground/20 rounded h-4 w-12 animate-pulse" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSkeleton;
