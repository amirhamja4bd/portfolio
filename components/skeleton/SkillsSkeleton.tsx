import { motion } from "framer-motion";

type Props = {};

const SkillsSkeleton = ({}: Props) => {
  return (
    <div className="mt-8">
      {/* Category Tabs Skeleton */}
      <div className="flex justify-center">
        <div className="rounded-2xl border border-border/60 bg-background/70 p-2 shadow-lg backdrop-blur w-fit">
          <div className="relative flex flex-wrap gap-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg px-4 py-2.5 bg-muted-foreground/20 animate-pulse h-8 w-20"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 grid gap-5 md:grid-cols-2"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-6 shadow-lg backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <div className="bg-muted-foreground/20 rounded h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="bg-muted-foreground/20 rounded h-4 w-24 animate-pulse mb-1" />
                  <div className="bg-muted-foreground/20 rounded h-3 w-16 animate-pulse" />
                </div>
              </div>
              <div className="bg-muted-foreground/20 rounded-full h-6 w-12 animate-pulse" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="bg-muted-foreground/20 rounded h-3 w-full animate-pulse" />
              <div className="bg-muted-foreground/20 rounded h-3 w-5/6 animate-pulse" />
            </div>
            <div className="mt-5 h-2 w-full rounded-full bg-muted">
              <div className="bg-muted-foreground/20 rounded-full h-full w-3/4 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SkillsSkeleton;
